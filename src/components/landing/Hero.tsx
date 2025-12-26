import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Users } from "lucide-react";
import { useMatchmaking } from "@/hooks/useMatchmaking";

interface HeroProps {
  onStartChat: () => void;
}

const Hero = ({ onStartChat }: HeroProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { onlineCount } = useMatchmaking();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Cosmic glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] smoke-drift" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] smoke-drift" style={{ animationDelay: "-5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-breathe" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 slide-up">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Anonymous • Video & Text • Worldwide</span>
        </div>

        {/* Main heading */}
        <h1 
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-foreground">Meet</span>
          <br />
          <span className="text-gradient glow-text">Higher Minds</span>
        </h1>

        {/* Subheading */}
        <p 
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Video chat with strangers from around the world. 
          <span className="text-foreground"> No accounts. No judgment. </span>
          Just good vibes.
        </p>

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
              relative group px-10 py-7 text-xl font-display font-semibold
              bg-primary hover:bg-primary/90 text-primary-foreground
              rounded-2xl transition-all duration-500
              ${isHovering ? 'scale-105 glow-primary' : 'scale-100'}
            `}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className={`w-6 h-6 transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`} />
              Start Vibing
              <Zap className={`w-5 h-5 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
            </span>
            
            {/* Button glow effect */}
            <div className={`
              absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent
              opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500
            `} />
          </Button>
        </div>

        {/* Live counter */}
        <div 
          className="mt-12 flex items-center justify-center gap-3 text-muted-foreground slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm">
            <span className="text-foreground font-semibold">{onlineCount.toLocaleString()}+</span> vibers online right now
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
