import { Button } from "@/components/ui/button";
import { Crown, Rocket, Palette, Clock, Star } from "lucide-react";

const premiumFeatures = [
  {
    icon: Rocket,
    title: "Skip the Queue",
    description: "Jump straight to the front. No waiting, instant matches.",
  },
  {
    icon: Palette,
    title: "Custom Vibes",
    description: "Unlock exclusive themes and personalize your chat experience.",
  },
  {
    icon: Clock,
    title: "Extended History",
    description: "Keep memorable conversations longer with extended session logs.",
  },
  {
    icon: Star,
    title: "Priority Matching",
    description: "Get matched with other premium members first.",
  },
];

const Premium = ({ onGoElevate }: { onGoElevate?: () => void }) => {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[200px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Premium card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent p-[1px] rounded-3xl">
            <div className="absolute inset-[1px] bg-card rounded-3xl" />
          </div>

          <div className="relative p-8 md:p-16">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Premium</span>
              </div>
              
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
                Elevate Your <span className="text-gradient">Experience</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Unlock exclusive features designed for the elevated mind
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={onGoElevate}
                className="px-10 py-6 text-lg font-display font-semibold bg-gradient-to-r from-secondary to-primary hover:opacity-90 transition-opacity rounded-xl"
              >
                <Crown className="w-5 h-5 mr-2" />
                Go Premium
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Starting at $4.20 for 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Premium;
