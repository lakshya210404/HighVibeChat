
-- Fix 1: Restrict profiles SELECT to own profile only (email is PII)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Fix 2: Drop overly permissive messages SELECT policy
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;

-- Fix 3: Drop overly permissive messages INSERT policy  
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
