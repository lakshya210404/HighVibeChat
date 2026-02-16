
-- Table to track time-based premium access
CREATE TABLE public.premium_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL,
  product_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own access
CREATE POLICY "Users can view their own premium access"
ON public.premium_access FOR SELECT
USING (auth.uid() = user_id);

-- Service role inserts (via edge function)
CREATE POLICY "Service role can insert premium access"
ON public.premium_access FOR INSERT
WITH CHECK (true);

-- Index for quick lookups
CREATE INDEX idx_premium_access_user_expires ON public.premium_access (user_id, expires_at DESC);
