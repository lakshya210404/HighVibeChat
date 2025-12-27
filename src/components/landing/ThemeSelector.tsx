import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Check, Moon, Sun, Sparkles, Waves, Zap } from 'lucide-react';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  icon: React.ElementType;
  colors: string[];
  description: string;
}

const themes: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    colors: ['#0f1419', '#1a1f2e', '#2d3748'],
    description: 'Classic dark mode'
  },
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    colors: ['#ffffff', '#f5f5f5', '#e5e5e5'],
    description: 'Clean and bright'
  },
  {
    id: 'pink',
    name: 'Pink',
    icon: Sparkles,
    colors: ['#1a0a14', '#ff69b4', '#ff1493'],
    description: 'Sweet and vibrant'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: Zap,
    colors: ['#0a0a1a', '#00ff88', '#ff00ff'],
    description: 'Cyberpunk vibes'
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    icon: Sparkles,
    colors: ['#0a0a1f', '#7c3aed', '#22c55e'],
    description: 'Space exploration'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: Waves,
    colors: ['#0a1628', '#0ea5e9', '#06b6d4'],
    description: 'Deep sea calm'
  }
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-2">
          Choose Your <span className="text-gradient">Vibe</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Select a theme that matches your mood
        </p>

        <div className="grid grid-cols-2 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;

            return (
              <motion.button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-300
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 bg-card/50 hover:border-primary/50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Color preview */}
                <div className="flex gap-1 mb-3">
                  {themeOption.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Theme info */}
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-display font-semibold">{themeOption.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{themeOption.description}</p>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;
