
-- Fix 1: Remove duplicate overly permissive rooms policies
DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Anyone can update rooms" ON public.rooms;

-- Fix 2: Tighten confessions DELETE - only owner can delete
DROP POLICY IF EXISTS "Anyone can delete confessions" ON public.confessions;
CREATE POLICY "Users can delete own confessions"
  ON public.confessions FOR DELETE
  USING (
    user_id IS NOT NULL 
    AND user_id::text = COALESCE(
      auth.uid()::text,
      current_setting('request.headers', true)::json->>'x-user-id'
    )
  );

-- Fix 3: Tighten confession_comments DELETE - only owner can delete
DROP POLICY IF EXISTS "Anyone can delete own comments" ON public.confession_comments;
CREATE POLICY "Users can delete own comments"
  ON public.confession_comments FOR DELETE
  USING (
    user_id = COALESCE(
      auth.uid()::text,
      current_setting('request.headers', true)::json->>'x-user-id'
    )
  );

-- Fix 4: Tighten confession_votes DELETE - only owner can remove their vote
DROP POLICY IF EXISTS "Anyone can remove vote" ON public.confession_votes;
CREATE POLICY "Users can remove own vote"
  ON public.confession_votes FOR DELETE
  USING (
    user_id = COALESCE(
      auth.uid()::text,
      current_setting('request.headers', true)::json->>'x-user-id'
    )
  );

-- Fix 5: Tighten confession_votes UPDATE - only owner can change their vote
DROP POLICY IF EXISTS "Anyone can change vote" ON public.confession_votes;
CREATE POLICY "Users can change own vote"
  ON public.confession_votes FOR UPDATE
  USING (
    user_id = COALESCE(
      auth.uid()::text,
      current_setting('request.headers', true)::json->>'x-user-id'
    )
  );

-- Fix 6: Tighten confession_comment_likes DELETE - only owner can unlike
DROP POLICY IF EXISTS "Anyone can unlike comments" ON public.confession_comment_likes;
CREATE POLICY "Users can unlike own comment likes"
  ON public.confession_comment_likes FOR DELETE
  USING (
    user_id = COALESCE(
      auth.uid()::text,
      current_setting('request.headers', true)::json->>'x-user-id'
    )
  );
