import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type AuthView = "login" | "signup" | "forgot";

interface AuthGateProps {
  message?: string;
  onSuccess?: () => void;
}

const AuthGate = ({ message = "Sign up to unlock this feature", onSuccess }: AuthGateProps) => {
  const { user, signUp, signIn, resetPassword, displayName } = useAuth();
  const [view, setView] = useState<AuthView>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(displayName || "");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (view === "forgot") {
      if (!email.trim()) {
        toast.error("Enter your email");
        setLoading(false);
        return;
      }
      const { error } = await resetPassword(email.trim());
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox 📧");
        setView("login");
      }
      setLoading(false);
      return;
    }

    if (!email.trim() || !password) {
      toast.error("Fill in all fields");
      setLoading(false);
      return;
    }

    if (view === "signup") {
      if (!username.trim() || username.trim().length < 2) {
        toast.error("Username must be at least 2 characters");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email.trim(), password, username.trim());
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! 🌿");
        onSuccess?.();
      }
    } else {
      const { error } = await signIn(email.trim(), password);
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
            {view === "signup" ? "Create Account" : view === "login" ? "Sign In" : "Reset Password"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            {view === "signup" && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass border-border/50"
                maxLength={30}
              />
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-display font-semibold rounded-xl"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
            >
              {loading ? "Loading..." : view === "signup" ? "Sign Up" : view === "login" ? "Sign In" : "Send Reset Email"}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-4 space-y-1">
            {view === "signup" && (
              <p>
                Already have an account?{" "}
                <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">Sign In</button>
              </p>
            )}
            {view === "login" && (
              <>
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setView("signup")} className="text-primary hover:underline font-medium">Sign Up</button>
                </p>
                <p>
                  <button onClick={() => setView("forgot")} className="text-muted-foreground hover:text-primary hover:underline">
                    Forgot password?
                  </button>
                </p>
              </>
            )}
            {view === "forgot" && (
              <p>
                <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">Back to Sign In</button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthGate;
