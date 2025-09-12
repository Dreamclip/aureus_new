import { Search, Plus, Settings, MoreHorizontal, Phone, Video, Bell } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onAddContact: (contact: any) => void;
  onUserMenuClick: () => void;
  userProfile: {
    id: number;
    name: string;
    avatar: string;
  };
}

export function ChatSidebar({ chats, selectedChatId, onChatSelect, onSettingsClick, onAddContact, onUserMenuClick, userProfile }: ChatSidebarProps) {
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
            placeholder="Search conversations..." 
            className="pl-10 bg-input-background border-0"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1
                ${selectedChatId === chat.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent text-foreground'
                }
              `}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{chat.name}</span>
                  <span className={`text-xs ${selectedChatId === chat.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {chat.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${selectedChatId === chat.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <Badge variant="default" className="h-5 min-w-5 text-xs flex items-center justify-center bg-blue-500 hover:bg-blue-600">
                      {chat.unread > 99 ? '99+' : chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
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