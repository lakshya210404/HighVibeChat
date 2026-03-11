-- Create enum for room status
CREATE TYPE public.room_status AS ENUM ('waiting', 'active', 'ended');

-- Create rooms table for matchmaking
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status room_status NOT NULL DEFAULT 'waiting',
  user1_id TEXT NOT NULL,
  user2_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create queue table for matchmaking
CREATE TABLE public.matchmaking_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for rooms (public access for anonymous users)
CREATE POLICY "Anyone can view rooms they're in"
ON public.rooms
FOR SELECT
USING (user1_id = current_setting('request.headers', true)::json->>'x-user-id' 
       OR user2_id = current_setting('request.headers', true)::json->>'x-user-id');

CREATE POLICY "Anyone can create rooms"
ON public.rooms
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users in room can update"
ON public.rooms
FOR UPDATE
USING (user1_id = current_setting('request.headers', true)::json->>'x-user-id' 
       OR user2_id = current_setting('request.headers', true)::json->>'x-user-id');

-- RLS policies for messages
CREATE POLICY "Users can view messages in their room"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rooms 
    WHERE rooms.id = messages.room_id 
    AND (rooms.user1_id = current_setting('request.headers', true)::json->>'x-user-id'
         OR rooms.user2_id = current_setting('request.headers', true)::json->>'x-user-id')
  )
);

CREATE POLICY "Users can insert messages in their room"
ON public.messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rooms 
    WHERE rooms.id = messages.room_id 
    AND (rooms.user1_id = current_setting('request.headers', true)::json->>'x-user-id'
         OR rooms.user2_id = current_setting('request.headers', true)::json->>'x-user-id')
  )
);

-- RLS policies for matchmaking queue (public for anonymous)
CREATE POLICY "Anyone can view queue"
ON public.matchmaking_queue
FOR SELECT
USING (true);

CREATE POLICY "Anyone can join queue"
ON public.matchmaking_queue
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can leave queue"
ON public.matchmaking_queue
FOR DELETE
USING (true);

-- Enable realtime for messages and rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;

-- Set replica identity for realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.rooms REPLICA IDENTITY FULL;