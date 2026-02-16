import { useState, useEffect } from "react";
import { X, Crown, Rocket, Palette, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const benefits = [
  { icon: Rocket, text: "Skip the queue — instant matches" },
  { icon: Palette, text: "Exclusive themes & custom vibes" },
  { icon: Star, text: "Priority matching with premium users" },
  { icon: Zap, text: "Country & gender filters" },
];

interface PremiumPopupProps {
  onGoElevate: () => void;
}

const PremiumPopup = ({ onGoElevate }: PremiumPopupProps) => {
  const { subscribed } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (subscribed) return;

    const interval = setInterval(() => {
      setVisible(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [subscribed]);

  if (subscribed || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-20 right-4 z-50 w-[300px] rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Gradient accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-display font-bold text-sm">Go Premium ✨</span>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-2.5">
                  <b.icon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{b.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={() => {
                setVisible(false);
                onGoElevate();
              }}
              className="w-full h-9 text-xs font-display font-semibold bg-gradient-to-r from-secondary to-primary hover:opacity-90 rounded-lg"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              Elevate Now — from $4.20
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumPopup;
