import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnlineCounterProps {
  baseCount: number;
}

const OnlineCounter = ({ baseCount }: OnlineCounterProps) => {
  const [displayCount, setDisplayCount] = useState(baseCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate realistic fluctuation
    const interval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 50) - 20; // -20 to +30
      setDisplayCount(prev => {
        const newCount = prev + fluctuation;
        return Math.max(baseCount - 100, Math.min(baseCount + 500, newCount));
      });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [baseCount]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: isAnimating ? -10 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="font-display font-bold text-foreground"
        >
          {formatNumber(displayCount)}+
        </motion.span>
      </AnimatePresence>
      <span className="text-muted-foreground text-sm">online</span>
    </div>
  );
};

export default OnlineCounter;
