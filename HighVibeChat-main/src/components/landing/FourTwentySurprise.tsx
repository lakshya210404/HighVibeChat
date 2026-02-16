import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "sparkle" | "smoke" | "leaf" | "confetti";
  color: string;
  rotation: number;
}

const CONFETTI_COLORS = [
  "hsl(142, 71%, 45%)", // green
  "hsl(35, 92%, 60%)",  // gold/amber
  "hsl(280, 60%, 50%)", // purple
  "hsl(142, 50%, 60%)", // light green
  "hsl(45, 100%, 60%)", // yellow
];

const FourTwentySurprise = () => {
  const [is420, setIs420] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const check420 = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // Trigger at 4:20 PM (16:20) for the entire minute
      const isTime = hours === 16 && minutes === 20;
      setIs420(isTime);
      if (isTime && !showMessage) {
        setShowMessage(true);
        // Hide message after 10 seconds
        setTimeout(() => setShowMessage(false), 10000);
      }
    };

    check420();
    const interval = setInterval(check420, 1000);
    return () => clearInterval(interval);
  }, [showMessage]);

  const particles: Particle[] = useMemo(() => {
    if (!is420) return [];
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 20,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      type: ["sparkle", "smoke", "leaf", "confetti"][Math.floor(Math.random() * 4)] as Particle["type"],
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
    }));
  }, [is420]);

  if (!is420) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Screen glow overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
        style={{
          background: "radial-gradient(ellipse at center, hsla(142, 71%, 45%, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Pulsing border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: [
            "inset 0 0 100px 20px hsla(142, 71%, 45%, 0.1)",
            "inset 0 0 150px 40px hsla(142, 71%, 45%, 0.2)",
            "inset 0 0 100px 20px hsla(142, 71%, 45%, 0.1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            y: [0, -100, -200],
            x: [0, Math.sin(particle.id) * 50],
            rotate: [particle.rotation, particle.rotation + 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {particle.type === "sparkle" && (
            <Sparkles
              className="text-accent"
              style={{ width: particle.size, height: particle.size }}
            />
          )}
          {particle.type === "leaf" && (
            <Leaf
              className="text-primary"
              style={{ width: particle.size, height: particle.size }}
            />
          )}
          {particle.type === "smoke" && (
            <div
              className="rounded-full blur-sm"
              style={{
                width: particle.size * 2,
                height: particle.size * 2,
                background: `radial-gradient(circle, ${particle.color}40 0%, transparent 70%)`,
              }}
            />
          )}
          {particle.type === "confetti" && (
            <div
              className="rounded-sm"
              style={{
                width: particle.size / 2,
                height: particle.size,
                backgroundColor: particle.color,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* 4:20 Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="relative">
              {/* Glow behind text */}
              <div className="absolute inset-0 blur-3xl bg-primary/50 rounded-full scale-150" />
              
              <div className="relative glass rounded-3xl px-8 py-6 border border-primary/30 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="text-6xl mb-2"
                >
                  🌿
                </motion.div>
                <h2 className="font-display text-4xl font-bold text-primary mb-2">
                  It's 4:20!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Time to elevate your vibes ✨
                </p>
                <div className="flex justify-center gap-2 mt-4 text-2xl">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0 }}
                  >
                    💨
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    🔥
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    ✌️
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    🌿
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extra corner sparkles */}
      {[0, 1, 2, 3].map((corner) => (
        <motion.div
          key={corner}
          className="absolute"
          style={{
            top: corner < 2 ? "5%" : "auto",
            bottom: corner >= 2 ? "5%" : "auto",
            left: corner % 2 === 0 ? "5%" : "auto",
            right: corner % 2 === 1 ? "5%" : "auto",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            delay: corner * 0.3,
            repeat: Infinity,
          }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
      ))}
    </div>
  );
};

export default FourTwentySurprise;
