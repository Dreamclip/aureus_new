import { useState, useEffect } from 'react';
import { friendsService, type SearchUser, type Profile } from '../lib/friends';
import { toast } from 'sonner';

export function useFriends() {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = async () => {
    try {
      const data = await friendsService.getFriends();
      setFriends(data);
    } catch (error) {
      console.error('Ошибка загрузки друзей:', error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const data = await friendsService.getPendingRequests();
      setPendingRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки запросов:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadFriends(), loadPendingRequests()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await friendsService.searchUsers(searchTerm.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      toast.error('Ошибка поиска пользователей');
    }
  };

  const sendFriendRequest = async (userId: string) => {
    const { error } = await friendsService.sendFriendRequest(userId);
    if (error) {
      toast.error(error);
      return false;
    }

    toast.success('Запрос в друзья отправлен!');
    
    // Обновляем результаты поиска
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, friendship_status: 'pending' }
          : user
      )
    );
    
    return true;
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    const { error } = await friendsService.acceptFriendRequest(friendshipId);
    if (error) {
      toast.error(error);
      return false;
    }

    toast.success('Запрос принят!');
    await Promise.all([loadFriends(), loadPendingRequests()]);
    return true;
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    const { error } = await friendsService.rejectFriendRequest(friendshipId);
    if (error) {
      toast.error(error);
      return false;
    }

    toast.success('Запрос отклонен');
    await loadPendingRequests();
    return true;
  };

  const removeFriend = async (userId: string) => {
    const { error } = await friendsService.removeFriend(userId);
    if (error) {
      toast.error(error);
      return false;
    }

    toast.success('Пользователь удален из друзей');
    await loadFriends();
    return true;
  };

  return {
    friends,
    searchResults,
    pendingRequests,
    loading,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    loadFriends
  };
}