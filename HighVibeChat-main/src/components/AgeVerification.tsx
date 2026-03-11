import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification = ({ onVerified }: AgeVerificationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Delay showing content for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onVerified, 600);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glow-primary blur-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cosmic-purple blur-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-deep-amber blur-3xl"
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={showContent ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center px-6 max-w-lg"
          >
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={showContent ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold">
                <span className="text-glow-primary glow-text">High</span>
                <span className="text-foreground">Vibe</span>
                <span className="text-cosmic-purple">Chat</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12"
            >
              Connect with elevated minds
            </motion.p>

            {/* Age verification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-heavy rounded-2xl p-8 mb-6"
            >
              <p className="text-lg font-medium text-foreground mb-4">
                You must be 18 years or older to enter
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                By entering, you agree to our{" "}
                <button className="text-glow-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-glow-primary hover:underline">
                  Privacy Policy
                </button>
                . This platform is for adults only.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnter}
                  className="px-8 py-4 bg-gradient-to-r from-glow-primary to-cosmic-purple rounded-xl font-semibold text-foreground shadow-glow transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                >
                  I am 18 or older — Enter
                </motion.button>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 0.5 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xs text-muted-foreground"
            >
              Anonymous • Secure • Judgment-free
            </motion.p>
          </motion.div>

          {/* Exit animation overlay */}
          {isExiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-background z-20"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerification;
