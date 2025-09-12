import { ScrollArea } from "./ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import { MessageComposer } from "./MessageComposer";
import { EmptyState } from "./EmptyState";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
  senderName?: string;
}

interface Chat {
  id: string;
  name: string;
  status: string;
  avatar?: string;
  online: boolean;
  messages: Message[];
}

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  userName: string;
  onAddContact: () => void;
}

export function ChatArea({ chat, onSendMessage, userName, onAddContact }: ChatAreaProps) {
  if (!chat) {
    return (
      <div className="flex-1 bg-background">
        <EmptyState userName={userName} onAddContact={onAddContact} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        name={chat.name}
        status={chat.status}
        avatar={chat.avatar}
        online={chat.online}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {chat.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
        
        {/* Typing indicator */}
        {chat.online && (
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span>{chat.name} is typing...</span>
          </div>
        )}
      </ScrollArea>
      
      <MessageComposer onSendMessage={onSendMessage} />
    </div>
  );
}