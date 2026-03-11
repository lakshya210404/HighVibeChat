import { motion } from "framer-motion";
import { Leaf, Users, Heart, Sparkles } from "lucide-react";

const CommunitySection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">The Vibe is Real</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Full of <span className="text-primary italic">beautiful</span> stoners.
            </h2>
            
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground/80">
              HighVibeChat is where the chillest people connect.
            </h3>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our matching algorithm is designed to give you an amazing experience from the first toke... 
              err, connection. It only gets better with time as we learn your vibes.
            </p>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our goal is to keep things <span className="text-primary font-semibold">real</span> for our community. 
              No bots, just quality people vibing together. We work hard to make sure the best 
              stoners stay, and more find us every day.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <motion.div 
                className="text-center p-4 rounded-xl glass border border-border/30"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-primary">10k+</div>
                <div className="text-xs text-muted-foreground">Active Stoners</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 rounded-xl glass border border-border/30"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-accent">420k</div>
                <div className="text-xs text-muted-foreground">Connections</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 rounded-xl glass border border-border/30"
                whileHover={{ scale: 1.05 }}
              >
                <Leaf className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-secondary">98%</div>
                <div className="text-xs text-muted-foreground">Good Vibes</div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glowing frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary p-[3px]">
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center p-8">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Leaf className="w-24 h-24 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Join the Circle
                    </h3>
                    <p className="text-muted-foreground">
                      Where good vibes meet good people
                    </p>
                    
                    {/* Floating emojis */}
                    <div className="absolute top-4 left-4 text-2xl animate-bounce">🌿</div>
                    <div className="absolute top-8 right-8 text-2xl animate-bounce delay-100">💨</div>
                    <div className="absolute bottom-8 left-8 text-2xl animate-bounce delay-200">✨</div>
                    <div className="absolute bottom-4 right-4 text-2xl animate-bounce delay-300">🔥</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glow effect behind */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
