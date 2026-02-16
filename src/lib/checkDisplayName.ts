import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a display name is already taken (case-insensitive).
 * Uses an edge function with service role to bypass RLS.
 */
export async function isDisplayNameTaken(
  name: string,
  excludeUserId?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("check-username", {
      body: { name: name.trim(), excludeUserId },
    });

    if (error) {
      console.error("Username check error:", error);
      return false; // fail open so user isn't blocked
    }

    return !data.available;
  } catch (err) {
    console.error("Username check failed:", err);
    return false;
  }
}
