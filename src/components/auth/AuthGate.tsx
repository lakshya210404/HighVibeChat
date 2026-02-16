import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type AuthView = "login" | "signup";

interface AuthGateProps {
  message?: string;
  onSuccess?: () => void;
}

const AuthGate = ({ message = "Sign up to unlock this feature", onSuccess }: AuthGateProps) => {
  const { user, signUp, signIn } = useAuth();
  const [view, setView] = useState<AuthView>("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);

    if (view === "signup") {
      if (username.trim().length < 3) {
        toast.error("Username must be at least 3 characters");
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        toast.error("Username can only contain letters, numbers, and underscores");
        setLoading(false);
        return;
      }
      const { error } = await signUp(username.trim(), password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome to HighVibeChat! 🌿");
        onSuccess?.();
      }
    } else {
      const { error } = await signIn(username.trim(), password);
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
            {view === "signup" ? "Create Account" : "Sign In"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 glass border-border/50"
                required
                maxLength={30}
              />
            </div>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-display font-semibold rounded-xl"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
            >
              {loading ? "Loading..." : view === "signup" ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {view === "signup" ? (
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
