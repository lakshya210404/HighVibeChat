import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const TIERS = {
  light_up: {
    name: "Light Up",
    price_id: "price_1T0r4bA3j4mVkCeQeNwdJjMy",
    product_id: "prod_Tyoi7XF2WXm404",
    price: 4.20,
  },
  blaze_mode: {
    name: "Blaze Mode",
    price_id: "price_1T0r63A3j4mVkCeQqL3SNGqC",
    product_id: "prod_TyojcldsnKwUsH",
    price: 8.40,
  },
  elevated: {
    name: "Elevated",
    price_id: "price_1T0r6JA3j4mVkCeQdgf9GU9E",
    product_id: "prod_TyojKmJjtG5eYB",
    price: 16.80,
  },
} as const;

export type TierKey = keyof typeof TIERS;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscribed: boolean;
  currentTier: TierKey | null;
  subscriptionEnd: string | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
        setTimeout(checkSubscription, 0);
      } else {
        setSubscribed(false);
        setCurrentTier(null);
        setSubscriptionEnd(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, subscribed, currentTier, subscriptionEnd,
      signUp, signIn, signOut, checkSubscription,
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
