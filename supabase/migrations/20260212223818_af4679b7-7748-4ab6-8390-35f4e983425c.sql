-- Fix RLS policies for messages - make SELECT permissive for anonymous Realtime subscriptions
DROP POLICY IF EXISTS "Users can view messages in their room " ON public.messages;
CREATE POLICY "Anyone can view messages"
  ON public.messages FOR SELECT
  USING (true);

-- Fix RLS policies for messages INSERT - make it permissive for anonymous users
DROP POLICY IF EXISTS "Users can insert messages in their room " ON public.messages;
CREATE POLICY "Anyone can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);

-- Fix RLS policies for rooms - make SELECT permissive for Realtime
DROP POLICY IF EXISTS "Anyone can view rooms they're in " ON public.rooms;
CREATE POLICY "Anyone can view rooms"
  ON public.rooms FOR SELECT
  USING (true);

-- Fix rooms UPDATE policy
DROP POLICY IF EXISTS "Users in room can update " ON public.rooms;
CREATE POLICY "Anyone can update rooms"
  ON public.rooms FOR UPDATE
  USING (true);