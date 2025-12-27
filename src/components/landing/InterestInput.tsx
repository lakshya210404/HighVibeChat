import { useState, KeyboardEvent } from 'react';
import { X, Plus, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface InterestInputProps {
  interests: string[];
  onInterestsChange: (interests: string[]) => void;
  maxInterests?: number;
}

const SUGGESTED_INTERESTS = [
  '🎮 Gaming', '🎵 Music', '🎬 Movies', '📚 Books', '🏋️ Fitness',
  '🎨 Art', '💻 Tech', '🌿 Nature', '🍕 Food', '✈️ Travel',
  '🐱 Pets', '⚽ Sports', '🎭 Comedy', '🔬 Science', '🎲 420'
];

const InterestInput = ({ interests, onInterestsChange, maxInterests = 5 }: InterestInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showAll, setShowAll] = useState(false);

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed) && interests.length < maxInterests) {
      onInterestsChange([...interests, trimmed]);
      setInputValue('');
    }
  };

  const removeInterest = (interest: string) => {
    onInterestsChange(interests.filter(i => i !== interest));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest(inputValue);
    }
  };

  const availableSuggestions = SUGGESTED_INTERESTS.filter(i => !interests.includes(i));
  const displayedSuggestions = showAll ? availableSuggestions : availableSuggestions.slice(0, 6);

  return (
    <div className="w-full space-y-4">
      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="glass px-3 py-1.5 gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span>ALL</span>
        </Badge>
      </div>

      {/* Input Field */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add your interests (optional)"
          className="glass h-14 pl-4 pr-12 text-base border-border/50 focus:border-primary/50"
          maxLength={30}
        />
        <button
          onClick={() => addInterest(inputValue)}
          disabled={!inputValue.trim() || interests.length >= maxInterests}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Interests */}
      <AnimatePresence mode="popLayout">
        {interests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {interests.map((interest) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 cursor-pointer group"
                  onClick={() => removeInterest(interest)}
                >
                  {interest}
                  <X className="w-3 h-3 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Interests */}
      {interests.length < maxInterests && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {displayedSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => addInterest(suggestion)}
                className="px-3 py-1.5 text-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
            {availableSuggestions.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-3 py-1.5 text-sm text-primary hover:underline"
              >
                {showAll ? 'Show less' : `+${availableSuggestions.length - 6} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Limit indicator */}
      <p className="text-xs text-muted-foreground text-right">
        {interests.length}/{maxInterests} interests
      </p>
    </div>
  );
};

export default InterestInput;
