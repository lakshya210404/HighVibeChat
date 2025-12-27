-- Add gender and preferences columns to matchmaking_queue
ALTER TABLE public.matchmaking_queue ADD COLUMN gender text DEFAULT 'other';
ALTER TABLE public.matchmaking_queue ADD COLUMN looking_for text DEFAULT 'everyone';

-- Create index for gender matching
CREATE INDEX idx_matchmaking_gender ON public.matchmaking_queue(gender, looking_for);