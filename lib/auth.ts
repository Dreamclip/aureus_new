import { supabase } from './supabase';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

export const authService = {
  // Регистрация
  async signUp(email: string, password: string, username: string, displayName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=5865f2&color=fff&size=128`
          }
        }
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Вход
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Выход
  async signOut() {
    try {
      // Обновляем статус пользователя на оффлайн
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ 
            is_online: false, 
            last_seen: new Date().toISOString() 
          })
          .eq('id', user.id);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Получение текущего пользователя
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url
      };
    } catch (error) {
      return null;
    }
  },

  // Обновление профиля
  async updateProfile(updates: Partial<Pick<AuthUser, 'display_name' | 'avatar_url' | 'username'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Обновление статуса онлайн
  async updateOnlineStatus(isOnline: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ 
          is_online: isOnline,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  }
};