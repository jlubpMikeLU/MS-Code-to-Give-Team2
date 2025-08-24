import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Bot,
  Send,
  Sparkles,
  Heart,
  Target,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  Smile,
  ThumbsUp,
  BookOpen,
  Lightbulb,
  Star,
  HelpCircle
} from 'lucide-react';

interface HomeworkCoachProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    grade: string;
    points: number;
    streak: number;
    submissionScore: number;
  };
}

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function HomeworkCoach({ isOpen, onClose, student }: HomeworkCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: `Hi ${student.name}! I'm your REACH homework helper. I saw you're doing great with your ${student.streak}-day streak! 🎉 How can I help you with your homework today?`,
      timestamp: new Date(),
      suggestions: ['Help with math', 'Reading practice', 'Need motivation', 'Ask a question']
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');

  const coachResponses = {
    'Help with math': {
      content: "Great! Math can be fun when we break it down step by step. What kind of math problem are you working on? Addition, subtraction, or something else?",
      suggestions: ['Addition problems', 'Subtraction problems', 'Word problems', 'Need examples']
    },
    'Reading practice': {
      content: "Reading practice is awesome! Remember to read slowly and sound out each word. Try reading aloud - it helps your brain understand better. What are you reading today?",
      suggestions: ['Need reading tips', 'Hard words', 'Story questions', 'Reading aloud help']
    },
    'Need motivation': {
      content: `You're doing amazing, ${student.name}! Look at your streak - ${student.streak} days in a row! That takes real dedication. Every homework you complete makes you smarter and stronger! 💪⭐`,
      suggestions: ['Set a new goal', 'Celebrate success', 'Keep going!', 'Tell me more']
    },
    'Ask a question': {
      content: "I'm here to help! What would you like to know? You can ask me about homework, study tips, or anything about learning. No question is too small!",
      suggestions: ['Study tips', 'Homework help', 'Time management', 'Learning tricks']
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = coachResponses[content as keyof typeof coachResponses] || {
        content: "That's a great question! Remember, the most important thing is to try your best and keep practicing. Every mistake is just a chance to learn something new! 🌟",
        suggestions: ['More help needed', 'Try again', 'Ask teacher', 'Keep practicing!']
      };

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, coachMessage]);
    }, 1000);

    setInputMessage('');
  };

  const quickTips = [
    { icon: Target, title: "Take Breaks", tip: "Work for 15 minutes, then take a 5-minute break" },
    { icon: Clock, title: "Read Aloud", tip: "Reading out loud helps you understand better" },
    { icon: Heart, title: "Ask for Help", tip: "It's okay to ask your teacher or parent for help" },
    { icon: Star, title: "Celebrate Small Wins", tip: "Finishing each problem is something to be proud of!" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span>REACH Homework Helper</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Get help with your homework, study tips, and encouragement from your AI learning assistant.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'coach' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`p-3 rounded-2xl ${ 
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1 px-2 mr-1"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Tips */}
          <div className="p-4 border-t bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Learning Tips
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="p-2 bg-background rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">{tip.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tip.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about homework..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              />
              <Button 
                size="sm" 
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}