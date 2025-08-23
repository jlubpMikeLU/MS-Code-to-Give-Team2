import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  Heart,
  MessageCircle,
  Share,
  Plus,
  Users,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Camera,
  Send,
  Star,
  Award,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  authorRole: 'parent' | 'teacher';
  avatar: string;
  content: string;
  type: 'question' | 'tip' | 'success' | 'general';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export function ParentCommunity() {
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const posts: Post[] = [
    {
      id: '1',
      author: 'Sarah M.',
      authorRole: 'parent',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'How do you motivate your child to sit still during homework time? My 7-year-old has so much energy after school! 😅',
      type: 'question',
      timestamp: '2 hours ago',
      likes: 8,
      comments: 12,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '2',
      author: 'Ms. Rodriguez',
      authorRole: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      content: 'Tip of the week: Create a "homework station" with all supplies ready. Kids feel more confident when they have everything they need within reach! 📚✏️',
      type: 'tip',
      timestamp: '4 hours ago',
      likes: 23,
      comments: 6,
      isLiked: true,
      isBookmarked: true
    },
    {
      id: '3',
      author: 'Maria C.',
      authorRole: 'parent',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Huge win today! Emma read an entire book in English on her own. Six months ago she was struggling with single words. The REACH program is amazing! 🎉📖',
      type: 'success',
      timestamp: '6 hours ago',
      likes: 31,
      comments: 18,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '4',
      author: 'Jennifer K.',
      authorRole: 'parent',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      content: 'Quick question - what time do your kids usually do homework? Trying to find the sweet spot between too tired and too hyper!',
      type: 'question',
      timestamp: '1 day ago',
      likes: 15,
      comments: 24,
      isLiked: false,
      isBookmarked: false
    }
  ];

  const filters = [
    { id: 'all', label: 'All Posts', icon: Users },
    { id: 'question', label: 'Questions', icon: HelpCircle },
    { id: 'tip', label: 'Tips', icon: Lightbulb },
    { id: 'success', label: 'Success', icon: Award }
  ];

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return HelpCircle;
      case 'tip': return Lightbulb;
      case 'success': return Award;
      default: return MessageCircle;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'text-blue-600 bg-blue-100';
      case 'tip': return 'text-green-600 bg-green-100';
      case 'success': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPosts = selectedFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Parent Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with other REACH parents, share tips, ask questions, and celebrate successes together!
          </p>
          
          {/* New Post */}
          <div className="space-y-3">
            <Textarea
              placeholder="Share a tip, ask a question, or celebrate a success..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Camera className="h-4 w-4 mr-1" />
                  Photo
                </Button>
              </div>
              <Button 
                size="sm" 
                disabled={!newPost.trim()}
                onClick={() => setNewPost('')}
              >
                <Send className="h-4 w-4 mr-1" />
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedFilter(filter.id)}
            >
              <Icon className="h-4 w-4 mr-1" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const TypeIcon = getPostTypeIcon(post.type);
          return (
            <Card key={post.id}>
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{post.author}</h4>
                      {post.authorRole === 'teacher' && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Teacher
                        </Badge>
                      )}
                      <div className={`p-1 rounded-full ${getPostTypeColor(post.type)}`}>
                        <TypeIcon className="h-3 w-3" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={post.isBookmarked ? 'text-blue-500' : ''}
                  >
                    <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Community Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-medium text-blue-900 mb-1">Active Community</h4>
            <p className="text-sm text-blue-700">47 parents • 8 teachers • 156 posts this week</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}