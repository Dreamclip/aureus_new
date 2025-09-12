import { Button } from "./ui/button";
import { Plus, MessageCircle, Users, Sparkles } from "lucide-react";

interface EmptyStateProps {
  userName: string;
  onAddContact: () => void;
}

export function EmptyState({ userName, onAddContact }: EmptyStateProps) {
  return (
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1751732347348-815bb8598e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwZm9yZXN0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NzY5NzY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-md p-8">
        {/* Welcome Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Добро пожаловать в Aureus, {userName}! 
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Вы успешно зарегистрировались! Теперь вы можете начать общение с друзьями и коллегами. 
            Добавьте первый контакт, чтобы начать переписку.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onAddContact}
            size="lg"
            className="w-full"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить первый контакт
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Мгновенные сообщения</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Групповые чаты</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 -right-2 w-6 h-6 bg-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}