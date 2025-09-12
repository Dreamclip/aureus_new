import { useState } from "react";
import { Send, Paperclip, Image, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSendMessage, disabled = false }: MessageComposerProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-end gap-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10" disabled={disabled}>
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-10 max-h-32 resize-none pr-12 bg-input-background border-0"
            disabled={disabled}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            disabled={disabled}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          {message.trim() ? (
            <Button 
              onClick={handleSend} 
              size="icon" 
              className="h-10 w-10 bg-blue-500 hover:bg-blue-600"
              disabled={disabled}
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-10 w-10" disabled={disabled}>
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}