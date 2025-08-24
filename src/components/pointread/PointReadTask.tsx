import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { X, Play, Mic, ChevronRight } from 'lucide-react'
import { getSample, scoreRecording, tts, type ScoreResponse, isColdStartEmptyScore } from '../../api/pointRead'

interface PointReadTaskProps {
  onClose: () => void
}

export default function PointReadTask({ onClose }: PointReadTaskProps) {
  const [language] = useState<'en'>('en')
  const [category] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [warmingUp, setWarmingUp] = useState<boolean>(false)

  const [sentence, setSentence] = useState<string>('')
  const [scorePct, setScorePct] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedAudioEl = useRef<HTMLAudioElement | null>(null)
  const recordedDataChunks = useRef<BlobPart[]>([])
  const recordedDataUrlRef = useRef<string>('')
  const lastResultRef = useRef<ScoreResponse | null>(null)

  useEffect(() => {
    const init = async () => {
      await ensureMedia()
      await fetchNewSample()
      try {
        setWarmingUp(true)
        // send a short silent audio warm-up (~300ms of silence at 48kHz)
        const silence = generateSilentDataUrl(0.3, 48000)
        await scoreRecording({ title: 'warmup', base64Audio: silence, language })
      } catch {} finally { setWarmingUp(false) }
    }
    init()
  }, [])

  const ensureMedia = async () => {
    try {
      if (mediaRecorderRef.current) return
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 48000 } })
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = (e) => { recordedDataChunks.current.push(e.data) }
      mr.onstop = async () => {
        try {
          const blob = new Blob(recordedDataChunks.current, { type: 'audio/ogg' })
          recordedDataChunks.current = []
          const url = URL.createObjectURL(blob)
          const dataUrl = await blobToDataUrl(blob)
          recordedDataUrlRef.current = dataUrl
          if (recordedAudioEl.current) recordedAudioEl.current.src = url
          setIsRecording(false)
          // Debug log for confirmation
          if ((import.meta as any).env?.DEV) {
            // eslint-disable-next-line no-console
            console.info('[pointRead] recorded blob bytes', blob.size)
          }
        } catch (e: any) {
          setError(`Audio finalize error: ${e?.message || e}`)
        }
      }
      mediaRecorderRef.current = mr
    } catch (e: any) {
      setError(e?.message?.includes('NotAllowedError') ? 'Microphone permission is required.' : `Mic error: ${e?.message || e}`)
    }
  }

  const fetchNewSample = async () => {
    setLoading(true)
    setError(null)
    setScorePct(null)
    try {
      const s = await getSample({ category, language })
      const text = s.text
      setSentence(text)
      lastResultRef.current = null
    } catch (e: any) {
      setError(`Couldn't fetch a sentence. ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  const onPlaySample = async () => {
    try {
      await tryBackendTTS(sentence)
    } catch (e: any) {
      setError(`TTS error: ${e?.message || e}. Falling back to device voice.`)
      const utter = new SpeechSynthesisUtterance(sentence)
      window.speechSynthesis.speak(utter)
    }
  }

  const tryBackendTTS = async (text: string) => {
    const buffer = await tts(text)
    const blob = new Blob([buffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    new Audio(url).play()
  }

  const onRecordToggle = async () => {
    await ensureMedia()
    const mr = mediaRecorderRef.current
    if (!mr) return
    if (isRecording) {
      try {
        mr.stop()
      } catch {}
      // onstop will set isRecording false and update data URL
    } else {
      recordedDataChunks.current = []
      recordedDataUrlRef.current = ''
      setIsRecording(true)
      try {
        mr.start()
      } catch (e: any) {
        setIsRecording(false)
        setError(`Recording failed to start: ${e?.message || e}`)
      }
    }
  }

  const onSubmitRecording = async () => {
    setError(null)
    if (!recordedDataUrlRef.current) {
      setError('Please record your pronunciation first.')
      return
    }
    setLoading(true)
    try {
      const resp = await scoreRecording({ title: sentence, base64Audio: recordedDataUrlRef.current, language })
      if (isColdStartEmptyScore(resp)) {
        // Retry once after a short delay
        setWarmingUp(true)
        await new Promise(r => setTimeout(r, 1200))
        const retry = await scoreRecording({ title: sentence, base64Audio: recordedDataUrlRef.current, language })
        setWarmingUp(false)
        if (isColdStartEmptyScore(retry)) {
          setError('Warming up the scoring service… please try again')
          return
        }
        lastResultRef.current = retry
        const pct = parseInt(retry.pronunciation_accuracy, 10)
        setScorePct(Number.isFinite(pct) ? pct : null)
        return
      }
      lastResultRef.current = resp
      const pct = parseInt(resp.pronunciation_accuracy, 10)
      setScorePct(Number.isFinite(pct) ? pct : null)
    } catch (e: any) {
      setError(`Scoring failed: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  const coloredSentence = useMemo(() => {
    const result = lastResultRef.current
    if (!result) return sentence || '—'
    const words = sentence.split(' ')
    const letterFlags = (result.is_letter_correct_all_words || '').trim().split(' ')
    return (
      <span>
        {words.map((w, wi) => {
          const flags = letterFlags[wi] || ''.padEnd(w.length, '1')
          return (
            <span key={wi} className="mr-1">
              {w.split('').map((ch, ci) => {
                const ok = flags[ci] === '1'
                const color = ok ? 'text-green-700' : 'text-red-600'
                return <span key={ci} className={color}>{ch}</span>
              })}
            </span>
          )
        })}
      </span>
    )
  }, [sentence, scorePct])

  return (
    <div className="h-full w-full bg-white max-w-[420px] mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Point and read</h2>
        <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
      </div>

      {((import.meta as any).env && (!(import.meta as any).env.VITE_API_SAMPLE_BASE_URL || !(import.meta as any).env.VITE_API_STS_BASE_URL)) && (
        <div className="mb-3 text-xs rounded-md p-2 bg-yellow-50 text-yellow-800 border border-yellow-200">
          Missing API env (sample/score/tts). Using mock sample. Configure .env.local to enable live scoring.
        </div>
      )}

      {error && (
        <div className="mb-3 text-xs rounded-md p-2 bg-red-50 text-red-800 border border-red-200">
          {error} {error.includes("fetch a sentence") && (<button className="underline ml-2" onClick={fetchNewSample}>Retry</button>)}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={onPlaySample} className="p-2 rounded-full border" aria-label="Play">
            <Play className="h-5 w-5" />
          </button>
          <div className="flex-1 h-12 rounded-xl border bg-muted/40 px-3 flex items-center">
            {coloredSentence}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1" onClick={fetchNewSample} disabled={loading || isRecording}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant={isRecording ? 'destructive' : 'default'} className="rounded-full" size="icon" onClick={onRecordToggle} aria-label="Record">
            <Mic className="h-5 w-5" />
          </Button>
          <Button className="flex-1" onClick={onSubmitRecording} disabled={loading || !recordedDataUrlRef.current}>
            {loading ? 'Warming up…' : 'Submit'}
          </Button>
        </div>

        <audio ref={recordedAudioEl} className="hidden" controls />

        {scorePct != null && (
          <div className="text-sm text-muted-foreground">Score: <span className="font-semibold">{scorePct}%</span></div>
        )}

        {warmingUp && (
          <div className="mt-1 text-xs text-muted-foreground">Starting up the scoring service… please try again soon.</div>
        )}
      </div>
    </div>
  )
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function generateSilentDataUrl(seconds: number, sampleRate: number): string {
  const length = Math.max(1, Math.floor(seconds * sampleRate))
  const wavBytes = createMono16BitWavSilence(length, sampleRate)
  const b64 = btoa(String.fromCharCode(...wavBytes))
  return `data:audio/wav;base64,${b64}`
}

function createMono16BitWavSilence(length: number, sampleRate: number): Uint8Array {
  const numChannels = 1
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = length * blockAlign
  const headerSize = 44
  const buffer = new ArrayBuffer(headerSize + dataSize)
  const view = new DataView(buffer)
  // RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  // fmt chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true) // format = 1 PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true) // bits per sample
  // data chunk
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)
  // samples already zeroed by ArrayBuffer (silence)
  return new Uint8Array(buffer)
}

function writeString(dv: DataView, offset: number, s: string) {
  for (let i = 0; i < s.length; i++) dv.setUint8(offset + i, s.charCodeAt(i))
} 