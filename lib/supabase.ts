import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  status: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  reply_to?: string;
  created_at: string;
  updated_at: string;
}

export interface MessageStatus {
  id: string;
  message_id: string;
  user_id: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface UserConversation {
  id: string;
  name?: string;
  is_group: boolean;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  other_user_id?: string;
  other_user_name: string;
  other_user_avatar: string;
  other_user_online: boolean;
}

export interface SearchUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_online: boolean;
  friendship_status: string;
}