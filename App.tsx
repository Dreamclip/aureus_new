import { useAuth } from "./hooks/useAuth";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatArea } from "./components/ChatArea";
import { SettingsDialog } from "./components/SettingsDialog";
import { AuthScreen } from "./components/AuthScreen";
import { AddContactDialog } from "./components/AddContactDialog";
import { UserMenuDialog } from "./components/UserMenuDialog";
import { Toaster } from "./components/ui/sonner";
import { useConversations } from "./hooks/useConversations";
import { useMessages } from "./hooks/useMessages";
import { useFriends } from "./hooks/useFriends";
import { useState, useEffect } from "react";

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut, updateProfile } = useAuth();
  const { conversations, loading: conversationsLoading, createPrivateConversation, markAsRead } = useConversations();
  const { friends, searchResults, pendingRequests, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends();
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const { messages, sendMessage } = useMessages(selectedChatId);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    root.className = theme;
  }, [theme]);

  const selectedChat = conversations.find(chat => chat.id === selectedChatId) || null;

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    // Mark messages as read
    await markAsRead(chatId);
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleUserProfileUpdate = async (newProfile: { display_name: string; avatar_url: string }) => {
    await updateProfile(newProfile);
  };

  const handleLogin = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleRegister = async (email: string, password: string, username: string, displayName: string) => {
    return await signUp(email, password, username, displayName);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleAddContact = async (contact: any) => {
    // Create private conversation with the user
    const conversation = await createPrivateConversation(contact.id);
    if (conversation) {
      setSelectedChatId(conversation.id);
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-primary-foreground font-bold">A</span>
          </div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
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
        conversations={conversations}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onSettingsClick={() => setSettingsOpen(true)}
        onAddContact={() => setAddContactOpen(true)}
        onUserMenuClick={() => setUserMenuOpen(true)}
        userProfile={{
          id: user.id,
          name: user.display_name,
          avatar: user.avatar_url
        }}
        loading={conversationsLoading}
      />
      <ChatArea 
        chat={selectedChat ? {
          id: selectedChat.id,
          name: selectedChat.other_user_name || selectedChat.name || 'Беседа',
          status: selectedChat.other_user_online ? 'Онлайн' : 'Был недавно',
          avatar: selectedChat.other_user_avatar,
          online: selectedChat.other_user_online,
          messages: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwnMessage: msg.sender_id === user.id,
            status: 'read' as const,
            avatar: (msg as any).sender?.avatar_url,
            senderName: (msg as any).sender?.display_name
          }))
        } : null}
        onSendMessage={handleSendMessage}
        userName={user.display_name}
        onAddContact={() => setAddContactOpen(true)}
      />
      
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        userProfile={{
          id: user.id,
          name: user.display_name,
          avatar: user.avatar_url
        }}
        onUserProfileUpdate={handleUserProfileUpdate}
        onLogout={handleLogout}
      />
      
      <AddContactDialog
        isOpen={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onAddContact={handleAddContact}
        searchResults={searchResults}
        onSearch={searchUsers}
        onSendFriendRequest={sendFriendRequest}
        pendingRequests={pendingRequests}
        onAcceptRequest={acceptFriendRequest}
        onRejectRequest={rejectFriendRequest}
      />
      
      <UserMenuDialog
        isOpen={userMenuOpen}
        onClose={() => setUserMenuOpen(false)}
        onSettingsClick={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        onThemeChange={handleThemeChange}
        userProfile={{
          id: user.id,
          name: user.display_name,
          avatar: user.avatar_url
        }}
        theme={theme}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}