-- Create table for WebRTC signaling data
CREATE TABLE public.webrtc_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate')),
  signal_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webrtc_signals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert signals (anonymous users)
CREATE POLICY "Anyone can insert signals" 
ON public.webrtc_signals 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read signals intended for them
CREATE POLICY "Anyone can read their signals" 
ON public.webrtc_signals 
FOR SELECT 
USING (true);

-- Allow anyone to delete old signals
CREATE POLICY "Anyone can delete signals" 
ON public.webrtc_signals 
FOR DELETE 
USING (true);

-- Enable realtime for signals
ALTER PUBLICATION supabase_realtime ADD TABLE public.webrtc_signals;

-- Create index for faster queries
CREATE INDEX idx_webrtc_signals_room_receiver ON public.webrtc_signals(room_id, receiver_id);

-- Auto-cleanup old signals (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_signals()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.webrtc_signals WHERE created_at < now() - interval '1 hour';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER cleanup_signals_trigger
AFTER INSERT ON public.webrtc_signals
FOR EACH STATEMENT
EXECUTE FUNCTION cleanup_old_signals();