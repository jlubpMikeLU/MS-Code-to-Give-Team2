import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  Plus,
  Camera,
  FileText,
  Mic,
  Video,
  CheckCircle,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  Upload,
  BookOpen,
  Award,
  Target,
  ChevronDown,
  AlarmClock,
  GraduationCap
} from 'lucide-react';

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

interface Submission {
  id: string;
  type: 'text' | 'photo' | 'audio' | 'video';
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'reviewed';
  feedback?: string;
  points: number;
}

interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'overdue';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export function HomeworkPortfolio({ student }: HomeworkPortfolioProps) {
  const [selectedWeek, setSelectedWeek] = useState(8);
  const [showUpload, setShowUpload] = useState(false);

  // Mock homework assignments data
  const homeworkAssignments: HomeworkAssignment[] = [
    {
      id: '1',
      title: 'Math Practice - Addition & Subtraction',
      subject: 'Mathematics',
      dueDate: 'Tomorrow',
      description: 'Complete worksheets on pages 42-44. Show all your work!',
      status: 'not_started',
      points: 20,
      difficulty: 'easy',
      estimatedTime: '30 min'
    },
    {
      id: '2',
      title: 'Reading Comprehension - Chapter 8',
      subject: 'English',
      dueDate: 'Friday',
      description: 'Read chapter 8 and answer the questions at the end.',
      status: 'in_progress',
      points: 25,
      difficulty: 'medium',
      estimatedTime: '45 min'
    },
    {
      id: '3',
      title: 'Science Project - Plant Growth',
      subject: 'Science',
      dueDate: 'Next Monday',
      description: 'Document your plant\'s growth over the past week with photos and measurements.',
      status: 'not_started',
      points: 35,
      difficulty: 'hard',
      estimatedTime: '1 hour'
    },
    {
      id: '4',
      title: 'Art Portfolio - Self Portrait',
      subject: 'Art',
      dueDate: 'Wednesday',
      description: 'Create a self-portrait using your favorite art medium.',
      status: 'submitted',
      points: 15,
      difficulty: 'medium',
      estimatedTime: '45 min'
    },
    {
      id: '5',
      title: 'History Timeline - Ancient Egypt',
      subject: 'History',
      dueDate: 'Yesterday',
      description: 'Create a timeline of important events in Ancient Egypt.',
      status: 'overdue',
      points: 30,
      difficulty: 'hard',
      estimatedTime: '1.5 hours'
    }
  ];

  const submissions: Submission[] = [
    {
      id: '1',
      type: 'photo',
      title: 'Math Worksheet - Page 42',
      date: 'Monday',
      status: 'reviewed',
      feedback: 'Great work on addition problems!',
      points: 15
    },
    {
      id: '2',
      type: 'audio',
      title: 'Reading Practice - Story 8',
      date: 'Tuesday',
      status: 'reviewed',
      feedback: 'Excellent pronunciation improvement!',
      points: 20
    },
    {
      id: '3',
      type: 'text',
      title: 'Writing Reflection',
      date: 'Wednesday',
      status: 'completed',
      points: 10
    },
    {
      id: '4',
      type: 'video',
      title: 'Science Experiment',
      date: 'Thursday',
      status: 'reviewed',
      feedback: 'Love your enthusiasm! Great observation skills.',
      points: 25
    },
    {
      id: '5',
      type: 'photo',
      title: 'Art Project',
      date: 'Friday',
      status: 'pending',
      points: 0
    }
  ];

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'audio': return Mic;
      case 'video': return Video;
      case 'text': return FileText;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHomeworkStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return '🔢';
      case 'english': return '📚';
      case 'science': return '🔬';
      case 'art': return '🎨';
      case 'history': return '🏛️';
      default: return '📝';
    }
  };

  const uploadOptions = [
    { type: 'photo', icon: Camera, label: 'Take Photo', description: 'Snap a picture of your work' },
    { type: 'text', icon: FileText, label: 'Write Text', description: 'Type your reflection or answers' },
    { type: 'audio', icon: Mic, label: 'Record Audio', description: 'Record yourself reading or speaking' },
    { type: 'video', icon: Video, label: 'Record Video', description: 'Show your work or demonstrate' }
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Week {selectedWeek} Progress
            </CardTitle>
            <Badge variant="outline">{student.completedThisWeek}/{student.weeklyGoal}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={(student.completedThisWeek / student.weeklyGoal) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{student.completedThisWeek} submissions completed</span>
              <span>{student.weeklyGoal - student.completedThisWeek} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homework Assignments List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Homework Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {homeworkAssignments.map((assignment) => (
              <AccordionItem key={assignment.id} value={assignment.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">{getSubjectIcon(assignment.subject)}</span>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-xs ${getHomeworkStatusColor(assignment.status)}`}>
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlarmClock className="h-3 w-3" />
                            {assignment.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{assignment.points} pts</div>
                      <div className="text-xs text-muted-foreground">Due: {assignment.dueDate}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Description:</p>
                      <p className="text-sm">{assignment.description}</p>
                    </div>
                    
                    {assignment.status !== 'submitted' && assignment.status !== 'overdue' && (
                      <div>
                        <p className="text-sm font-medium mb-3">Submit your work:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {uploadOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <Button
                                key={option.type}
                                variant="outline"
                                className="h-auto p-3 flex flex-col items-center gap-2"
                                onClick={() => setShowUpload(true)}
                              >
                                <Icon className="h-5 w-5" />
                                <div className="text-center">
                                  <div className="font-medium text-xs">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {assignment.status === 'submitted' && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Assignment Submitted!</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Waiting for teacher review...</p>
                      </div>
                    )}
                    
                    {assignment.status === 'overdue' && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Past Due</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">Contact your teacher about late submission</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              This Week's Work
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Week {selectedWeek}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.map((submission) => {
              const Icon = getSubmissionIcon(submission.type);
              return (
                <div key={submission.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{submission.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(submission.status)}`}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{submission.date}</span>
                      {submission.points > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {submission.points} pts
                        </span>
                      )}
                      {submission.feedback && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-blue-500" />
                          Feedback
                        </span>
                      )}
                    </div>
                  </div>
                  {submission.status === 'reviewed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {submission.status === 'pending' && (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badge */}
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