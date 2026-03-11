
-- Create confessions table
CREATE TABLE public.confessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  emoji TEXT DEFAULT '🔥',
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create confession likes table (to track who liked what)
CREATE TABLE public.confession_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(confession_id, user_id)
);

-- Enable RLS
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confession_likes ENABLE ROW LEVEL SECURITY;

-- Confessions policies: anyone authenticated can read, post, and delete their own
CREATE POLICY "Anyone can read confessions"
  ON public.confessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can post confessions"
  ON public.confessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own confessions"
  ON public.confessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update confessions likes_count"
  ON public.confessions FOR UPDATE
  TO authenticated
  USING (true);

-- Confession likes policies
CREATE POLICY "Anyone can read likes"
  ON public.confession_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like confessions"
  ON public.confession_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike confessions"
  ON public.confession_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to increment/decrement likes_count
CREATE OR REPLACE FUNCTION public.update_confession_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.confessions SET likes_count = likes_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.confessions SET likes_count = likes_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_likes_count
AFTER INSERT OR DELETE ON public.confession_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_confession_likes_count();

-- Enable realtime for confessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;
