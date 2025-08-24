import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, FileVideo, Sparkles, Download, Settings2, ChevronRight, RotateCcw, Info, CheckCircle2, Play } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

type VideoAssessment = {
  instruction: string;
  target: string;
  score: number; // out of 5
  feedback: string;
};

const BUILTIN_PRESETS: { id: string; name: string; text: string }[] = [
  {
    id: "vmodule1",
    name: "Speaking Clarity - Module 1",
    text:
      "Assess the clarity and pacing of the student speaking in the video. Provide an overall score (0-5), supportive feedback, and identify the target skill the homework asked for.",
  },
  {
    id: "vmodule2",
    name: "Reading Aloud - Module 2",
    text:
      "Evaluate reading aloud accuracy and expression. Return a 0-5 score, encouraging feedback, and the instruction you believe the student followed.",
  },
];

type CustomPrompt = { id: string; name: string; text: string };
const CUSTOM_PROMPTS_STORAGE_KEY = "videoChecker.customPrompts";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function VideoCheckerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPrompts, setCustomPrompts] = useState<CustomPrompt[]>([]);
  const [prompt, setPrompt] = useState<string>(BUILTIN_PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(`builtin:${BUILTIN_PRESETS[0].id}`);
  const [newPromptName, setNewPromptName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<VideoAssessment | null>(null);

  const fileInfo = useMemo(() => {
    if (!selectedFile) return null;
    return {
      name: selectedFile.name,
      size: formatBytes(selectedFile.size),
      type: selectedFile.type || "Unknown",
    };
  }, [selectedFile]);

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setAiResult(null);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_PROMPTS_STORAGE_KEY);
      if (raw) {
        const parsed: CustomPrompt[] = JSON.parse(raw);
        if (Array.isArray(parsed)) setCustomPrompts(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  function getPresetTextById(id: string): string | null {
    if (id.startsWith("builtin:")) {
      const bid = id.split(":")[1];
      const found = BUILTIN_PRESETS.find((p) => p.id === bid);
      return found ? found.text : null;
    }
    if (id.startsWith("custom:")) {
      const cid = id.split(":")[1];
      const found = customPrompts.find((p) => p.id === cid);
      return found ? found.text : null;
    }
    return null;
  }

  function handleSelectPreset(id: string) {
    setSelectedPresetId(id);
    const txt = getPresetTextById(id);
    if (txt != null) setPrompt(txt);
  }

  function persistCustomPrompts(next: CustomPrompt[]) {
    setCustomPrompts(next);
    try {
      localStorage.setItem(CUSTOM_PROMPTS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function handleSaveCurrentAsPreset() {
    const name = newPromptName.trim();
    if (!name || !prompt.trim()) return;
    const newItem: CustomPrompt = { id: `c${Date.now()}`, name, text: prompt };
    persistCustomPrompts([newItem, ...customPrompts]);
    setSelectedPresetId(`custom:${newItem.id}`);
  }

  async function handleGrade() {
    setIsSubmitting(true);
    setAiResult(null);

    // Simulate AI call
    await new Promise((r) => setTimeout(r, 800));

    const mock: VideoAssessment = {
      instruction: "Read the sentence: 'The quick brown fox'",
      target: "Reading clarity",
      score: 4,
      feedback:
        "Nice reading pace and clear pronunciation. Emphasize key words slightly more and keep eye contact with the camera.",
    };

    setAiResult(mock);
    setIsSubmitting(false);
  }

  function handleReset() {
    setSelectedFile(null);
    setAiResult(null);
    const txt = getPresetTextById(selectedPresetId) ?? BUILTIN_PRESETS[0].text;
    setPrompt(txt);
  }

  useEffect(() => {
    if (selectedFile) {
      void handleGrade();
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Video Checker</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard.html" className="text-sm text-primary underline underline-offset-4">Back to Dashboard</a>
            <div className="text-sm text-muted-foreground">Desktop workspace for AI-checked videos</div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 py-6 md:pl-[var(--sidebar-width)]">
        {/* Left Column: Upload + Prompt */}
        <section className="col-span-7 flex flex-col gap-6">
          {/* Upload Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Submission</CardTitle>
              <CardDescription>Upload a video to check (MP4, MOV, WebM)</CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-dashed bg-muted/30 hover:bg-muted/50 text-muted-foreground relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-8 transition"
              >
                <Upload className="h-8 w-8" />
                <div className="text-sm">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs">MP4, MOV, WebM up to 200MB</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.currentTarget.files?.[0] ?? null)}
                />
              </div>

              {fileInfo && (
                <div className="mt-4 flex items-center justify-between rounded-md border bg-white px-3 py-2">
                  <div className="flex items-center gap-3">
                    <FileVideo className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{fileInfo.name}</div>
                      <div className="text-xs text-muted-foreground">{fileInfo.type} • {fileInfo.size}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t">
              <div className="flex w-full items-center justify-end gap-3">
                <Button variant="outline" onClick={handleReset}>Reset</Button>
                <Button onClick={handleGrade} disabled={isSubmitting}>
                  <Sparkles className="h-4 w-4" />
                  <span>{isSubmitting ? "Checking…" : "Run Video Checker"}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Prompt Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5" /> Prompt
              </CardTitle>
              <CardDescription>Choose a preset or edit the instructions for the AI checker</CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <Select value={selectedPresetId} onValueChange={(v) => handleSelectPreset(v)}>
                  <SelectTrigger className="w-[420px]">
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Built-in</SelectLabel>
                      {BUILTIN_PRESETS.map((p) => (
                        <SelectItem key={p.id} value={`builtin:${p.id}`}>{p.name}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Custom</SelectLabel>
                      {customPrompts.length === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">No custom prompts</div>
                      ) : (
                        customPrompts.map((p) => (
                          <SelectItem key={p.id} value={`custom:${p.id}`}>{p.name}</SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">You can customize after selecting</div>
              </div>

              <div className="mt-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[18rem]"
                  placeholder="Write or modify the instructions for the AI checker…"
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Input
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  placeholder="Name your custom prompt"
                  className="w-[420px]"
                />
                <Button variant="outline" onClick={handleSaveCurrentAsPreset}>
                  Save as preset
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Video Preview + Results */}
        <section className="col-span-5">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Workspace</CardTitle>
              <CardDescription>Preview the submission and review AI results</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              {/* Video Preview */}
              <div className="bg-white">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <div className="text-sm font-medium">Video Preview</div>
                  <Button variant="ghost" size="sm" disabled={!selectedFile}>
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
                <div className="grid place-items-center px-6 py-10">
                  {!selectedFile ? (
                    <div className="text-sm text-muted-foreground">Upload a video to see a quick preview.</div>
                  ) : (
                    <div className="w-full max-w-3xl">
                      <video
                        controls
                        className="h-[320px] w-full rounded-lg border bg-black"
                        src={URL.createObjectURL(selectedFile)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Assessment */}
              <div className="bg-white">
                <div className="border-b px-4 py-2 text-sm font-medium">AI Assessment</div>
                <div className="grid gap-4 p-6">
                  {isSubmitting && (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12">
                        <div className="animate-pulse rounded-xl border bg-muted/30 p-5">
                          <div className="h-4 w-24 rounded bg-muted"></div>
                          <div className="mt-3 h-5 w-3/4 rounded bg-muted"></div>
                          <div className="mt-2 h-5 w-2/3 rounded bg-muted"></div>
                        </div>
                      </div>
                      <div className="col-span-12 lg:col-span-5">
                        <div className="animate-pulse rounded-lg border p-4">
                          <div className="h-3 w-20 rounded bg-muted"></div>
                          <div className="mt-3 h-8 w-24 rounded bg-muted"></div>
                          <div className="mt-4 h-2 w-full rounded bg-muted"></div>
                        </div>
                      </div>
                      <div className="col-span-12 lg:col-span-7">
                        <div className="animate-pulse rounded-lg border p-4">
                          <div className="h-3 w-40 rounded bg-muted"></div>
                          <div className="mt-3 h-8 w-full rounded bg-muted"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isSubmitting && !aiResult && (
                    <div className="text-sm text-muted-foreground">Run the Video Checker to see results here.</div>
                  )}
                  {!isSubmitting && aiResult && (
                    <div className="grid grid-cols-12 gap-6">
                      {/* Highlight: Feedback */}
                      <div className="col-span-12">
                        <div className="rounded-xl border bg-blue-50 p-5 text-blue-900">
                          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                            <CheckCircle2 className="h-4 w-4" /> Feedback
                          </div>
                          <p className="mt-2 text-base leading-7">{aiResult.feedback}</p>
                        </div>
                      </div>

                      {/* Highlight: Score out of 5 */}
                      <div className="col-span-12 lg:col-span-5">
                        <div className="rounded-lg border p-4">
                          <div className="text-xs uppercase text-muted-foreground">Score</div>
                          <div className="mt-3 flex items-end gap-3">
                            <div className="text-4xl font-semibold">{aiResult.score}</div>
                            <div className="pb-1 text-muted-foreground">/ 5</div>
                          </div>
                          <div className="mt-4">
                            <Progress value={(aiResult.score / 5) * 100} />
                          </div>
                        </div>
                      </div>

                      {/* Secondary: Understanding checks */}
                      <div className="col-span-12 lg:col-span-7">
                        <div className="rounded-lg border p-4">
                          <div className="text-xs uppercase text-muted-foreground">Understanding Check</div>
                          <div className="mt-3 grid gap-2">
                            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                              <div className="text-sm text-muted-foreground">Instruction detected</div>
                              <Badge variant="secondary" className="text-xs">{aiResult.instruction}</Badge>
                            </div>
                            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                              <div className="text-sm text-muted-foreground">Target skill</div>
                              <Badge className="text-xs">{aiResult.target}</Badge>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Info className="h-3.5 w-3.5" /> These fields help validate the AI understood the task correctly.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}


