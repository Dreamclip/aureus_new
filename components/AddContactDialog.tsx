import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserSearch, Mail, Search, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: any) => void;
}

// No predefined contacts - users start with empty list
const availableContacts: any[] = [];

export function AddContactDialog({ isOpen, onClose, onAddContact }: AddContactDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"search" | "email">("search");

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = (contact: any) => {
    const newChat = {
      id: contact.id,
      name: contact.name,
      lastMessage: "Начните общение!",
      timestamp: "сейчас",
      unread: 0,
      online: contact.isOnline,
      avatar: contact.avatar,
      status: contact.status,
      messages: []
    };
    onAddContact(newChat);
    onClose();
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
        
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={selectedTab === "search" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedTab("search")}
            >
              <Search className="h-4 w-4 mr-2" />
              Поиск
            </Button>
            <Button
              variant={selectedTab === "email" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => setSelectedTab("email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              По Email
            </Button>
          </div>

          {selectedTab === "search" ? (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Contact List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{contact.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      <p className="text-xs text-muted-foreground">{contact.status}</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleAddContact(contact)}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Добавить
                    </Button>
                  </div>
                ))}

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <UserSearch className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    {searchQuery ? (
                      <>
                        <p className="text-lg mb-2">Пользователей не найдено</p>
                        <p className="text-sm">Попробуйте изменить запрос или пригласите друзей по email</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg mb-2">Начните поиск</p>
                        <p className="text-sm">Введите имя или email для поиска пользователей</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email адрес</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="mt-1"
                />
              </div>
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Отправить приглашение
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}