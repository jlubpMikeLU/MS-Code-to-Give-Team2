import React from 'react'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Camera,
  FileText,
  Mic,
  Video,
  CheckCircle,
  Clock,
  Star,
  Calendar,
  BookOpen,
  Award,
  Target
} from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import TaskItem from './home/TaskItem'
import TaskExpanded from './home/TaskExpanded'

interface HomeworkPortfolioProps {
  student: {
    name: string;
    grade: string;
    points: number;
    streak: number;
    submissionScore: number;
    weeklyGoal: number;
    completedThisWeek: number;
    rank: number;
    totalStudents: number;
  };
}

type Status = 'completed' | 'pending' | 'reviewed' | 'todo';

interface Submission {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  type: 'text' | 'photo' | 'audio' | 'video';
  title: string;
  date: string;
  status: Status;
  feedbackAI?: string;
  feedbackReach?: string;
  points: number;
}

export function HomeworkPortfolio({ student }: HomeworkPortfolioProps) {
  const [selectedWeek, setSelectedWeek] = useState(8);

  // Reordered and updated per requirement
  const submissions: Submission[] = [
    {
      id: 'tue',
      day: 'Monday',
      type: 'photo',
      title: 'Trace after dotted line',
      date: 'Monday',
      status: 'reviewed',
      feedbackAI: 'Smooth tracing lines! Watch for the curves on letters like “s”.',
      feedbackReach: 'Nice pencil control. Next time, slow down on corners.',
      points: 20
    },
    {
      id: 'thu',
      day: 'Tuesday',
      type: 'photo',
      title: 'Colour the pictures',
      date: 'Tuesday',
      status: 'reviewed',
      feedbackAI: 'Lovely colors and careful filling! Try staying within the lines.',
      feedbackReach: 'Reviewed and graded. Great effort!',
      points: 25
    },
    {
      id: 'mon',
      day: 'Wednesday',
      type: 'video',
      title: 'Point and read',
      date: 'Wednesday',
      status: 'todo',
      points: 0
    },
    {
      id: 'wed',
      day: 'Thursday',
      type: 'photo',
      title: 'Writing task',
      date: 'Thursday',
      status: 'todo',
      points: 0
    },
    {
      id: 'fri',
      day: 'Friday',
      type: 'photo',
      title: 'Post-test assessment',
      date: 'Friday',
      status: 'todo',
      points: 0
    }
  ];

  const doneCount = submissions.filter(s => s.status === 'reviewed' || s.status === 'completed').length;
  const totalCount = submissions.length;
  const remainingCount = totalCount - doneCount;
  const progressPct = (doneCount / totalCount) * 100;
  const pluralize = (n: number, singular: string, plural: string) => `${n} ${n === 1 ? singular : plural}`;

  const iconForType = (type: Submission['type']) => {
    switch (type) {
      case 'photo': return Camera;
      case 'audio': return Mic;
      case 'video': return Video;
      case 'text': return FileText;
      default: return FileText;
    }
  };

  const statusBadge = (status: Status) => {
    switch (status) {
      case 'reviewed': return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">reviewed</Badge>;
      case 'completed': return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">completed</Badge>;
      case 'pending': return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">pending</Badge>;
      case 'todo': return <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">to-do</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 tasks">
      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Week {selectedWeek} Progress
            </CardTitle>
            <Badge variant="outline">{doneCount}/{totalCount}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progressPct} className="h-2" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={totalCount} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{pluralize(doneCount, 'submission', 'submissions')} completed</span>
              <span>{pluralize(remainingCount, 'remaining', 'remaining')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              This Week's Tasks
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Week {selectedWeek}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-3">
            {submissions.map((s) => {
              const Icon = iconForType(s.type);
              const rightIcon = (s.status === 'reviewed' || s.status === 'completed') ? 'check' : 'clock'
              const badges = [] as string[]
              return (
                <AccordionItem key={s.id} value={s.id} className="border rounded-lg">
                  <AccordionTrigger className="px-3 py-2 hover:no-underline">
                    <TaskItem
                      day={s.day}
                      media={s.type === 'photo' ? 'photo' : s.type === 'audio' ? 'mic' : s.type === 'video' ? 'video' : 'doc'}
                      title={s.title}
                      points={s.points}
                      status={s.status === 'todo' ? 'to-do' : (s.status as any)}
                      rightIcon={rightIcon as any}
                    />
                    {/* Chevron is hidden by AccordionTrigger override */}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    {s.id === 'tue' && (
                      <TaskExpanded
                        showViewHomework
                        showCheckSubmission
                        scoreText={"20 · Nice work!"}
                        aiText={s.feedbackAI}
                        reachText={s.feedbackReach}
                        showChat
                        showResubmit
                      />
                    )}

                    {s.id === 'thu' && (
                      <TaskExpanded
                        showViewHomework
                        showCheckSubmission
                        scoreText={"25 · Great coloring!"}
                        aiText={s.feedbackAI}
                        reachText={s.feedbackReach}
                        showChat
                        showResubmit
                      />
                    )}

                    {s.id === 'mon' && (
                      <TaskExpanded startOnly />
                    )}

                    {s.id === 'wed' && (
                      <TaskExpanded fridayTwoButtons />
                    )}

                    {s.id === 'fri' && (
                      <TaskExpanded fridayTwoButtons />
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Achievement Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-900">5-Day Streak!</h4>
              <p className="text-sm text-purple-700">You're on fire! Keep up the great work.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}