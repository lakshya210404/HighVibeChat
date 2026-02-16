-- Add vibe column to matchmaking_queue for mood-based matching
ALTER TABLE public.matchmaking_queue 
ADD COLUMN vibe text DEFAULT NULL;

-- Add index for faster vibe filtering
CREATE INDEX idx_matchmaking_vibe ON public.matchmaking_queue(vibe);