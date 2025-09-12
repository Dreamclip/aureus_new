/*
  # Создание схемы для мессенджера Aureus

  1. Новые таблицы
    - `profiles` - профили пользователей
      - `id` (uuid, primary key, связан с auth.users)
      - `username` (text, уникальный)
      - `display_name` (text)
      - `avatar_url` (text)
      - `status` (text)
      - `is_online` (boolean)
      - `last_seen` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `friendships` - дружеские связи
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key)
      - `addressee_id` (uuid, foreign key)
      - `status` (text) - pending, accepted, blocked
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `conversations` - беседы
      - `id` (uuid, primary key)
      - `name` (text, nullable для личных чатов)
      - `is_group` (boolean)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `conversation_participants` - участники бесед
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `joined_at` (timestamptz)
      - `left_at` (timestamptz, nullable)
    
    - `messages` - сообщения
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key)
      - `content` (text)
      - `message_type` (text) - text, image, file
      - `file_url` (text, nullable)
      - `reply_to` (uuid, nullable, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `message_status` - статусы сообщений
      - `id` (uuid, primary key)
      - `message_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `status` (text) - sent, delivered, read
      - `timestamp` (timestamptz)

  2. Безопасность
    - Включить RLS для всех таблиц
    - Добавить политики для CRUD операций
    - Настроить триггеры для обновления timestamps

  3. Функции
    - Функция для создания профиля при регистрации
    - Функция для поиска пользователей
    - Функция для получения списка друзей
*/

-- Создание таблицы профилей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text DEFAULT '',
  status text DEFAULT 'Онлайн',
  is_online boolean DEFAULT true,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы дружеских связей
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- Создание таблицы бесед
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  is_group boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы участников бесед
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  UNIQUE(conversation_id, user_id)
);

-- Создание таблицы сообщений
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url text,
  reply_to uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создание таблицы статусов сообщений
CREATE TABLE IF NOT EXISTS message_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  timestamp timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Включение RLS для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_status ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Политики для friendships
CREATE POLICY "Users can view their friendships"
  ON friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friendship requests"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're involved in"
  ON friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Политики для conversations
CREATE POLICY "Users can view conversations they participate in"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid() 
      AND left_at IS NULL
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Политики для conversation_participants
CREATE POLICY "Users can view participants of their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
      AND cp2.left_at IS NULL
    )
  );

CREATE POLICY "Users can join conversations"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Политики для messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid() 
      AND left_at IS NULL
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = auth.uid() 
      AND left_at IS NULL
    )
  );

-- Политики для message_status
CREATE POLICY "Users can view message status"
  ON message_status FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
      WHERE m.id = message_status.message_id
      AND cp.user_id = auth.uid()
      AND cp.left_at IS NULL
    )
  );

CREATE POLICY "Users can update message status"
  ON message_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their message status"
  ON message_status FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Функция для создания профиля при регистрации
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для создания профиля
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Функция для поиска пользователей
CREATE OR REPLACE FUNCTION search_users(search_term text)
RETURNS TABLE (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  is_online boolean,
  friendship_status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.is_online,
    COALESCE(
      CASE 
        WHEN f1.status IS NOT NULL THEN f1.status
        WHEN f2.status IS NOT NULL THEN f2.status
        ELSE 'none'
      END,
      'none'
    ) as friendship_status
  FROM profiles p
  LEFT JOIN friendships f1 ON (f1.requester_id = auth.uid() AND f1.addressee_id = p.id)
  LEFT JOIN friendships f2 ON (f2.requester_id = p.id AND f2.addressee_id = auth.uid())
  WHERE 
    p.id != auth.uid() AND
    (
      p.username ILIKE '%' || search_term || '%' OR
      p.display_name ILIKE '%' || search_term || '%'
    )
  ORDER BY p.display_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения друзей
CREATE OR REPLACE FUNCTION get_friends()
RETURNS TABLE (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  status text,
  is_online boolean,
  last_seen timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.status,
    p.is_online,
    p.last_seen
  FROM profiles p
  JOIN friendships f ON (
    (f.requester_id = auth.uid() AND f.addressee_id = p.id) OR
    (f.requester_id = p.id AND f.addressee_id = auth.uid())
  )
  WHERE f.status = 'accepted'
  ORDER BY p.is_online DESC, p.last_seen DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения бесед пользователя
CREATE OR REPLACE FUNCTION get_user_conversations()
RETURNS TABLE (
  id uuid,
  name text,
  is_group boolean,
  last_message text,
  last_message_time timestamptz,
  unread_count bigint,
  other_user_id uuid,
  other_user_name text,
  other_user_avatar text,
  other_user_online boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.is_group,
    COALESCE(last_msg.content, 'Начните общение!') as last_message,
    COALESCE(last_msg.created_at, c.created_at) as last_message_time,
    COALESCE(unread.count, 0) as unread_count,
    CASE 
      WHEN c.is_group THEN NULL
      ELSE other_participant.user_id
    END as other_user_id,
    CASE 
      WHEN c.is_group THEN c.name
      ELSE other_user.display_name
    END as other_user_name,
    CASE 
      WHEN c.is_group THEN ''
      ELSE other_user.avatar_url
    END as other_user_avatar,
    CASE 
      WHEN c.is_group THEN false
      ELSE other_user.is_online
    END as other_user_online
  FROM conversations c
  JOIN conversation_participants cp ON c.id = cp.conversation_id
  LEFT JOIN conversation_participants other_participant ON (
    c.id = other_participant.conversation_id AND 
    other_participant.user_id != auth.uid() AND
    other_participant.left_at IS NULL AND
    NOT c.is_group
  )
  LEFT JOIN profiles other_user ON other_participant.user_id = other_user.id
  LEFT JOIN LATERAL (
    SELECT content, created_at
    FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) last_msg ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count
    FROM messages m
    LEFT JOIN message_status ms ON (m.id = ms.message_id AND ms.user_id = auth.uid())
    WHERE m.conversation_id = c.id 
    AND m.sender_id != auth.uid()
    AND (ms.status IS NULL OR ms.status != 'read')
  ) unread ON true
  WHERE cp.user_id = auth.uid() AND cp.left_at IS NULL
  ORDER BY last_message_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;