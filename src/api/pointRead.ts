export interface GetSampleArgs {
  category: number; // 0..3
  language: string; // e.g. 'en'
}

export interface SampleResponse {
  text: string;
  ipa?: string;
  translation?: string;
}

export interface ScoreArgs {
  title: string;
  base64Audio: string; // full data URL
  language: string;
}

export interface ScoreResponse {
  real_transcript: string;
  ipa_transcript: string;
  pronunciation_accuracy: string; // int as string
  real_transcripts: string;
  matched_transcripts: string;
  real_transcripts_ipa: string;
  matched_transcripts_ipa: string;
  pair_accuracy_category: string; // space separated ints
  start_time: string; // space separated seconds
  end_time: string;   // space separated seconds
  is_letter_correct_all_words: string; // e.g., "111 110 01"
}

// Use any to avoid TS complaining in environments without vite env typing
const VITE_ENV = (import.meta as any).env || {}
export const V_SAMPLE = VITE_ENV.VITE_API_SAMPLE_BASE_URL as string | undefined
export const V_STS = VITE_ENV.VITE_API_STS_BASE_URL as string | undefined
export const V_TTS = VITE_ENV.VITE_API_TTS_BASE_URL as string | undefined
export const V_KEY = VITE_ENV.VITE_API_KEY as string | undefined

const DEV_FALLBACK = 'http://127.0.0.1:3000'

// one-time env sanity log in dev
if ((import.meta as any).env?.DEV) {
  // eslint-disable-next-line no-console
  console.info('[pointRead env]', { VITE_API_SAMPLE_BASE_URL: V_SAMPLE, VITE_API_STS_BASE_URL: V_STS, VITE_API_TTS_BASE_URL: V_TTS })
}

async function parseJsonFlexible(res: Response): Promise<any> {
  try {
    const txt = await res.text()
    if ((import.meta as any).env?.DEV) {
      // eslint-disable-next-line no-console
      console.info('[score] raw body (trimmed)', txt.slice(0, 200))
    }
    try { return JSON.parse(txt) } catch { return txt }
  } catch (e1) {
    if ((import.meta as any).env?.DEV) {
      // eslint-disable-next-line no-console
      console.error('[pointRead] response parse failed', e1)
    }
    throw e1
  }
}

function headers() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (V_KEY && V_KEY.length > 0) h['X-Api-Key'] = V_KEY;
  return h;
}

export async function getSample(args: GetSampleArgs): Promise<SampleResponse> {
  const base = V_SAMPLE || ((import.meta as any).env?.DEV ? DEV_FALLBACK : undefined)
  if (!base) {
    return { text: 'I like English' }
  }
  const res = await fetch(`${base}/getSample`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ category: String(args.category), language: args.language })
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${base}/getSample`)
  const data = await parseJsonFlexible(res)
  const realTranscript = Array.isArray(data.real_transcript) ? data.real_transcript[0] : data.real_transcript;
  return {
    text: realTranscript,
    ipa: data.ipa_transcript,
    translation: data.transcript_translation
  };
}

function hasValidScore(data: any): boolean {
  try {
    const p = parseInt(String((data as any)?.pronunciation_accuracy ?? ''), 10)
    return Number.isFinite(p)
  } catch { return false }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function scoreRecording(args: ScoreArgs): Promise<ScoreResponse> {
  const base = V_STS || ((import.meta as any).env?.DEV ? DEV_FALLBACK : undefined)
  if (!base) throw new Error('VITE_API_STS_BASE_URL not configured')
  const url = `${base}/GetAccuracyFromRecordedAudio`
  const payload = JSON.stringify({ title: args.title, base64Audio: args.base64Audio, language: args.language })

  const delays = [1500, 3000, 5000]
  let attempt = 0
  let lastErr: any = null

  while (attempt <= delays.length) {
    const tryIdx = attempt + 1
    try {
      if ((import.meta as any).env?.DEV) {
        // eslint-disable-next-line no-console
        console.info('[score] try', tryIdx, 'url', url, 'bytes', Math.round((args.base64Audio?.length || 0) * 3 / 4))
      }
      const res = await fetch(url, { method: 'POST', headers: headers(), body: payload })
      const status = res.status
      if (!res.ok) {
        if ((import.meta as any).env?.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[score] non-ok', status, url)
        }
        if ([502, 504, 524].includes(status)) throw new Error(String(status))
        throw new Error(`${status} ${res.statusText}`)
      }
      let data: any = await parseJsonFlexible(res)
      if (data && typeof data.body === 'string') {
        if (data.body.trim() === '') data = {}
        else { try { data = JSON.parse(data.body) } catch {} }
      }
      if (!data || isColdStartEmptyScore(data) || !hasValidScore(data)) {
        if (attempt === delays.length) {
          if ((import.meta as any).env?.DEV) {
            // eslint-disable-next-line no-console
            console.warn('[score] empty/cold response after retries', data)
          }
          throw new Error('Cold start: no score returned')
        }
      } else {
        return data as ScoreResponse
      }
    } catch (e) {
      lastErr = e
    }
    await sleep(delays[attempt] || 1500)
    attempt += 1
  }
  throw lastErr || new Error('Scoring service warm-up failed')
}

export async function tts(text: string): Promise<ArrayBuffer> {
  const base = V_TTS || ((import.meta as any).env?.DEV ? DEV_FALLBACK : undefined)
  if (!base) throw new Error('TTS not configured')
  const primary = base.endsWith('/tts') || base.endsWith('/getAudioFromText') ? base : `${base}/tts`
  const candidates = [primary, `${base}/getAudioFromText`]
  let lastErr: any = null
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ value: text })
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} @ ${url}`)
      let data = await res.json();
      if (!('wavBase64' in data) && data && typeof data.body === 'string') {
        try { data = JSON.parse(data.body) } catch {}
      }
      const b64 = data.wavBase64 as string;
      if (!b64) throw new Error('wavBase64 not found in TTS response')
      const binary = atob(b64);
      const len = binary.length;
      const buffer = new Uint8Array(len);
      for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i);
      return buffer.buffer;
    } catch (e) {
      lastErr = e
      continue
    }
  }
  throw lastErr || new Error('TTS request failed')
}

export function isColdStartEmptyScore(resp: any): boolean {
  if (!resp) return true;
  if (typeof resp === 'string' && resp.trim() === '') return true;
  if (typeof resp === 'object' && Object.keys(resp).length === 0) return true;
  return false;
} 