import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Shield, Volume2, User, Users, Globe, Clock, 
  Lock, Bell, ExternalLink, Mail, Leaf
} from 'lucide-react';
import CountrySelector from './CountrySelector';

export type Gender = 'male' | 'female' | 'other';
export type LookingFor = 'everyone' | 'male' | 'female' | 'other';

interface SettingsPanelProps {
  gender: Gender;
  lookingFor: LookingFor;
  onGenderChange: (gender: Gender) => void;
  onLookingForChange: (lookingFor: LookingFor) => void;
  isPremium?: boolean;
  selectedCountries?: string[];
  onCountriesChange?: (countries: string[]) => void;
}

const SettingsPanel = ({ 
  gender, 
  lookingFor, 
  onGenderChange, 
  onLookingForChange,
  isPremium = false,
  selectedCountries = [],
  onCountriesChange = () => {}
}: SettingsPanelProps) => {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [sfxVolume, setSfxVolume] = useState(true);
  const [autoRollVideo, setAutoRollVideo] = useState(true);
  const [autoRollText, setAutoRollText] = useState(false);
  const [countryFilter, setCountryFilter] = useState(false);
  const [filterMaxWait, setFilterMaxWait] = useState([3]);
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const handleGoogleSignIn = () => {
    toast.info('Sign-in coming soon! 🌿', {
      description: 'Create an account to unlock premium vibes.'
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="w-6 h-6 text-primary" />
          <h2 className="font-display text-3xl font-bold text-center">
            Settings
          </h2>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass mb-6">
            <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
            <TabsTrigger value="matching" className="text-xs sm:text-sm">Matching</TabsTrigger>
            <TabsTrigger value="filters" className="text-xs sm:text-sm">Filters</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Privacy */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Privacy Mode ({privacyMode ? 'ON' : 'OFF'})</p>
                      <p className="text-sm text-muted-foreground">Hide your details from partners</p>
                    </div>
                    <Switch 
                      checked={privacyMode} 
                      onCheckedChange={setPrivacyMode}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>Volume</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SFX Volume ({sfxVolume ? 'ON' : 'OFF'})</p>
                      <p className="text-sm text-muted-foreground">Toggle sound effects on or off</p>
                    </div>
                    <Switch 
                      checked={sfxVolume} 
                      onCheckedChange={setSfxVolume}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Sign In Options */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Sign in with Google</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Matching Tab */}
          <TabsContent value="matching" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Leaf className="w-4 h-4" />
                  <span>Auto-Roll</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Video ({autoRollVideo ? 'ON' : 'OFF'})</p>
                      <p className="text-sm text-muted-foreground">Auto find new match in video mode</p>
                    </div>
                    <Switch 
                      checked={autoRollVideo} 
                      onCheckedChange={setAutoRollVideo}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                  <div className="border-t border-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Text ({autoRollText ? 'ON' : 'OFF'})</p>
                      <p className="text-sm text-muted-foreground">Auto find new match in text mode</p>
                    </div>
                    <Switch 
                      checked={autoRollText} 
                      onCheckedChange={setAutoRollText}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>Country Filter</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 w-full"
                    onClick={() => setShowCountrySelector(true)}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {selectedCountries.length === 0 
                      ? "All Countries (Worldwide)" 
                      : `${selectedCountries.length} Countries Selected`
                    }
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Match with stoners from specific countries only
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Filters Max Wait</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50">
                  <p className="font-medium mb-4">{filterMaxWait[0]}s</p>
                  <Slider
                    value={filterMaxWait}
                    onValueChange={setFilterMaxWait}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Maximum time to wait for someone in your filters
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Your Gender */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <User className="w-4 h-4 text-destructive" />
                  <span>Your Vibe</span>
                </div>
                <div className="p-4 rounded-xl glass border border-border/50">
                  <RadioGroup value={gender} onValueChange={(v) => {
                    onGenderChange(v as Gender);
                  }} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Looking For */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>Looking For</span>
                  {!isPremium && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Premium</span>
                  )}
                </div>
                <div className="p-4 rounded-xl glass border border-border/50 relative">
                  {!isPremium && (
                    <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Boost to unlock gender filters</p>
                      </div>
                    </div>
                  )}
                  <RadioGroup value={lookingFor} onValueChange={(v) => onLookingForChange(v as LookingFor)} className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="everyone" id="everyone" className="border-accent data-[state=checked]:bg-accent" />
                      <Label htmlFor="everyone">Everyone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="lookingMale" className="border-accent data-[state=checked]:bg-accent" />
                      <Label htmlFor="lookingMale">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="lookingFemale" className="border-accent data-[state=checked]:bg-accent" />
                      <Label htmlFor="lookingFemale">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="lookingOther" className="border-accent data-[state=checked]:bg-accent" />
                      <Label htmlFor="lookingOther">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          HighVibeChat v1.0 • Made with 🌿
        </motion.p>
      </motion.div>

      <CountrySelector
        selectedCountries={selectedCountries}
        onCountriesChange={onCountriesChange}
        isOpen={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
      />
    </div>
  );
};

export default SettingsPanel;
