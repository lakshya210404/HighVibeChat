-- Drop the foreign key constraint that prevents anonymous users from posting
ALTER TABLE public.confessions DROP CONSTRAINT IF EXISTS confessions_user_id_fkey;