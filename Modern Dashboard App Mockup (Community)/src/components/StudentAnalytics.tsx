import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Crown,
  Flame,
  BookOpen,
  Clock,
  Users,
  Heart,
  Flower2,
  Sprout,
  Trees,
  Leaf
} from 'lucide-react';

interface StudentAnalyticsProps {
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

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export function StudentAnalytics({ student }: StudentAnalyticsProps) {
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Alex M.',
      points: 342,
      streak: 8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      rank: 2,
      name: 'Sophia L.',
      points: 318,
      streak: 6,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      rank: 3,
      name: 'Emma',
      points: 285,
      streak: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      isCurrentUser: true
    },
    {
      rank: 4,
      name: 'Lucas K.',
      points: 267,
      streak: 4,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      rank: 5,
      name: 'Maya P.',
      points: 253,
      streak: 7,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const achievements = [
    { 
      title: 'Reading Star', 
      description: 'Read 10 books this month', 
      icon: BookOpen, 
      earned: true,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      title: 'Streak Master', 
      description: '5-day submission streak', 
      icon: Flame, 
      earned: true,
      color: 'text-orange-600 bg-orange-100'
    },
    { 
      title: 'Math Wizard', 
      description: 'Perfect math scores for a week', 
      icon: Target, 
      earned: false,
      color: 'text-gray-400 bg-gray-100'
    },
    { 
      title: 'Helper', 
      description: 'Helped 3 classmates', 
      icon: Users, 
      earned: false,
      color: 'text-gray-400 bg-gray-100'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: case 3: return Award;
      default: return Trophy;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600';
      case 2: return 'text-gray-600';
      case 3: return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  // Virtual Pet System
  const getPetLevel = (points: number) => {
    if (points < 50) return { level: 1, name: 'Seedling', icon: Sprout, next: 50 };
    if (points < 150) return { level: 2, name: 'Sprout', icon: Leaf, next: 150 };
    if (points < 300) return { level: 3, name: 'Young Plant', icon: Flower2, next: 300 };
    return { level: 4, name: 'Mighty Tree', icon: Trees, next: 500 };
  };

  const petData = getPetLevel(student.points);
  const progressToNext = petData.next ? ((student.points % petData.next) / petData.next) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Virtual Pet */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Your Learning Buddy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-4 bg-green-100 rounded-full">
                  <petData.icon className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h3 className="font-bold text-green-900 mb-1">{petData.name}</h3>
              <p className="text-sm text-green-700">Level {petData.level}</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-900">Growth Progress</span>
                {petData.next && (
                  <span className="text-sm text-green-700">
                    {student.points}/{petData.next}
                  </span>
                )}
              </div>
              {petData.next ? (
                <div className="space-y-2">
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressToNext}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600">
                    {petData.next - student.points} points until next level!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-full"></div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    🎉 Max level reached! You're amazing!
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-green-700">
              Your buddy grows stronger with every point you earn! 🌱⭐
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Rank Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              <div className={`p-3 rounded-full bg-purple-100`}>
                <Award className="h-10 w-10 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-1">Rank #{student.rank}</h3>
              <p className="text-sm text-purple-700 mb-3">out of {student.totalStudents} students</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-purple-900">{student.points}</div>
                  <div className="text-purple-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-900">{student.streak}</div>
                  <div className="text-purple-600">Streak</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-900">{student.submissionScore}%</div>
                  <div className="text-purple-600">Score</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Student Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => {
              const RankIcon = getRankIcon(entry.rank);
              return (
                <div 
                  key={entry.rank} 
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                    entry.isCurrentUser 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-full ${getRankColor(entry.rank)}`}>
                      <RankIcon className="h-5 w-5" />
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>{entry.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{entry.name}</h4>
                        {entry.isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {entry.points} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {entry.streak} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-muted-foreground">
                    #{entry.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 w-fit ${achievement.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${
                    achievement.earned ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs ${
                    achievement.earned ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-800">
                      Earned!
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            This Week's Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Homework Submissions</span>
              <span className="text-sm text-muted-foreground">
                {student.completedThisWeek}/{student.weeklyGoal}
              </span>
            </div>
            <Progress 
              value={(student.completedThisWeek / student.weeklyGoal) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {student.weeklyGoal - student.completedThisWeek} more submissions to reach your weekly goal!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}