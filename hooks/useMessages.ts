import { useState, useEffect } from 'react';
import { conversationsService, type Message } from '../lib/conversations';
import { toast } from 'sonner';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await conversationsService.getConversationMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
        toast.error('Ошибка загрузки сообщений');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Подписываемся на новые сообщения
    const subscription = conversationsService.subscribeToMessages(
      conversationId,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    const { message, error } = await conversationsService.sendMessage(conversationId, content.trim());
    if (error) {
      toast.error(error);
      return;
    }

    // Сообщение будет добавлено через подписку
  };

  return {
    messages,
    loading,
    sendMessage
  };
}