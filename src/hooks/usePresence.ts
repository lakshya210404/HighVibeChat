import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePresence = () => {
  const { user } = useAuth();

  const updatePresence = useCallback(async (isOnline: boolean) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("user_presence")
      .upsert({ user_id: user.id, is_online: isOnline, last_seen: new Date().toISOString() }, 
        { onConflict: "user_id" });
    
    if (error) console.error("Presence update error:", error);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    updatePresence(true);

    // Heartbeat every 30s
    const heartbeat = setInterval(() => updatePresence(true), 30000);

    // Go offline on tab close
    const handleBeforeUnload = () => {
      navigator.sendBeacon && updatePresence(false);
    };

    const handleVisibilityChange = () => {
      updatePresence(!document.hidden);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updatePresence(false);
    };
  }, [user, updatePresence]);
};
