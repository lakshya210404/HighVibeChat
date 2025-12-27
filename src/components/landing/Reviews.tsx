import { motion } from 'framer-motion';
import { Star, Quote, Leaf, Sparkles } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'ChillVibes420',
    rating: 5,
    text: "Best app for finding people to vibe with late at night. Met some amazing people from around the world. 10/10 would recommend! 🌿",
    avatar: '🧔',
    verified: true
  },
  {
    id: 2,
    name: 'CosmicDreamer',
    rating: 5,
    text: "Finally an app that gets it. No judgment, just good conversations with chill people. The themes are so trippy I love it ✨",
    avatar: '👩',
    verified: true
  },
  {
    id: 3,
    name: 'GreenThumb23',
    rating: 5,
    text: "The interest matching is fire! Got connected with someone into the same music and we talked for hours. Premium is worth it for the gender filter 💚",
    avatar: '🧑',
    verified: true
  },
  {
    id: 4,
    name: 'MidnightToker',
    rating: 5,
    text: "Way better than the other chat apps out there. Actually feels safe and the video quality is smooth. Love the cosmic theme!",
    avatar: '👨',
    verified: true
  },
  {
    id: 5,
    name: 'PeacefulSoul',
    rating: 5,
    text: "Made friends from 5 different countries in one night. This is what the internet was made for. Pure good vibes only 🌍💨",
    avatar: '👧',
    verified: true
  },
  {
    id: 6,
    name: 'HighMindedOne',
    rating: 5,
    text: "The Skip Queue feature is a game changer. No more waiting around, just instant connections with like-minded people 🚀",
    avatar: '🧑‍🦱',
    verified: true
  }
];

const Reviews = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Community Love</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Vibers</span> Say
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join thousands of elevated minds already connecting on HighVibeChat
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl glass border border-border/50 hover:border-primary/30 transition-all group"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />

              {/* Review Text */}
              <p className="text-foreground/90 mb-4 leading-relaxed">
                {review.text}
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="w-3 h-3" />
                        <span>Verified Vibe</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '50K+', label: 'Happy Vibers' },
            { value: '1M+', label: 'Connections Made' },
            { value: '4.9', label: 'Average Rating' },
            { value: '24/7', label: 'Active Community' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-xl glass">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
