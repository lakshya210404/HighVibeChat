import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, Heart, Flame, Zap } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'ChillVibes420',
    rating: 5,
    text: "This app understands the assignment. Late night sessions with people from around the world who actually get it. The cosmic theme hits different when you're in the right headspace 🌌",
    emoji: '🧔',
    vibe: 'Cosmic Explorer',
    badge: <Zap className="w-3 h-3" />
  },
  {
    id: 2,
    name: 'MoonlitMary',
    rating: 5,
    text: "Finally somewhere I can be myself. No judgment, just real conversations with chill people. The visual themes are absolutely mesmerizing ✨",
    emoji: '👩‍🦰',
    vibe: 'Night Owl',
    badge: <Sparkles className="w-3 h-3" />
  },
  {
    id: 3,
    name: 'GreenDreamer',
    rating: 5,
    text: "The interest matching is genius! Found someone into the same music and we talked for hours about life and the universe. Premium gender filter is worth every penny 💚",
    emoji: '🧑‍🦱',
    vibe: 'Deep Thinker',
    badge: <Heart className="w-3 h-3" />
  },
  {
    id: 4,
    name: 'CosmicTraveler',
    rating: 5,
    text: "Way better than those sketchy chat sites. Video quality is smooth and the whole vibe is just... elevated. Love the aurora theme at 2am 🌠",
    emoji: '👨',
    vibe: 'Stargazer',
    badge: <Zap className="w-3 h-3" />
  },
  {
    id: 5,
    name: 'PeacefulSoul',
    rating: 5,
    text: "Made genuine connections from 5 different countries in one night. This is what the internet was supposed to be. Pure, unfiltered good energy 🌍",
    emoji: '👧',
    vibe: 'Global Connector',
    badge: <Flame className="w-3 h-3" />
  },
  {
    id: 6,
    name: 'HighMindedOne',
    rating: 5,
    text: "The Elevate feature is a game changer. No more waiting around, just instant quality matches. Been here since launch and it keeps getting better 🚀",
    emoji: '🧑',
    vibe: 'OG Member',
    badge: <Sparkles className="w-3 h-3" />
  }
];

const stats = [
  { value: '50K+', label: 'Elevated Souls', icon: <Sparkles className="w-5 h-5" /> },
  { value: '1M+', label: 'Good Vibes Shared', icon: <Heart className="w-5 h-5" /> },
  { value: '4.9', label: 'Vibe Rating', icon: <Star className="w-5 h-5" /> },
  { value: '24/7', label: 'Active Sessions', icon: <Flame className="w-5 h-5" /> }
];

const Reviews = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Real Talk from Real People</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-gradient">Community</span> Speaks
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join thousands of elevated minds already vibing on HighVibeChat
          </p>
        </motion.div>

        {/* Reviews Grid - Masonry style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`
                relative p-5 rounded-2xl border border-border/30 
                bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm
                hover:border-primary/40 transition-all duration-300 group
                ${index === 1 ? 'md:translate-y-8' : ''}
                ${index === 4 ? 'lg:translate-y-4' : ''}
              `}
            >
              {/* Floating quote */}
              <div className="absolute -top-3 -left-2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Review Text */}
              <p className="text-foreground/90 leading-relaxed mb-4 mt-4">
                "{review.text}"
              </p>

              {/* Rating as smoke puffs */}
              <div className="flex gap-1.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Star className="w-4 h-4 fill-accent text-accent" />
                  </motion.div>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xl border-2 border-primary/20">
                    {review.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      {review.badge}
                      <span>{review.vibe}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-6 rounded-2xl glass border border-border/30 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-primary/20">
            <div className="flex -space-x-2">
              {['🧔', '👩', '🧑', '👨', '👧'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">247 people</strong> are vibing right now
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;