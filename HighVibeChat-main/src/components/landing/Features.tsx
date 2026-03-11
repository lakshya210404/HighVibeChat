import { Shield, Zap, Eye, MessageCircle, Leaf, Crown } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Total Anonymity",
    description: "No sign-ups, no profiles, no traces. Just pure, unfiltered connection.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Instant Match",
    description: "Find your vibe in seconds. One click and you're connected.",
    color: "accent",
  },
  {
    icon: Eye,
    title: "Private & Secure",
    description: "Your conversations stay between you two. Always encrypted.",
    color: "secondary",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Smooth, instant messaging with no lag. Flow naturally.",
    color: "primary",
  },
  {
    icon: Leaf,
    title: "Chill Vibes Only",
    description: "Designed for relaxation. Calming aesthetics, peaceful interactions.",
    color: "accent",
  },
  {
    icon: Crown,
    title: "Premium Features",
    description: "Skip queues, custom themes, priority matching, and more.",
    color: "secondary",
  },
];

const Features = () => {
  return (
    <section className="relative py-32 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Why <span className="text-gradient">HighVibeChat</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Built for those who appreciate the finer things in connection
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl glass hover:bg-card/80 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center mb-6
                ${feature.color === 'primary' ? 'bg-primary/20 text-primary' : ''}
                ${feature.color === 'accent' ? 'bg-accent/20 text-accent' : ''}
                ${feature.color === 'secondary' ? 'bg-secondary/20 text-secondary' : ''}
                group-hover:scale-110 transition-transform duration-300
              `}>
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                ${feature.color === 'primary' ? 'bg-primary/5' : ''}
                ${feature.color === 'accent' ? 'bg-accent/5' : ''}
                ${feature.color === 'secondary' ? 'bg-secondary/5' : ''}
              `} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
