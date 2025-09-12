import { Search, Plus, Settings, MoreHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

interface Conversation {
  id: string;
  name?: string;
  other_user_name: string;
  other_user_avatar: string;
  other_user_online: boolean;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onAddContact: () => void;
  onUserMenuClick: () => void;
  userProfile: {
    id: string;
    name: string;
    avatar: string;
  };
  loading?: boolean;
}

export function ChatSidebar({ 
  conversations, 
  selectedChatId, 
  onChatSelect, 
  onSettingsClick, 
  onAddContact, 
  onUserMenuClick, 
  userProfile,
  loading = false
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-primary font-medium">Aureus</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddContact}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск бесед..." 
            className="pl-10 bg-input-background border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg mb-1">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Нет бесед</p>
              <p className="text-sm">Добавьте друзей, чтобы начать общение</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onChatSelect(conversation.id)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1
                  ${selectedChatId === conversation.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent text-foreground'
                  }
                `}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.other_user_avatar} alt={conversation.other_user_name} />
                    <AvatarFallback>{conversation.other_user_name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.other_user_online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{conversation.other_user_name}</span>
                    <span className={`text-xs ${selectedChatId === conversation.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${selectedChatId === conversation.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {conversation.last_message}
                    </p>
                    {conversation.unread_count > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 text-xs flex items-center justify-center bg-blue-500 hover:bg-blue-600">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile.avatar} alt="Your Avatar" />
              <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground">Онлайн</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUserMenuClick}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}