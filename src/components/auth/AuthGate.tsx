import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, User, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type AuthView = "login" | "signup" | "forgot";

interface AuthGateProps {
  message?: string;
  onSuccess?: () => void;
}

const AuthGate = ({ message = "Sign up to unlock this feature", onSuccess }: AuthGateProps) => {
  const { user, signUp, signIn, resetPassword } = useAuth();
  const [view, setView] = useState<AuthView>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (view === "forgot") {
      const { error } = await resetPassword(email);
      if (error) toast.error(error.message);
      else {
        toast.success("Check your email for a reset link! 📧");
        setView("login");
      }
      setLoading(false);
      return;
    }

    if (view === "signup") {
      if (!displayName.trim()) {
        toast.error("Please choose a display name!");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", newUser.id);
        }
        toast.success("Check your email to confirm your account! 🌿");
        onSuccess?.();
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back! 🔥");
        onSuccess?.();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>

        <div className="glass-heavy rounded-2xl p-6 border border-border/50">
          <h3 className="font-display text-xl font-bold text-center mb-4">
            {view === "forgot" ? "Reset Password" : view === "signup" ? "Create Account" : "Sign In"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            {view === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Choose a display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 glass border-border/50"
                  required
                  maxLength={30}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 glass border-border/50"
                required
              />
            </div>
            {view !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 glass border-border/50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {view === "login" && (
              <div className="text-right">
                <button type="button" onClick={() => setView("forgot")} className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-display font-semibold rounded-xl"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
            >
              {loading ? "Loading..." : view === "forgot" ? "Send Reset Link" : view === "signup" ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {view === "forgot" ? (
              <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">Back to Sign In</button>
            ) : view === "signup" ? (
              <>Already have an account? <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">Sign In</button></>
            ) : (
              <>Don't have an account? <button onClick={() => setView("signup")} className="text-primary hover:underline font-medium">Sign Up</button></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthGate;
