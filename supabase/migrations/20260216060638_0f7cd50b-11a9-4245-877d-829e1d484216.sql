-- Create confession_votes table (replaces simple likes with upvote/downvote)
CREATE TABLE public.confession_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id uuid NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(confession_id, user_id)
);

ALTER TABLE public.confession_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes" ON public.confession_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.confession_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can change vote" ON public.confession_votes FOR UPDATE USING (true);
CREATE POLICY "Anyone can remove vote" ON public.confession_votes FOR DELETE USING (true);

-- Add upvotes/downvotes columns to confessions
ALTER TABLE public.confessions ADD COLUMN upvotes integer NOT NULL DEFAULT 0;
ALTER TABLE public.confessions ADD COLUMN downvotes integer NOT NULL DEFAULT 0;
ALTER TABLE public.confessions ADD COLUMN comments_count integer NOT NULL DEFAULT 0;

-- Create confession_comments table
CREATE TABLE public.confession_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id uuid NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  display_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.confession_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON public.confession_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can post comments" ON public.confession_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own comments" ON public.confession_comments FOR DELETE USING (true);

-- Trigger to update vote counts on confessions
CREATE OR REPLACE FUNCTION public.update_confession_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.confessions SET
      upvotes = (SELECT count(*) FROM public.confession_votes WHERE confession_id = NEW.confession_id AND vote_type = 'up'),
      downvotes = (SELECT count(*) FROM public.confession_votes WHERE confession_id = NEW.confession_id AND vote_type = 'down')
    WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.confessions SET
      upvotes = (SELECT count(*) FROM public.confession_votes WHERE confession_id = OLD.confession_id AND vote_type = 'up'),
      downvotes = (SELECT count(*) FROM public.confession_votes WHERE confession_id = OLD.confession_id AND vote_type = 'down')
    WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON public.confession_votes
FOR EACH ROW EXECUTE FUNCTION public.update_confession_vote_counts();

-- Trigger to update comments count
CREATE OR REPLACE FUNCTION public.update_confession_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.confessions SET comments_count = comments_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.confessions SET comments_count = comments_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_comments_count
AFTER INSERT OR DELETE ON public.confession_comments
FOR EACH ROW EXECUTE FUNCTION public.update_confession_comments_count();

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.confession_comments;