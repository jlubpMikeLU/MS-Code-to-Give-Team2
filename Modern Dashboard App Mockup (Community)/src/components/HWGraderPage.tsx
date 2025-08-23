import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, FileText, Sparkles, Download, Settings2, ChevronRight, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
// Removed resizable layout on the right workspace for reliability across viewports
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

type AIAssessment = {
  instruction: string;
  target_letter: string;
  score: number; // out of 5
  feedback: string;
};

const BUILTIN_PRESETS: { id: string; name: string; text: string }[] = [
  {
    id: "module1",
    name: "Writing Alphabet - Module 1",
    text: `You are a kindergarten homework grading assistant specializing in alphabet recognition exercises. Examine the provided homework image and analyze it according to the following structure:

{
    "instruction": "The homework instruction found at the top of the page. The instruction is to write a particular alphabet 5 times. Which alphabet to write is mentioned in the instruction. Its your job identify the instruction",
    "target_letter": "The specific alphabet that should be written 5 times according to the instruction. This is the letter that the student should be writing and the correct way to write it is shown in the instruction. Understand that.",
    "score": "The total score is out of 5. The score is the number of alphabets that were written correctly (e.g. if the target letter is A and the student wrote A correctly 4 times, the score is 4/5)",
    "feedback": "Encouraging feedback for the kindergarten student, praising correct answers and gently guiding on mistakes"
}

Grading Guidelines:
1. First, identify the homework instruction at the top of the page to understand what letter should be written 5 times
2. Carefully examine the written alphabet by student - they may be not be perfect but you should be able to identify the target letter. If the written alphabet is not the same as the first letter (the correct way to write), then we classify this as incorrect.
3. Count how many instances of the target letter appear correctly on the page
4. Provide encouraging feedback that celebrates successes and offers gentle guidance for improvement
5. Remember this is for young learners - focus on effort and learning rather than perfection

Important Notes:
- Some letters may be partially obscured by circles
- Pay attention to similar-looking letters (like O and Q, or P and R)
- These are very young learners, so the writing may not be perfect. You should be able to identify the target letter and recognize if their writting is correct or not.

Provide only the JSON response without any introduction or additional text.`,
  },
  {
    id: "module2",
    name: "Tracing Alhphabet writing - Module 2",
    text:
      "Assess tracing accuracy for alphabet letters. Include overall score (0-100), concise strengths and improvements, and note line adherence, start/end points, and consistency.",
  },
  {
    id: "module3",
    name: "Matching Animals to Word - Module 3",
    text:
      "Evaluate matching of animal images to corresponding words. Report overall score (0-100), accuracy breakdown, 3 strengths, 3 improvements, and a summary suitable for parents.",
  },
  {
    id: "module4",
    name: "Circling the right word - Module 4",
    text:
      "Assess selection of the correct word among options. Provide overall score (0-100), common error types, 3 strengths, 3 improvements, and a brief next-step suggestion.",
  },
];

type CustomPrompt = { id: string; name: string; text: string };
const CUSTOM_PROMPTS_STORAGE_KEY = "hwGrader.customPrompts";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function HWGraderPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPrompts, setCustomPrompts] = useState<CustomPrompt[]>([]);
  const [prompt, setPrompt] = useState<string>(BUILTIN_PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(`builtin:${BUILTIN_PRESETS[0].id}`);
  const [newPromptName, setNewPromptName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<AIAssessment | null>(null);

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

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
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
    const next = [newItem, ...customPrompts];
    persistCustomPrompts(next);
    setSelectedPresetId(`custom:${newItem.id}`);
  }

  async function handleGrade() {
    setIsSubmitting(true);
    setAiResult(null);

    // Simulate an AI call with a mocked response
    await new Promise((r) => setTimeout(r, 800));

    const mock: AIAssessment = {
      instruction: "Write 5 'C'",
      target_letter: "C",
      score: 3,
      feedback:
        "Great job trying to write the letter 'C'! You got 3 out of 5 correct. Keep practicing, and you'll get better at writing 'C'!",
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
            <h1 className="text-xl font-semibold tracking-tight">HW Grader</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard.html" className="text-sm text-primary underline underline-offset-4">Back to Dashboard</a>
            <div className="text-sm text-muted-foreground">Desktop workspace for AI-assisted grading</div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6 py-6">
        {/* Left Column: Upload + Prompt (Static) */}
        <section className="col-span-7 flex flex-col gap-6">
          {/* Upload Card */}
          <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Submission</CardTitle>
                  <CardDescription>Upload a document to grade (PDF or DOCX)</CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-dashed bg-muted/30 hover:bg-muted/50 text-muted-foreground relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-8 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8" />
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs">PDF, DOCX up to 10MB</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.currentTarget.files?.[0] ?? null)}
                    />
                  </div>

                  {fileInfo && (
                    <div className="mt-4 flex items-center justify-between rounded-md border bg-white px-3 py-2">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
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
                      <span>{isSubmitting ? "Grading…" : "Run AI Grader"}</span>
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
                  <CardDescription>Choose a preset or edit the instructions for the AI agent</CardDescription>
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
                      placeholder="Write or modify the instructions for the AI grader…"
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

        {/* Right Column: Document Preview + Results */}
        <section className="col-span-5">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Workspace</CardTitle>
              <CardDescription>Preview the submission and review AI results</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              {/* Submission Preview */}
              <div className="bg-white">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <div className="text-sm font-medium">Submission Preview</div>
                  <Button variant="ghost" size="sm" disabled={!selectedFile}>
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
                <div className="grid place-items-center px-6 py-10">
                  {!selectedFile ? (
                    <div className="text-sm text-muted-foreground">Upload a document to see a quick preview.</div>
                  ) : (
                    <div className="h-[320px] w-full max-w-3xl rounded-lg border bg-[linear-gradient(120deg,#fafafa,#f5f5f5)] p-6 text-sm text-muted-foreground">
                      A lightweight preview will appear here. For full fidelity, open the file in your viewer.
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
                    <div className="text-sm text-muted-foreground">Run the AI grader to see results here.</div>
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
                              <div className="text-sm text-muted-foreground">Target letter</div>
                              <Badge className="text-xs">{aiResult.target_letter}</Badge>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Info className="h-3.5 w-3.5" /> These fields help validate the AI understood the homework correctly.
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


