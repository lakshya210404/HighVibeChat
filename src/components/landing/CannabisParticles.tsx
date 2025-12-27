import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: "leaf" | "smoke";
  rotation: number;
}

const CannabisParticles = () => {
  const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 20,
    size: 16 + Math.random() * 24,
    type: Math.random() > 0.4 ? "smoke" : "leaf",
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            bottom: "-50px",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.6, 0.4, 0],
            x: [0, Math.sin(particle.id) * 100, Math.cos(particle.id) * 50, 0],
            rotate: [particle.rotation, particle.rotation + 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        >
          {particle.type === "leaf" ? (
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary/40"
            >
              {/* Cannabis leaf SVG */}
              <path
                d="M12 2C12 2 10 6 10 8C10 10 11 12 12 14C13 12 14 10 14 8C14 6 12 2 12 2Z"
                fill="currentColor"
              />
              <path
                d="M12 14C12 14 6 10 4 10C2 10 1 11 1 12C1 13 2 14 4 14C6 14 10 13 12 14Z"
                fill="currentColor"
              />
              <path
                d="M12 14C12 14 18 10 20 10C22 10 23 11 23 12C23 13 22 14 20 14C18 14 14 13 12 14Z"
                fill="currentColor"
              />
              <path
                d="M12 14C12 14 8 8 6 6C4 4 2 4 2 5C2 6 3 8 5 10C7 12 11 14 12 14Z"
                fill="currentColor"
              />
              <path
                d="M12 14C12 14 16 8 18 6C20 4 22 4 22 5C22 6 21 8 19 10C17 12 13 14 12 14Z"
                fill="currentColor"
              />
              <path
                d="M12 14L12 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div
              className="rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-sm"
              style={{
                width: particle.size * 1.5,
                height: particle.size * 1.5,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CannabisParticles;
