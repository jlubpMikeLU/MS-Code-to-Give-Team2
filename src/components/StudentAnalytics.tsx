import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Trophy,
  Star,
  Award,
  Medal,
  Crown,
  Flame,
  BookOpen,
  Pencil,
  Edit3,
  Paintbrush,
  Flower,
  Sprout,
  TreePine,
  Leaf
} from 'lucide-react';
import { getPic } from '../data/profilePics';

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
  avatarKey?: string;
  isCurrentUser?: boolean;
}

export function StudentAnalytics({ student }: StudentAnalyticsProps) {
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Henry',
      points: 342,
      streak: 8,
      avatarKey: 'alex_m'
    },
    {
      rank: 2,
      name: 'Lily',
      points: 318,
      streak: 6,
      avatarKey: 'sophia_l'
    },
    {
      rank: 3,
      name: 'Emma',
      points: 285,
      streak: 5,
      avatarKey: 'emma',
      isCurrentUser: true
    },
    {
      rank: 4,
      name: 'Kevin',
      points: 267,
      streak: 4,
      avatarKey: 'lucas_k'
    },
    {
      rank: 5,
      name: 'Sarah',
      points: 253,
      streak: 7,
      avatarKey: 'maya_p'
    }
  ];

  // Kid-friendly achievements aligned with tasks and streaks
  const achievements = [
    {
      id: 'streak-master',
      title: 'Streak Master',
      subtitle: '5-day submission streak',
      status: 'earned' as const,
      icon: Flame,
    },
    {
      id: 'colour-artist',
      title: 'Colour Artist',
      subtitle: 'Beautiful colouring within lines',
      status: 'earned' as const,
      icon: Paintbrush,
    },
    {
      id: 'helper',
      title: 'Helper',
      subtitle: 'Helped 3 classmates',
      status: 'locked' as const,
      icon: Award,
    },
    {
      id: 'independent-writer',
      title: 'Independent Writer',
      subtitle: 'Finish writing independently',
      status: 'locked' as const,
      icon: Edit3,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: case 3: return Medal;
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

  // Virtual Pet System (kept for potential reuse)
  const getPetLevel = (points: number) => {
    if (points < 50) return { level: 1, name: 'Seedling', icon: Sprout, next: 50 };
    if (points < 150) return { level: 2, name: 'Sprout', icon: Leaf, next: 150 };
    if (points < 300) return { level: 3, name: 'Young Plant', icon: Flower, next: 300 };
    return { level: 4, name: 'Mighty Tree', icon: TreePine, next: 500 };
  };

  return (
    <div className="space-y-6">
      {/* Current Rank Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              <div className={`p-3 rounded-full bg-purple-100`}>
                <Medal className="h-10 w-10 text-purple-600" />
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
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => {
              const RankIcon = getRankIcon(entry.rank);
              const avatarUrl = getPic(entry.avatarKey || 'default');
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
                      <AvatarImage src={avatarUrl} alt={entry.name} />
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
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const earned = achievement.status === 'earned';
              const iconColorClass = earned
                ? (achievement.id === 'streak-master'
                    ? 'text-orange-600 bg-orange-100'
                    : achievement.id === 'colour-artist'
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-green-600 bg-green-100')
                : 'text-gray-400 bg-gray-100';
              return (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 w-fit ${iconColorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${
                    earned ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs ${
                    earned ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {achievement.subtitle}
                  </p>
                  {earned && (
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
    </div>
  );
}