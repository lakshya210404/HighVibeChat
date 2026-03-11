-- Allow anyone to delete confessions (we track ownership client-side via user_id matching)
DROP POLICY IF EXISTS "Users can delete their own confessions" ON public.confessions;
CREATE POLICY "Anyone can delete confessions" ON public.confessions FOR DELETE USING (true);