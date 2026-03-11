
-- Add country columns to rooms table to track where each user is chatting from
ALTER TABLE public.rooms ADD COLUMN user1_country text DEFAULT NULL;
ALTER TABLE public.rooms ADD COLUMN user2_country text DEFAULT NULL;
