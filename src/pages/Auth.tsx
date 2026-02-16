import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmokeBackground from "@/components/ui/SmokeBackground";

type EntryStep = "splash" | "username" | "gender";

const genderOptions = [
  { value: "male", emoji: "♂️", label: "Male" },
  { value: "female", emoji: "♀️", label: "Female" },
  { value: "other", emoji: "⚧️", label: "Other" },
];

const Auth = () => {
  const [step, setStep] = useState<EntryStep>("splash");
  const [username, setUsername] = useState("");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const { user, guestInfo, setGuestInfo } = useAuth();
  const navigate = useNavigate();

  // If already logged in or guest, go home
  useEffect(() => {
    if (user || guestInfo) {
      navigate("/");
    }
  }, [user, guestInfo, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setStep("username"), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleUsernameNext = () => {
    if (!username.trim() || username.trim().length < 2) {
      toast.error("Pick a name with at least 2 characters");
      return;
    }
    setStep("gender");
  };

  const handleEnter = () => {
    if (!selectedGender) {
      toast.error("Pick your vibe first!");
      return;
    }
    setGuestInfo({ name: username.trim(), gender: selectedGender });
    toast.success("Welcome to HighVibeChat! 🌿");
    navigate("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUsernameNext();
  };

  return (
    <>
      <SmokeBackground />
      <AnimatePresence mode="wait">
        {step === "splash" && (
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
        )}

        {step === "username" && (
          <motion.div
            key="username"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-sm text-center">
              <motion.img
                src="/logo.svg"
                alt="HighVibeChat"
                className="w-20 h-auto mx-auto mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
              <h1 className="font-display text-3xl font-bold mb-2">
                <span className="text-gradient">HighVibe</span>Chat
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                Choose a display name to get started
              </p>

              <div className="relative mb-4">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 glass border-border/50 h-12 text-lg"
                  maxLength={30}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleUsernameNext}
                disabled={!username.trim()}
                className="w-full h-12 font-display font-semibold text-lg rounded-xl"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              >
                Next
              </Button>

              <p className="text-center text-xs text-muted-foreground/60 mt-6">
                No account needed • Just vibes ✌️
              </p>
            </div>
          </motion.div>
        )}

        {step === "gender" && (
          <motion.div
            key="gender"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-sm text-center">
              <motion.img
                src="/logo.svg"
                alt="HighVibeChat"
                className="w-16 h-auto mx-auto mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
              <h1 className="font-display text-2xl font-bold mb-2">
                What's your <span className="text-gradient">vibe</span>, {username.trim()}?
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                This helps us match you better
              </p>

              <div className="flex gap-3 justify-center mb-8">
                {genderOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGender(opt.value)}
                    className={`
                      flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all w-28
                      ${selectedGender === opt.value
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border/50 bg-card/50 hover:border-border hover:bg-card/80"
                      }
                    `}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="font-semibold text-sm">{opt.label}</span>
                  </motion.button>
                ))}
              </div>

              <Button
                onClick={handleEnter}
                disabled={!selectedGender}
                className="w-full h-12 font-display font-semibold text-lg rounded-xl"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              >
                Enter HighVibeChat
              </Button>

              <button
                onClick={() => setStep("username")}
                className="text-muted-foreground text-sm mt-4 hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Auth;
