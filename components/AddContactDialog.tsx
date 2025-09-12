import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserSearch, Mail, Search, Send, UserPlus, Check, X, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

interface SearchUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_online: boolean;
  friendship_status: string;
}

interface PendingRequest {
  id: string;
  created_at: string;
  requester: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_online: boolean;
  };
}

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: any) => void;
  searchResults: SearchUser[];
  onSearch: (query: string) => void;
  onSendFriendRequest: (userId: string) => Promise<boolean>;
  pendingRequests: PendingRequest[];
  onAcceptRequest: (requestId: string) => Promise<boolean>;
  onRejectRequest: (requestId: string) => Promise<boolean>;
}

export function AddContactDialog({ 
  isOpen, 
  onClose, 
  onAddContact, 
  searchResults,
  onSearch,
  onSendFriendRequest,
  pendingRequests,
  onAcceptRequest,
  onRejectRequest
}: AddContactDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"search" | "requests">("search");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSendRequest = async (userId: string) => {
    const success = await onSendFriendRequest(userId);
    if (success) {
      // Обновляем локальное состояние результатов поиска
      // Это будет обработано в родительском компоненте
    }
  };

  const handleStartChat = (user: SearchUser) => {
    onAddContact(user);
    onClose();
  };

  const getActionButton = (user: SearchUser) => {
    switch (user.friendship_status) {
      case 'accepted':
        return (
          <Button 
            size="sm" 
            onClick={() => handleStartChat(user)}
            className="shrink-0"
          >
            <Send className="h-4 w-4 mr-1" />
            Написать
          </Button>
        );
      case 'pending':
        return (
          <Button 
            size="sm" 
            variant="outline"
            disabled
            className="shrink-0"
          >
            <Clock className="h-4 w-4 mr-1" />
            Отправлено
          </Button>
        );
      case 'none':
      default:
        return (
          <Button 
            size="sm" 
            onClick={() => handleSendRequest(user.id)}
            className="shrink-0"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить контакт</DialogTitle>
          <DialogDescription>
            Найдите людей для общения в Aureus
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Mail className="h-4 w-4 mr-2" />
              Запросы
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или username..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} alt={user.display_name} />
                        <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                      </Avatar>
                      {user.is_online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.display_name}</p>
                      <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-muted-foreground">
                          {user.is_online ? 'Онлайн' : 'Не в сети'}
                        </span>
                      </div>
                    </div>
                    
                    {getActionButton(user)}
                  </div>
                ))}

                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <UserSearch className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Пользователей не найдено</p>
                    <p className="text-sm">Попробуйте изменить запрос</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-12 text-muted-foreground">
                    <UserSearch className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Начните поиск</p>
                    <p className="text-sm">Введите имя или username для поиска пользователей</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={request.requester.avatar_url} alt={request.requester.display_name} />
                        <AvatarFallback>{request.requester.display_name[0]}</AvatarFallback>
                      </Avatar>
                      {request.requester.is_online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{request.requester.display_name}</p>
                      <p className="text-sm text-muted-foreground truncate">@{request.requester.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onAcceptRequest(request.id)}
                        className="shrink-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRejectRequest(request.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingRequests.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Нет запросов</p>
                    <p className="text-sm">Входящие запросы в друзья появятся здесь</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}