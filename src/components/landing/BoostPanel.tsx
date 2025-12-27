import { useState } from 'react';
import { Cannabis, Flame, Sparkles, Crown, Users, Star, Rocket, Timer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ElevateOption {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price: number;
  originalPrice?: number;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  popular?: boolean;
}

const elevateOptions: ElevateOption[] = [
  {
    id: 'light',
    name: 'Light Up',
    tagline: 'Quick hit of priority',
    duration: '15 min',
    price: 2.99,
    icon: <Cannabis className="w-6 h-6" />,
    gradient: 'from-emerald-500/20 to-green-600/10',
    features: ['Priority queue', 'Skip the wait']
  },
  {
    id: 'blaze',
    name: 'Blaze Mode',
    tagline: 'The perfect session',
    duration: '45 min',
    price: 6.99,
    originalPrice: 8.99,
    icon: <Flame className="w-6 h-6" />,
    gradient: 'from-amber-500/20 to-orange-600/10',
    features: ['Top priority', 'Gender filters', 'Better matches'],
    popular: true
  },
  {
    id: 'elevated',
    name: 'Elevated',
    tagline: 'Maximum vibes only',
    duration: '2 hours',
    price: 12.99,
    originalPrice: 15.99,
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-purple-500/20 to-violet-600/10',
    features: ['VIP status', 'All filters', 'Premium matches', 'Priority support']
  }
];

const perks = [
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Skip the Line', desc: 'Jump to the front of the queue instantly' },
  { icon: <Users className="w-5 h-5" />, title: 'Gender Vibes', desc: 'Match only with who you want to meet' },
  { icon: <Star className="w-5 h-5" />, title: 'Quality Sessions', desc: 'Connect with verified, active users' },
  { icon: <Crown className="w-5 h-5" />, title: 'VIP Treatment', desc: 'Stand out and get noticed first' },
];

const BoostPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string>('blaze');
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const handlePurchase = () => {
    const selected = elevateOptions.find(o => o.id === selectedOption);
    toast.success(`${selected?.name} activated! 🔥`, {
      description: 'Get ready to elevate your experience.'
    });
  };

  const selectedPlan = elevateOptions.find(o => o.id === selectedOption);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-start px-4 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header with floating animation */}
        <motion.div 
          className="text-center mb-8"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Cannabis className="w-10 h-10 text-primary" />
              </div>
            </div>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">
            <span className="text-gradient">Elevate</span> Your Sesh
          </h2>
          <p className="text-muted-foreground text-sm">
            Get higher priority and unlock premium features
          </p>
        </motion.div>

        {/* Elevate Options */}
        <div className="space-y-3 mb-6">
          {elevateOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedOption(option.id)}
              onMouseEnter={() => setIsHovering(option.id)}
              onMouseLeave={() => setIsHovering(null)}
              className={`
                w-full relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                ${selectedOption === option.id 
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                  : 'border-border/50 bg-card/50 hover:border-border hover:bg-card/80'}
              `}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-50`} />
              
              {/* Popular badge */}
              {option.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    🔥 HOT
                  </div>
                </div>
              )}

              <div className="relative p-4 flex items-center gap-4">
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300
                  ${selectedOption === option.id ? 'bg-primary/30 text-primary scale-110' : 'bg-muted text-muted-foreground'}
                `}>
                  {option.icon}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg">{option.name}</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                      {option.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.tagline}</p>
                  
                  {/* Expanded features on hover/select */}
                  <AnimatePresence>
                    {(selectedOption === option.id || isHovering === option.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-1 mt-2"
                      >
                        {option.features.map((feature, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            {feature}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className="font-display font-bold text-xl text-foreground">${option.price}</span>
                  {option.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      ${option.originalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              {selectedOption === option.id && (
                <motion.div
                  layoutId="selection"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="p-3 rounded-xl glass border border-border/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-primary">{perk.icon}</div>
                <span className="font-semibold text-sm">{perk.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={handlePurchase}
            className="w-full h-14 rounded-xl text-lg font-display font-bold relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))'
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {selectedPlan?.icon}
              Get {selectedPlan?.name} • ${selectedPlan?.price}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-4 space-y-1"
        >
          <span className="block">One-time payment • No subscriptions • Non-refundable</span>
          <span className="block opacity-70">VPNs or private browsers may affect functionality</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default BoostPanel;