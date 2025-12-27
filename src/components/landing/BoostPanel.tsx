import { Zap, Crown, Sparkles, Clock, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const BoostPanel = () => {
  const features = [
    {
      icon: Clock,
      title: 'Skip Queue',
      description: 'Get matched instantly, no waiting'
    },
    {
      icon: Users,
      title: 'Priority Matching',
      description: 'Connect with premium users first'
    },
    {
      icon: Sparkles,
      title: 'Exclusive Themes',
      description: 'Unlock premium theme variations'
    },
    {
      icon: Shield,
      title: 'Ad-Free Experience',
      description: 'Chat without interruptions'
    }
  ];

  const handleSubscribe = () => {
    toast.info('Premium subscriptions coming soon! 🚀', {
      description: 'Join our waitlist to get early access.'
    });
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">
            <span className="text-accent">Boost</span> Your Vibes
          </h2>
          <p className="text-muted-foreground">
            Unlock premium features for the ultimate experience
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl glass border-2 border-accent/50 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              <span className="font-display font-bold">Premium</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">$4.99</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
          </div>
          <Button 
            onClick={handleSubscribe}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-12 rounded-xl"
          >
            <Zap className="w-5 h-5 mr-2" />
            Upgrade Now
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground">
          Cancel anytime • Secure payment • Instant activation
        </p>
      </motion.div>
    </div>
  );
};

export default BoostPanel;
