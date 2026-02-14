
-- Add auth_user_id column to matchmaking_queue to link anonymous IDs to auth IDs
ALTER TABLE public.matchmaking_queue ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add auth_user_id columns to rooms table
ALTER TABLE public.rooms ADD COLUMN user1_auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.rooms ADD COLUMN user2_auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
