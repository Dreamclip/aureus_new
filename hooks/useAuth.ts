import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService, type AuthUser } from '../lib/auth';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущего пользователя
    const getCurrentUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Обновляем статус на онлайн
          await authService.updateOnlineStatus(true);
        }
      } catch (error) {
        console.error('Ошибка получения пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          if (currentUser) {
            await authService.updateOnlineStatus(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Обновляем статус при закрытии страницы
    const handleBeforeUnload = () => {
      if (user) {
        authService.updateOnlineStatus(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Периодически обновляем статус онлайн
    const interval = setInterval(() => {
      if (user) {
        authService.updateOnlineStatus(true);
      }
    }, 30000); // каждые 30 секунд

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
    };
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    const { user, error } = await authService.signIn(email, password);
    if (error) {
      toast.error(error);
      return false;
    }
    return true;
  };

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    const { user, error } = await authService.signUp(email, password, username, displayName);
    if (error) {
      toast.error(error);
      return false;
    }
    toast.success('Аккаунт создан успешно!');
    return true;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      toast.error(error);
      return false;
    }
    setUser(null);
    return true;
  };

  const updateProfile = async (updates: Partial<Pick<AuthUser, 'display_name' | 'avatar_url' | 'username'>>) => {
    const { error } = await authService.updateProfile(updates);
    if (error) {
      toast.error(error);
      return false;
    }
    
    // Обновляем локальное состояние
    if (user) {
      setUser({ ...user, ...updates });
    }
    
    toast.success('Профиль обновлен!');
    return true;
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}