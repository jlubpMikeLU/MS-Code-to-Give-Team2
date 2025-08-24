import { useMemo, useEffect, useRef, useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarInset } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { FileText, Video, Sparkles } from "lucide-react";

type Student = {
  id: string;
  name: string;
  imageUrl: string;
  grade: string;
  progress: number;
};

function mockStudents(): Student[] {
  const hkNames = [
    "Chun Hei",
    "Tsz Ching",
    "Hoi Lam",
    "Ka Ho",
    "Wing Sze",
    "Man Hei",
    "Hiu Tung",
    "Lok Fung",
    "Chun Kit",
    "Ka Yan",
    "Yee Ting",
    "Wing Yan",
    "Tsz Lok",
    "Ching Lam",
    "Pui Yan",
    "Ka Wing",
    "Man Lok",
    "Hin Long",
    "Lok Hei",
    "Ka Man",
    "Yiu Ting",
    "Chun Ho",
    "Lok Yan",
    "Tsz Yau",
    "Sze Wing",
    "Nga Ting",
    "Ho Ching",
    "Yan Hei",
    "Hei Man",
    "Ka Chun",
  ];

  return hkNames.map((name, i) => ({
    id: `s${i + 1}`,
    name,
    grade: ["K1", "K2", "K3"][i % 3]!,
    imageUrl: `https://picsum.photos/seed/hk${i}/400/400`,
    progress: Math.floor(Math.random() * 100),
  }));
}

export function ToolDashboard() {
  const students = useMemo(() => mockStudents(), []);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ngoHeight, setNgoHeight] = useState<number>(1200);

  const weeklyData = useMemo(
    () => [
      { day: "Mon", submissions: 3 },
      { day: "Tue", submissions: 5 },
      { day: "Wed", submissions: 4 },
      { day: "Thu", submissions: 7 },
      { day: "Fri", submissions: 6 },
    ],
    [],
  );

  // Listen for height messages from the embedded NGO dashboard and auto-resize
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as { type?: string; height?: number } | undefined;
      if (!data || data.type !== "NGO_DASHBOARD_HEIGHT" || typeof data.height !== "number") return;
      const clamped = Math.max(700, Math.min(4000, Math.round(data.height + 24)));
      setNgoHeight(clamped);
    }
    window.addEventListener("message", handleMessage);
    // Ask child for height immediately in case it loaded before listener
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: "REQUEST_NGO_HEIGHT" }, "*");
    } catch {}
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <a href="/dashboard.html" className="block p-2 text-xs font-semibold tracking-wide text-muted-foreground">REACH</a>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <a href="/hw-grader.html">
                    <SidebarMenuButton tooltip="HW Grader" size="lg">
                      <FileText />
                      <span>HW Grader</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <a href="/video-checker.html">
                    <SidebarMenuButton tooltip="Video Checker" size="lg">
                      <Video />
                      <span>Video Checker</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10 md:ml-[var(--sidebar-width)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="text-sm text-muted-foreground">Aug 1 – Sep 1</div>
          </div>
        </header>

        <main className="px-4 py-6 md:pl-[var(--sidebar-width)]">
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Embedded NGO dashboard, expanded width */}
            <div className="col-span-12 xl:col-span-8">
              <div className="rounded-lg border bg-white overflow-hidden">
                <iframe
                  src="http://localhost:3001"
                  title="NGO Dashboard"
                  ref={iframeRef}
                  className="w-full"
                  style={{ border: "0", height: ngoHeight }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Integrated NGO dashboard (served from http://localhost:3001).
              </p>
            </div>

            {/* Right: Active Students (from original design) */}
            <div className="col-span-12 xl:col-span-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Submissions snapshot */}
                <div className="col-span-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submissions</CardTitle>
                      <CardDescription>Last 5 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{ submissions: { label: "Submissions", color: "hsl(var(--primary))" } }}
                        className="h-40"
                      >
                        <BarChart data={weeklyData}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="day" tickLine={false} axisLine={false} />
                          <ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
                          <Bar dataKey="submissions" fill="var(--color-submissions)" radius={6} />
                          <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Active students list */}
                <div className="col-span-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>Program Snapshot</CardTitle>
                      <CardDescription>{students.length} active students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {students.map((s) => (
                          <div key={s.id} className="rounded-lg border bg-white p-3">
                            <div className="aspect-square w-full overflow-hidden rounded-md">
                              <img className="h-full w-full object-cover" src={s.imageUrl} alt={s.name} />
                            </div>
                            <div className="mt-2 text-sm font-medium truncate" title={s.name}>{s.name}</div>
                            <div className="text-xs text-muted-foreground">Grade {s.grade}</div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-muted">
                              <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">
                        Note: The progress bar reflects each student’s homework submissions this cycle. A full bar means all assigned homework has been submitted.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


