import { useState, useEffect } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatArea } from "./components/ChatArea";
import { SettingsDialog } from "./components/SettingsDialog";
import { AuthScreen } from "./components/AuthScreen";
import { AddContactDialog } from "./components/AddContactDialog";
import { UserMenuDialog } from "./components/UserMenuDialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

// Simple user database simulation
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  avatar: string;
}

const users: User[] = [
  {
    id: 1,
    email: "demo@aureus.com",
    password: "demo123",
    name: "Демо Пользователь",
    avatar: "https://ui-avatars.com/api/?name=Демо%20Пользователь&background=5865f2&color=fff&size=128"
  }
];

let nextUserId = 2;

export default function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [theme, setTheme] = useState<string>("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [userProfile, setUserProfile] = useState({
    id: 0,
    name: "",
    avatar: ""
  });

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    root.className = theme;
  }, [theme]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Clear unread count when selecting a chat
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwnMessage: true,
      status: 'sent' as const
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: content,
              timestamp: "now"
            }
          : chat
      )
    );

    // Simulate message status updates with notifications
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
                )
              }
            : chat
        )
      );
      toast.success("Сообщение доставлено", {
        duration: 2000,
        position: "bottom-right"
      });
    }, 1000);

    // Simulate read status after 2 seconds
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
                )
              }
            : chat
        )
      );
      toast.info("Сообщение прочитано", {
        duration: 2000,
        position: "bottom-right"
      });
    }, 2000);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleUserProfileUpdate = (newProfile: typeof userProfile) => {
    setUserProfile(newProfile);
    // Update current user data
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: newProfile.name,
        avatar: newProfile.avatar
      });
    }
  };

  const handleLogin = (email: string, password: string) => {
    // Find user in database
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setUserProfile({
        id: user.id,
        name: user.name,
        avatar: user.avatar
      });
      setIsAuthenticated(true);
      // Clear chats for existing user (start fresh each session)
      setChats([]);
      toast.success(`Добро пожаловать, ${user.name}!`);
    } else {
      toast.error("Неверный email или пароль");
    }
  };

  const handleRegister = (email: string, password: string, name: string) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      toast.error("Пользователь с таким email уже существует");
      return;
    }

    // Create new user with default generated avatar
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5865f2&color=fff&size=128`;
    const newUser: User = {
      id: nextUserId++,
      email,
      password,
      name,
      avatar: defaultAvatar
    };

    users.push(newUser);
    setCurrentUser(newUser);
    setUserProfile({
      id: newUser.id,
      name: newUser.name,
      avatar: newUser.avatar
    });
    setIsAuthenticated(true);
    // New user starts with empty chat list
    setChats([]);
    toast.success(`Добро пожаловать в Aureus, ${name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserProfile({ id: 0, name: "", avatar: "" });
    setChats([]);
    setSelectedChatId(null);
    setSettingsOpen(false);
    setAddContactOpen(false);
    setUserMenuOpen(false);
  };

  const handleAddContact = (contact: any) => {
    setChats(prevChats => [...prevChats, contact]);
    toast.success(`${contact.name} добавлен в контакты!`);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar 
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onSettingsClick={() => setSettingsOpen(true)}
        onAddContact={() => setAddContactOpen(true)}
        onUserMenuClick={() => setUserMenuOpen(true)}
        userProfile={userProfile}
      />
      <ChatArea 
        chat={selectedChat}
        onSendMessage={handleSendMessage}
        userName={userProfile.name}
        onAddContact={() => setAddContactOpen(true)}
      />
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        userProfile={userProfile}
        onUserProfileUpdate={handleUserProfileUpdate}
        onLogout={handleLogout}
      />
      
      <AddContactDialog
        isOpen={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onAddContact={handleAddContact}
      />
      
      <UserMenuDialog
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        onSettingsClick={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        onThemeChange={handleThemeChange}
        userProfile={userProfile}
        theme={theme}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}