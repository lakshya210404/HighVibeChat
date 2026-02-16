import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a display name is already taken (case-insensitive).
 * Optionally exclude a specific user ID (for the current user editing their own name).
 */
export async function isDisplayNameTaken(
  name: string,
  excludeUserId?: string
): Promise<boolean> {
  // Query profiles with case-insensitive match
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .ilike("display_name", name.trim())
    .limit(1);

  if (!data || data.length === 0) return false;

  // If excluding current user's own record
  if (excludeUserId && data[0].id === excludeUserId) return false;

  return true;
}
