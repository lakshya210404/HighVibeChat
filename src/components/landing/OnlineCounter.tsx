import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnlineCounterProps {
  baseCount: number;
}

const OnlineCounter = ({ baseCount }: OnlineCounterProps) => {
  const [displayCount, setDisplayCount] = useState(baseCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start with a random count in the 3000-20000 range
    setDisplayCount(Math.floor(Math.random() * 17000) + 3000);
  }, []);

  useEffect(() => {
    // Simulate realistic fluctuation with small steps
    const interval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 300) - 120; // -120 to +180
      setDisplayCount(prev => {
        const newCount = prev + fluctuation;
        return Math.max(3000, Math.min(20000, newCount));
      });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

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
