-- Add country column to matchmaking_queue for country-based matching
ALTER TABLE public.matchmaking_queue 
ADD COLUMN country text DEFAULT NULL;

-- Add index for faster country filtering
CREATE INDEX idx_matchmaking_country ON public.matchmaking_queue(country);