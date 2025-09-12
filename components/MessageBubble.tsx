import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  status?: 'sent' | 'delivered' | 'read';
  avatar?: string;
  senderName?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { content, timestamp, isOwnMessage, status, avatar, senderName } = message;

  return (
    <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-auto">
          <AvatarImage src={avatar} alt={senderName} />
          <AvatarFallback>{senderName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col gap-1 max-w-xs lg:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-4 py-2 rounded-2xl break-words
            ${isOwnMessage 
              ? 'bg-primary text-primary-foreground rounded-br-md' 
              : 'bg-muted text-foreground rounded-bl-md'
            }
          `}
        >
          {content}
        </div>
        
        <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          <span>{timestamp}</span>
          {isOwnMessage && status && (
            <div className="flex items-center">
              {status === 'sent' && <Check className="h-3 w-3" />}
              {status === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}