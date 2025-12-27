import { motion } from "framer-motion";
import { Smile, Heart, Brain, Sparkles, Flame } from "lucide-react";

export type SessionVibe = "chill" | "funny" | "deep" | "flirty" | null;

interface SessionVibesProps {
  selectedVibe: SessionVibe;
  onVibeChange: (vibe: SessionVibe) => void;
}

const VIBES = [
  { 
    id: "chill" as const, 
    label: "Chill", 
    emoji: "😌", 
    icon: Sparkles,
    description: "Relaxed & easy-going",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400"
  },
  { 
    id: "funny" as const, 
    label: "Funny", 
    emoji: "😂", 
    icon: Smile,
    description: "Jokes & good laughs",
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-400"
  },
  { 
    id: "deep" as const, 
    label: "Deep", 
    emoji: "🧠", 
    icon: Brain,
    description: "Meaningful convos",
    gradient: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400"
  },
  { 
    id: "flirty" as const, 
    label: "Flirty", 
    emoji: "😏", 
    icon: Heart,
    description: "Playful & romantic",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/50",
    textColor: "text-pink-400"
  },
];

const SessionVibes = ({ selectedVibe, onVibeChange }: SessionVibesProps) => {
  const handleVibeClick = (vibeId: SessionVibe) => {
    // Toggle off if already selected
    if (selectedVibe === vibeId) {
      onVibeChange(null);
    } else {
      onVibeChange(vibeId);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Session Vibe</span>
        </div>
        {selectedVibe && (
          <button 
            onClick={() => onVibeChange(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {VIBES.map((vibe) => {
          const isSelected = selectedVibe === vibe.id;
          const Icon = vibe.icon;
          
          return (
            <motion.button
              key={vibe.id}
              onClick={() => handleVibeClick(vibe.id)}
              className={`
                relative flex flex-col items-center gap-1 p-3 rounded-xl
                border transition-all duration-300
                ${isSelected 
                  ? `bg-gradient-to-br ${vibe.gradient} ${vibe.borderColor} ${vibe.textColor}` 
                  : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/30"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{vibe.emoji}</span>
              <span className="text-xs font-medium">{vibe.label}</span>
              
              {isSelected && (
                <motion.div
                  layoutId="vibeIndicator"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {selectedVibe && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center text-muted-foreground"
        >
          {VIBES.find(v => v.id === selectedVibe)?.description}
        </motion.p>
      )}
    </div>
  );
};

export default SessionVibes;
