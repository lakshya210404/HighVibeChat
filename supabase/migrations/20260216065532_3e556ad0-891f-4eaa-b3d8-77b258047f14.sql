
-- Add unique constraint on display_name (case-insensitive)
CREATE UNIQUE INDEX idx_profiles_display_name_unique ON public.profiles (lower(display_name));
