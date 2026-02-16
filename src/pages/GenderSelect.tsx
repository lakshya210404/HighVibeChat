import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import SmokeBackground from "@/components/ui/SmokeBackground";
import { toast } from "sonner";

const genderOptions = [
  { value: "male", emoji: "♂️", label: "Male" },
  { value: "female", emoji: "♀️", label: "Female" },
  { value: "other", emoji: "⚧️", label: "Other" },
];

const GenderSelect = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ gender: selected })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save gender");
    } else {
      toast.success("Let's go! 🔥");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <>
      <SmokeBackground />
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
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
            What's your <span className="text-gradient">vibe</span>?
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            This helps us match you with the right people
          </p>

          <div className="flex gap-3 justify-center mb-8">
            {genderOptions.map((opt) => (
              <motion.button
                key={opt.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(opt.value)}
                className={`
                  flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all w-28
                  ${selected === opt.value
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
            onClick={handleContinue}
            disabled={!selected || loading}
            className="w-full h-12 font-display font-semibold text-lg rounded-xl"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default GenderSelect;
