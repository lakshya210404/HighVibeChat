import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import InterestInput from "./InterestInput";
import OnlineCounter from "./OnlineCounter";
import FourTwentyCountdown from "./FourTwentyCountdown";
import SessionVibes, { SessionVibe } from "./SessionVibes";

interface HeroProps {
  onStartChat: () => void;
  interests: string[];
  onInterestsChange: (interests: string[]) => void;
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  selectedVibe: SessionVibe;
  onVibeChange: (vibe: SessionVibe) => void;
}

const Hero = ({
  onStartChat,
  interests,
  onInterestsChange,
  selectedCountries,
  onCountriesChange,
  selectedVibe,
  onVibeChange,
}: HeroProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { onlineCount } = useMatchmaking();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Cosmic glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] smoke-drift" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] smoke-drift" style={{ animationDelay: "-5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-breathe" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg mx-auto w-full">
        {/* Logo & Tagline */}
        <h1 
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-2 slide-up"
        >
          <span className="text-gradient glow-text">HighVibe</span>
          <span className="text-foreground">Chat</span>
        </h1>
        <p 
          className="text-muted-foreground italic mb-8 slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Vibe With Elevated Minds™
        </p>

        {/* Online counter & 4:20 countdown */}
        <div 
          className="flex items-center justify-between mb-6 slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div /> {/* Spacer */}
          <div className="flex flex-col items-end gap-3">
            <OnlineCounter baseCount={onlineCount} />
            <FourTwentyCountdown />
          </div>
        </div>

        {/* Interest Input */}
        <div 
          className="mb-4 slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <InterestInput 
            interests={interests} 
            onInterestsChange={onInterestsChange}
            selectedCountries={selectedCountries}
            onCountriesChange={onCountriesChange}
          />
        </div>

        {/* Session Vibes */}
        <div 
          className="mb-6 slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          <SessionVibes 
            selectedVibe={selectedVibe}
            onVibeChange={onVibeChange}
          />
        </div>

        {/* CTA Button */}
        <div 
          className="slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            onClick={onStartChat}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`
              relative group w-full px-10 py-8 text-xl font-display font-semibold
              bg-accent hover:bg-accent/90 text-accent-foreground
              rounded-2xl transition-all duration-500
              ${isHovering ? 'scale-[1.02] glow-primary' : 'scale-100'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles className={`w-6 h-6 transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`} />
              Start
              <Zap className={`w-5 h-5 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
            </span>
            
            {/* Button glow effect */}
            <div className={`
              absolute inset-0 rounded-2xl bg-gradient-to-r from-accent via-primary to-secondary
              opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500
            `} />
          </Button>
        </div>

        {/* Subtext */}
        <p 
          className="mt-6 text-sm text-muted-foreground slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          Anonymous • Instant • Worldwide
        </p>
      </div>
    </section>
  );
};

export default Hero;