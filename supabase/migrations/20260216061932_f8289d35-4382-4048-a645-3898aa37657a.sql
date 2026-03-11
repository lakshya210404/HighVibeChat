-- Fix: Recreate confessions policies as PERMISSIVE (restrictive policies can't grant access on their own)
DROP POLICY IF EXISTS "Anyone can read confessions" ON public.confessions;
DROP POLICY IF EXISTS "Anyone can post confessions" ON public.confessions;
DROP POLICY IF EXISTS "Anyone can delete confessions" ON public.confessions;
DROP POLICY IF EXISTS "System can update confessions likes_count" ON public.confessions;

CREATE POLICY "Anyone can read confessions" ON public.confessions FOR SELECT USING (true);
CREATE POLICY "Anyone can post confessions" ON public.confessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete confessions" ON public.confessions FOR DELETE USING (true);
CREATE POLICY "System can update confessions" ON public.confessions FOR UPDATE USING (true);

-- Also fix confession_votes policies
DROP POLICY IF EXISTS "Anyone can read votes" ON public.confession_votes;
DROP POLICY IF EXISTS "Anyone can vote" ON public.confession_votes;
DROP POLICY IF EXISTS "Anyone can remove vote" ON public.confession_votes;
DROP POLICY IF EXISTS "Anyone can change vote" ON public.confession_votes;

CREATE POLICY "Anyone can read votes" ON public.confession_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.confession_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove vote" ON public.confession_votes FOR DELETE USING (true);
CREATE POLICY "Anyone can change vote" ON public.confession_votes FOR UPDATE USING (true);

-- Also fix confession_comments policies
DROP POLICY IF EXISTS "Anyone can read comments" ON public.confession_comments;
DROP POLICY IF EXISTS "Anyone can post comments" ON public.confession_comments;
DROP POLICY IF EXISTS "Anyone can delete own comments" ON public.confession_comments;

CREATE POLICY "Anyone can read comments" ON public.confession_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can post comments" ON public.confession_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own comments" ON public.confession_comments FOR DELETE USING (true);