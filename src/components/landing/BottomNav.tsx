import { Home, Palette, Settings, Flame, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: 'home' | 'elevate' | 'theme' | 'settings';
  onTabChange: (tab: 'home' | 'elevate' | 'theme' | 'settings') => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Leaf },
    { id: 'elevate' as const, label: 'Elevate', icon: Flame },
    { id: 'theme' as const, label: 'Vibes', icon: Palette },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isElevate = tab.id === 'elevate';
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? isElevate 
                    ? 'text-accent' 
                    : 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isElevate && isActive ? 'animate-pulse' : ''}`} />
                {isElevate && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isElevate ? 'bg-accent' : 'bg-primary'}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
