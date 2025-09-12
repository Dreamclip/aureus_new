import { supabase, type SearchUser, type Profile } from './supabase';

export const friendsService = {
  // Поиск пользователей
  async searchUsers(searchTerm: string): Promise<SearchUser[]> {
    try {
      const { data, error } = await supabase.rpc('search_users', {
        search_term: searchTerm
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка поиска пользователей:', error);
      return [];
    }
  },

  // Получение списка друзей
  async getFriends(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase.rpc('get_friends');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения друзей:', error);
      return [];
    }
  },

  // Отправка запроса в друзья
  async sendFriendRequest(userId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          addressee_id: userId,
          status: 'pending'
        });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Принятие запроса в друзья
  async acceptFriendRequest(friendshipId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Отклонение запроса в друзья
  async rejectFriendRequest(friendshipId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Получение входящих запросов в друзья
  async getPendingRequests() {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          created_at,
          requester:profiles!friendships_requester_id_fkey (
            id,
            username,
            display_name,
            avatar_url,
            is_online
          )
        `)
        .eq('status', 'pending')
        .eq('addressee_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения запросов в друзья:', error);
      return [];
    }
  },

  // Удаление из друзей
  async removeFriend(userId: string) {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) throw new Error('Пользователь не авторизован');

      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${currentUser.id})`);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};