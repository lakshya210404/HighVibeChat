import { useState } from 'react';
import { Zap, Crown, Sparkles, Clock, Users, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BoostOption {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  color: 'default' | 'accent' | 'secondary';
  popular?: boolean;
}

const boostOptions: BoostOption[] = [
  {
    id: 'small',
    name: 'Small Boost',
    duration: '10 minutes',
    price: 2.99,
    color: 'default'
  },
  {
    id: 'boost',
    name: 'Boost',
    duration: '30 minutes',
    price: 7.99,
    originalPrice: 8.99,
    color: 'accent',
    popular: true
  },
  {
    id: 'super',
    name: 'Super Boost',
    duration: '1 hour',
    price: 16.99,
    originalPrice: 17.99,
    color: 'secondary'
  }
];

const features = [
  'Get priority at the top of the queue.',
  'Match with higher quality users.',
  'A dramatically improved overall experience.',
  'Super Boost gives you top visibility and even higher priority.'
];

const BoostPanel = () => {
  const [selectedBoost, setSelectedBoost] = useState<string>('boost');

  const handlePurchase = () => {
    toast.info('Payment integration coming soon! 🌿💸', {
      description: 'Get ready to elevate your vibe to the next level.'
    });
  };

  const getColorClasses = (color: BoostOption['color'], isSelected: boolean) => {
    if (!isSelected) return 'border-border/50 bg-card/50 hover:border-border';
    switch (color) {
      case 'accent':
        return 'border-accent bg-accent/20 ring-2 ring-accent/50';
      case 'secondary':
        return 'border-secondary bg-secondary/20 ring-2 ring-secondary/50';
      default:
        return 'border-primary bg-primary/20 ring-2 ring-primary/50';
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4 relative">
            <Zap className="w-10 h-10 text-accent" />
            <Leaf className="w-5 h-5 text-primary absolute -top-1 -right-1" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">
            Boost Your <span className="text-accent">Matches</span>
          </h2>
          <p className="text-muted-foreground">
            Elevate your vibe and connect with amazing people
          </p>
        </div>

        {/* Boost Options */}
        <div className="space-y-3 mb-6">
          {boostOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBoost(option.id)}
              className={`
                w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                ${getColorClasses(option.color, selectedBoost === option.id)}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${option.color === 'accent' ? 'bg-accent/30' : 
                    option.color === 'secondary' ? 'bg-secondary/30' : 'bg-muted'}
                `}>
                  <Zap className={`w-5 h-5 ${
                    option.color === 'accent' ? 'text-accent' : 
                    option.color === 'secondary' ? 'text-secondary' : 'text-foreground'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{option.name}</span>
                    <span className="text-muted-foreground">• {option.duration}</span>
                  </div>
                  {option.popular && (
                    <span className="text-xs text-accent">Most Popular 🔥</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg">${option.price}</span>
                {option.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    ${option.originalPrice}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <Zap className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                {feature.includes('priority') || feature.includes('higher quality') || feature.includes('dramatically') || feature.includes('Super Boost') 
                  ? feature.split(/(?<= )/g).map((word, i) => {
                      if (['priority', 'higher', 'quality', 'dramatically', 'Super', 'Boost'].some(w => word.includes(w))) {
                        return <strong key={i}>{word}</strong>;
                      }
                      return word;
                    })
                  : feature
                }
              </p>
            </motion.div>
          ))}
        </div>

        {/* Premium Features Callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl glass border-2 border-primary/30 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Gender Preference Matching</span>
          </div>
          <p className="text-sm text-muted-foreground">
            With any boost, unlock the ability to match only with your preferred gender. 
            Get connected with exactly who you want to vibe with! 🌿
          </p>
        </motion.div>

        {/* CTA Button */}
        <Button 
          onClick={handlePurchase}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14 rounded-xl text-lg"
        >
          <Zap className="w-6 h-6 mr-2" />
          Get {boostOptions.find(b => b.id === selectedBoost)?.name}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          * Boosts are one-time payments, not subscriptions. NON-REFUNDABLE.
          <br />Private browsers or VPNs may disrupt boost functionality.
        </p>
      </motion.div>
    </div>
  );
};

export default BoostPanel;
