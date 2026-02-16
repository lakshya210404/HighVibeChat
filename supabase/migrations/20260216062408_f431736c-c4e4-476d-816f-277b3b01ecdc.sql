-- Add parent_id for threaded replies on comments
ALTER TABLE public.confession_comments ADD COLUMN parent_id uuid REFERENCES public.confession_comments(id) ON DELETE CASCADE;

-- Create comment likes table
CREATE TABLE public.confession_comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.confession_comments(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE public.confession_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comment likes" ON public.confession_comment_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can like comments" ON public.confession_comment_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can unlike comments" ON public.confession_comment_likes FOR DELETE USING (true);

-- Add likes_count to comments
ALTER TABLE public.confession_comments ADD COLUMN likes_count integer NOT NULL DEFAULT 0;

-- Trigger to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.confession_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.confession_comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_comment_likes_count_trigger
AFTER INSERT OR DELETE ON public.confession_comment_likes
FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes_count();