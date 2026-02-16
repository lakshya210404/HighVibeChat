import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmokeBackground from "@/components/ui/SmokeBackground";

type AuthView = "login" | "signup";

const Auth = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AuthView>("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

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
        navigate("/gender");
      }
    } else {
      const { error } = await signIn(username.trim(), password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back! 🔥");
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <SmokeBackground />
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute w-72 h-72 rounded-full border border-primary/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute w-48 h-48 rounded-full border border-accent/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.8, 1.4], opacity: [0, 0.4, 0] }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-primary/10 blur-[80px]"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            <motion.img
              src="/logo.svg"
              alt="HVC"
              className="w-36 h-auto mb-6 relative z-10"
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />

            <motion.h1
              className="font-display text-5xl font-bold relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="text-gradient glow-text">HighVibe</span>
              <span className="text-foreground">Chat</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground/80 italic text-lg mt-3 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Vibe With Elevated Minds™
            </motion.p>

            <motion.div
              className="flex gap-2 mt-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <motion.img
                  src="/logo.svg"
                  alt="HighVibeChat"
                  className="w-20 h-auto mx-auto mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <h1 className="font-display text-3xl font-bold">
                  <span className="text-gradient">HighVibe</span>Chat
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  {view === "signup"
                    ? "Pick a username and create your account"
                    : "Sign in with your username"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    autoFocus
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
                  disabled={loading || !username.trim() || !password}
                  className="w-full h-12 font-display font-semibold text-lg rounded-xl"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
                >
                  {loading
                    ? "Loading..."
                    : view === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {view === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setView("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setView("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>

              <p className="text-center text-xs text-muted-foreground/60 mt-4">
                Anonymous • No email needed • Just vibes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Auth;
