import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const TIERS = {
  light_up: {
    name: "Light Up",
    price_id: "price_1T1LUdA3j4mVkCeQqoWJJ6KD",
    product_id: "prod_TzK81bjcK67PB2",
    price: 4.20,
    originalPrice: 6.99,
    duration: "30 min",
    durationMinutes: 30,
  },
  blaze_mode: {
    name: "Blaze Mode",
    price_id: "price_1T1LUpA3j4mVkCeQ2nnBoHJv",
    product_id: "prod_TzK9UFz4NSlH75",
    price: 8.40,
    originalPrice: 12.99,
    duration: "1 hour",
    durationMinutes: 60,
  },
  elevated: {
    name: "Elevated",
    price_id: "price_1T1LV0A3j4mVkCeQE4NkmJZk",
    product_id: "prod_TzK9aXvzTghUs6",
    price: 16.80,
    originalPrice: 24.99,
    duration: "24 hours",
    durationMinutes: 1440,
  },
} as const;

export type TierKey = keyof typeof TIERS;

interface GuestInfo {
  name: string;
  gender: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscribed: boolean;
  currentTier: TierKey | null;
  subscriptionEnd: string | null;
  displayName: string | null;
  gender: string | null;
  guestInfo: GuestInfo | null;
  isGuest: boolean;
  setGuestInfo: (info: GuestInfo) => void;
  clearGuest: () => void;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  updateDisplayName: (name: string) => Promise<void>;
  updateGender: (gender: string) => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [currentTier, setCurrentTier] = useState<TierKey | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [guestInfo, setGuestInfoState] = useState<GuestInfo | null>(() => {
    const stored = localStorage.getItem("hvc_guest");
    return stored ? JSON.parse(stored) : null;
  });

  const isGuest = !user && !!guestInfo;

  const setGuestInfo = (info: GuestInfo) => {
    localStorage.setItem("hvc_guest", JSON.stringify(info));
    setGuestInfoState(info);
  };

  const clearGuest = () => {
    localStorage.removeItem("hvc_guest");
    setGuestInfoState(null);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, gender")
      .eq("id", userId)
      .maybeSingle();
    setDisplayName(data?.display_name || null);
    setGender(data?.gender || null);
  };

  const checkSubscription = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) return;

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });

      if (error) throw error;

      setSubscribed(data.subscribed);
      setSubscriptionEnd(data.subscription_end);

      if (data.product_id) {
        const tier = Object.entries(TIERS).find(([, t]) => t.product_id === data.product_id);
        setCurrentTier(tier ? (tier[0] as TierKey) : null);
      } else {
        setCurrentTier(null);
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => {
          checkSubscription();
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setSubscribed(false);
        setCurrentTier(null);
        setSubscriptionEnd(null);
        setDisplayName(null);
        setGender(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkSubscription();
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const signUp = async (email: string, password: string, username: string) => {
    // Check if username is already taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("display_name", username)
      .maybeSingle();

    if (existing) {
      return { error: { message: "Username already taken! Try another one." } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) return { error };

    if (data.user) {
      // Update profile with username and gender from guest info
      const genderVal = guestInfo?.gender || "other";
      await supabase
        .from("profiles")
        .update({ display_name: username, gender: genderVal })
        .eq("id", data.user.id);
      setDisplayName(username);
      setGender(genderVal);
      // Clear guest since they're now a real user
      clearGuest();
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) clearGuest();
    return { error: error ? { message: "Invalid email or password" } : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const updateDisplayName = async (name: string) => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ display_name: name })
        .eq("id", user.id);
      setDisplayName(name);
    } else if (guestInfo) {
      setGuestInfo({ ...guestInfo, name });
    }
  };

  const updateGender = async (newGender: string) => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ gender: newGender })
        .eq("id", user.id);
      setGender(newGender);
    } else if (guestInfo) {
      setGuestInfo({ ...guestInfo, gender: newGender });
    }
  };

  const effectiveDisplayName = user ? displayName : guestInfo?.name || null;
  const effectiveGender = user ? gender : guestInfo?.gender || null;

  return (
    <AuthContext.Provider value={{
      user, session, loading, subscribed, currentTier, subscriptionEnd,
      displayName: effectiveDisplayName,
      gender: effectiveGender,
      guestInfo, isGuest, setGuestInfo, clearGuest,
      signUp, signIn, signOut, resetPassword, updatePassword, updateDisplayName, updateGender, checkSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
