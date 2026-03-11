import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: "sparkle" | "orb";
  rotation: number;
}

const VibeParticles = () => {
  const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 20,
    size: 16 + Math.random() * 24,
    type: Math.random() > 0.4 ? "orb" : "sparkle",
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{ left: `${particle.x}%`, bottom: "-50px" }}
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
          {particle.type === "sparkle" ? (
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary/40"
            >
              {/* 4-point star / sparkle */}
              <path
                d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <div
              className="rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-sm"
              style={{ width: particle.size * 1.5, height: particle.size * 1.5 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default VibeParticles;
