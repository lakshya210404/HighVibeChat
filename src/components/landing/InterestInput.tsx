import { useState, KeyboardEvent } from "react";
import { X, Plus, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CountrySelector from "./CountrySelector";

interface InterestInputProps {
  interests: string[];
  onInterestsChange: (interests: string[]) => void;
  selectedCountries?: string[];
  onCountriesChange?: (countries: string[]) => void;
  maxInterests?: number;
}

const SUGGESTED_INTERESTS = [
  "🎮 Gaming",
  "🎵 Music",
  "🎬 Movies",
  "📚 Books",
  "🏋️ Fitness",
  "🎨 Art",
  "💻 Tech",
  "🌿 Nature",
  "🍕 Food",
  "✈️ Travel",
  "🐱 Pets",
  "⚽ Sports",
  "🎭 Comedy",
  "🔬 Science",
  "🎲 420",
];

const InterestInput = ({
  interests,
  onInterestsChange,
  selectedCountries = [],
  onCountriesChange = () => {},
  maxInterests = 5,
}: InterestInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed) && interests.length < maxInterests) {
      onInterestsChange([...interests, trimmed]);
      setInputValue("");
    }
  };

  const removeInterest = (interest: string) => {
    onInterestsChange(interests.filter((i) => i !== interest));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest(inputValue);
    }
  };

  const availableSuggestions = SUGGESTED_INTERESTS.filter((i) => !interests.includes(i));
  const displayedSuggestions = showAll ? availableSuggestions : availableSuggestions.slice(0, 6);

  return (
    <div className="w-full space-y-5">
      {/* Country Picker */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="default"
          className="bg-card/80 border-border text-foreground hover:border-primary/50 font-medium"
          onClick={() => setShowCountrySelector(true)}
        >
          <Globe className="w-5 h-5 mr-2 text-primary" />
          {selectedCountries.length === 0 ? "Worldwide" : `${selectedCountries.length} countries`}
        </Button>
        <p className="text-sm text-foreground/60">Pick where your next sesh comes from</p>
      </div>

      {/* Input Field */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add your interests (optional)"
          className="bg-card/80 h-16 pl-5 pr-14 text-lg border-border focus:border-primary/50 placeholder:text-foreground/40"
          maxLength={30}
        />
        <button
          onClick={() => addInterest(inputValue)}
          disabled={!inputValue.trim() || interests.length >= maxInterests}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-primary/30 text-primary hover:bg-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Interests */}
      <AnimatePresence mode="popLayout">
        {interests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
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
                  className="px-4 py-2 text-base bg-primary/25 text-primary border-primary/40 hover:bg-primary/35 cursor-pointer group"
                  onClick={() => removeInterest(interest)}
                >
                  {interest}
                  <X className="w-3.5 h-3.5 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Interests */}
      {interests.length < maxInterests && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground/70">Quick add:</p>
          <div className="flex flex-wrap gap-2.5">
            {displayedSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => addInterest(suggestion)}
                className="px-4 py-2 text-base rounded-full border border-border bg-card/70 text-foreground/80 hover:text-foreground hover:border-primary/50 hover:bg-primary/15 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
            {availableSuggestions.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-base text-primary hover:underline font-medium"
              >
                {showAll ? "Show less" : `+${availableSuggestions.length - 6} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Limit indicator */}
      <p className="text-sm text-foreground/50 text-right">
        {interests.length}/{maxInterests} interests
      </p>

      <CountrySelector
        selectedCountries={selectedCountries}
        onCountriesChange={onCountriesChange}
        isOpen={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
      />
    </div>
  );
};

export default InterestInput;
