import { User, Bell, Shield, Info, ExternalLink, Mail } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

const SettingsPanel = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleGoogleSignIn = () => {
    toast.info('Google Sign-In coming soon! 🔐', {
      description: 'Stay anonymous or create an account.'
    });
  };

  const handleEmailSignIn = () => {
    toast.info('Email Sign-In coming soon! 📧', {
      description: 'Create an account to save preferences.'
    });
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Sign in with Google',
          action: handleGoogleSignIn,
          type: 'button' as const
        },
        {
          icon: Mail,
          label: 'Sign in with Email',
          action: handleEmailSignIn,
          type: 'button' as const
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          value: notifications,
          onChange: setNotifications,
          type: 'switch' as const
        },
        {
          icon: Shield,
          label: 'Sound Effects',
          value: soundEffects,
          onChange: setSoundEffects,
          type: 'switch' as const
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          label: 'Terms of Service',
          href: '#',
          type: 'link' as const
        },
        {
          icon: Shield,
          label: 'Privacy Policy',
          href: '#',
          type: 'link' as const
        }
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-8">
          Settings
        </h2>

        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.type === 'switch') {
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 rounded-xl glass border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                    );
                  }

                  if (item.type === 'button') {
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          HighVibeChat v1.0 • Made with 💚
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;
