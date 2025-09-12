import { useState, useEffect } from 'react';
import { conversationsService, type UserConversation, type Message } from '../lib/conversations';
import { toast } from 'sonner';

export function useConversations() {
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      const data = await conversationsService.getUserConversations();
      setConversations(data);
    } catch (error) {
      console.error('Ошибка загрузки бесед:', error);
      toast.error('Ошибка загрузки бесед');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const createPrivateConversation = async (userId: string) => {
    const { conversation, error } = await conversationsService.createPrivateConversation(userId);
    if (error) {
      toast.error(error);
      return null;
    }
    
    // Обновляем список бесед
    await loadConversations();
    return conversation;
  };

  const markAsRead = async (conversationId: string) => {
    await conversationsService.markMessagesAsRead(conversationId);
    
    // Обновляем локальное состояние
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
  };

  return {
    conversations,
    loading,
    loadConversations,
    createPrivateConversation,
    markAsRead
  };
}