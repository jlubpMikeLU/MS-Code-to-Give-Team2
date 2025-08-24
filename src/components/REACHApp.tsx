import React from 'react'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Users, 
  Trophy,
  Upload,
  Calendar,
  MessageSquare,
  Flame,
  Star,
  TrendingUp,
  Clock,
  Award,
  Heart,
  Smile,
  User,
  BookOpen,
  Camera,
  FileText,
  Mic,
  Video,
  Plus,
  Bot
} from 'lucide-react';
import { HomeworkPortfolio } from './HomeworkPortfolio';
import { StudentAnalytics } from './StudentAnalytics';
import { StudentSettings } from './StudentSettings';
import { ParentCommunity } from './ParentCommunity';
import { HomeworkCoach } from './HomeworkCoach';

export function REACHApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCoach, setShowCoach] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const currentStudent = {
    name: 'Emma',
    grade: 'K3 Student',
    points: 285,
    streak: 5,
    submissionScore: 92,
    weeklyGoal: 7,
    completedThisWeek: 5,
    rank: 3,
    totalStudents: 24
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Home';
      case 'community': return 'Parent Community';
      case 'leaderboard': return 'Leaderboard';
      case 'profile': return 'Profile';
      default: return 'Home';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Status Bar Space */}
      <div className="h-11 bg-background"></div>
      
      {/* Simple Header for non-home pages */}
      {activeTab !== 'home' && (
        <header className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold" aria-label={getPageTitle()}>{getPageTitle()}</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCoach(true)}
            >
              <Bot className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'home' && (
          <div>
            {/* Home Header */}
            <div className="px-4 -mt-11 pt-7">
              {/* Greeting Section */}
              <div className="px-6 pt-6 pb-4">
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {/* Profile Photo */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src="/Emma.png" 
                          alt={`${currentStudent.name}'s profile`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-foreground">Hi, {currentStudent.name}!</h2>
                        <p className="text-sm text-muted-foreground">{currentStudent.grade} • Week 8</p>
                        <p className="text-xs text-muted-foreground/70">REACH Program</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-foreground hover:bg-muted rounded-full"
                        onClick={() => setShowCoach(true)}
                        aria-label="Open Homework Coach"
                      >
                        <Bot className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">Streak</span>
                    </div>
                    <p className="text-2xl font-bold">{currentStudent.streak}</p>
                  </div>
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Points</span>
                    </div>
                    <p className="text-2xl font-bold">{currentStudent.points}</p>
                  </div>
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Score</span>
                    </div>
                    <p className="text-2xl font-bold">{currentStudent.submissionScore}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <HomeworkPortfolio student={currentStudent} />
            </div>
          </div>
        )}
        {activeTab === 'community' && (
          <div className="p-4">
            <ParentCommunity />
          </div>
        )}
        {activeTab === 'leaderboard' && (
          <div className="p-4">
            <StudentAnalytics student={currentStudent} />
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="p-4">
            <StudentSettings student={currentStudent} />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-blue-50 border-t px-4 py-2 pb-6 flex justify-around" aria-label="Bottom Navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full ${
                activeTab === item.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Homework Coach Modal */}
      {showCoach && (
        <HomeworkCoach 
          isOpen={showCoach} 
          onClose={() => setShowCoach(false)} 
          student={currentStudent}
        />
      )}
    </div>
  );
}