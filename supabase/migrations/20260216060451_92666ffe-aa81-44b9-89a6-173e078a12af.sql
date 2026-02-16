-- Allow anyone to post confessions (anonymous)
DROP POLICY IF EXISTS "Authenticated users can post confessions" ON public.confessions;
CREATE POLICY "Anyone can post confessions"
  ON public.confessions FOR INSERT
  WITH CHECK (true);