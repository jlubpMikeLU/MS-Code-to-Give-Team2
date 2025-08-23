import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  User,
  Settings,
  Bell,
  Shield,
  Heart,
  Star,
  Trophy,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Award,
  Gift
} from 'lucide-react';

interface StudentSettingsProps {
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

export function StudentSettings({ student }: StudentSettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [parentUpdates, setParentUpdates] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);



  const stats = [
    { label: 'Total Points', value: student.points, icon: Star, color: 'text-yellow-600' },
    { label: 'Current Streak', value: `${student.streak} days`, icon: Trophy, color: 'text-orange-600' },
    { label: 'Submissions', value: student.completedThisWeek, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Success Rate', value: `${student.submissionScore}%`, icon: Award, color: 'text-green-600' }
  ];

  const recentActivity = [
    { action: 'Completed Math Worksheet', time: '2 hours ago', points: 15 },
    { action: 'Audio Reading Practice', time: '1 day ago', points: 20 },
    { action: 'Science Project Submission', time: '2 days ago', points: 25 },
    { action: 'Writing Reflection', time: '3 days ago', points: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
                alt={student.name}
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-muted-foreground">{student.grade}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Rank #{student.rank}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  REACH Student
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Learning Buddy Info */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium mb-1 text-green-900">Your Learning Buddy</h4>
            <p className="text-sm text-green-700 mb-3">
              Check out your virtual pet in the Rankings tab! It grows as you earn points.
            </p>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Visit Rankings to see your buddy!
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="font-bold text-lg">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  +{activity.points}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Homework Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified about assignments</p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Parent Updates</p>
                  <p className="text-sm text-muted-foreground">Share progress with parents</p>
                </div>
              </div>
              <Switch 
                checked={parentUpdates} 
                onCheckedChange={setParentUpdates}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-sm text-muted-foreground">Summary of weekly progress</p>
                </div>
              </div>
              <Switch 
                checked={weeklyReport} 
                onCheckedChange={setWeeklyReport}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium mb-1">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ask your teacher or parent for assistance with the app.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}