import { Video, MessageSquare, Sparkles, Cannabis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export type ChatMode = 'video-text' | 'text-only';

interface ModeSelectorProps {
  onSelectMode: (mode: ChatMode) => void;
  onBack: () => void;
}

const ModeSelector = ({ onSelectMode, onBack }: ModeSelectorProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] smoke-drift" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] smoke-drift" style={{ animationDelay: "-5s" }} />

      <div className="relative z-10 text-center max-w-xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Cannabis className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Pick your sesh style</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            How do you wanna <span className="text-gradient">vibe</span>?
          </h2>
          <p className="text-muted-foreground">
            Choose your connection style and let's roll
          </p>
        </motion.div>

        {/* Two mode options - simple and clear */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Video + Text Mode */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onSelectMode('video-text')}
            className="group relative p-8 rounded-2xl glass hover:bg-card/80 transition-all duration-300 text-left hover:scale-105 border-2 border-transparent hover:border-primary/50"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              {/* Icon combo */}
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center gap-1 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-7 h-7 text-primary" />
                <span className="text-primary font-bold text-xl">+</span>
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>

              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                Video Sesh
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Full face-to-face experience with live chat
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Camera</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Voice</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Text</span>
              </div>
            </div>
          </motion.button>

          {/* Text Only Mode */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelectMode('text-only')}
            className="group relative p-8 rounded-2xl glass hover:bg-card/80 transition-all duration-300 text-left hover:scale-105 border-2 border-transparent hover:border-secondary/50"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-secondary" />
              </div>

              <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                Text Sesh
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Classic anonymous vibes, no camera needed
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">Anonymous</span>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">Text Only</span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ModeSelector;