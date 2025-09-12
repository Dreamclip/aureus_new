import { supabase, type UserConversation, type Message } from './supabase';

export const conversationsService = {
  // Получение списка бесед
  async getUserConversations(): Promise<UserConversation[]> {
    try {
      const { data, error } = await supabase.rpc('get_user_conversations');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения бесед:', error);
      return [];
    }
  },

  // Создание личной беседы
  async createPrivateConversation(userId: string) {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Пользователь не авторизован');

      // Проверяем, есть ли уже беседа с этим пользователем
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants!inner (user_id)
        `)
        .eq('is_group', false)
        .eq('conversation_participants.user_id', currentUser.id);

      if (existingConversation) {
        for (const conv of existingConversation) {
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .is('left_at', null);

          const participantIds = participants?.map(p => p.user_id) || [];
          if (participantIds.includes(userId) && participantIds.length === 2) {
            return { conversation: conv, error: null };
          }
        }
      }

      // Создаем новую беседу
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          is_group: false,
          created_by: currentUser.id
        })
        .select()
        .single();

      if (convError) throw convError;

      // Добавляем участников
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: currentUser.id },
          { conversation_id: conversation.id, user_id: userId }
        ]);

      if (participantsError) throw participantsError;

      return { conversation, error: null };
    } catch (error: any) {
      return { conversation: null, error: error.message };
    }
  },

  // Получение сообщений беседы
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения сообщений:', error);
      return [];
    }
  },

  // Отправка сообщения
  async sendMessage(conversationId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text', fileUrl?: string) {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Пользователь не авторизован');

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content,
          message_type: messageType,
          file_url: fileUrl
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Создаем статусы сообщения для всех участников беседы
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .is('left_at', null);

      if (participants) {
        const statusInserts = participants
          .filter(p => p.user_id !== currentUser.id)
          .map(p => ({
            message_id: message.id,
            user_id: p.user_id,
            status: 'delivered' as const
          }));

        if (statusInserts.length > 0) {
          await supabase
            .from('message_status')
            .insert(statusInserts);
        }
      }

      return { message, error: null };
    } catch (error: any) {
      return { message: null, error: error.message };
    }
  },

  // Отметка сообщений как прочитанных
  async markMessagesAsRead(conversationId: string) {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) return;

      // Получаем все непрочитанные сообщения в беседе
      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUser.id);

      if (!messages || messages.length === 0) return;

      const messageIds = messages.map(m => m.id);

      // Обновляем статусы или создаем новые
      for (const messageId of messageIds) {
        await supabase
          .from('message_status')
          .upsert({
            message_id: messageId,
            user_id: currentUser.id,
            status: 'read',
            timestamp: new Date().toISOString()
          }, {
            onConflict: 'message_id,user_id'
          });
      }
    } catch (error) {
      console.error('Ошибка отметки сообщений как прочитанных:', error);
    }
  },

  // Подписка на новые сообщения
  subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Получаем полную информацию о сообщении с данными отправителя
          const { data: message } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey (
                id,
                display_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (message) {
            callback(message);
          }
        }
      )
      .subscribe();
  },

  // Подписка на обновления статусов сообщений
  subscribeToMessageStatus(callback: (status: any) => void) {
    return supabase
      .channel('message_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_status'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
};