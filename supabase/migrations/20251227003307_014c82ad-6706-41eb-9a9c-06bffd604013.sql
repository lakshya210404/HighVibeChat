-- Add interests column to matchmaking_queue for interest-based matching
ALTER TABLE public.matchmaking_queue ADD COLUMN interests text[] DEFAULT '{}';

-- Add is_premium column for priority matching
ALTER TABLE public.matchmaking_queue ADD COLUMN is_premium boolean DEFAULT false;

-- Create index for faster interest matching queries
CREATE INDEX idx_matchmaking_interests ON public.matchmaking_queue USING GIN(interests);

-- Create index for premium users (they get matched first)
CREATE INDEX idx_matchmaking_premium ON public.matchmaking_queue(is_premium DESC, created_at ASC);