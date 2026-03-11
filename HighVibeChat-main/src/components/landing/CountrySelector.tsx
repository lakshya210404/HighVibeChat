import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CountrySelectorProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

const CountrySelector = ({ selectedCountries, onCountriesChange, isOpen, onClose }: CountrySelectorProps) => {
  const [search, setSearch] = useState("");

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCountry = (code: string) => {
    if (selectedCountries.includes(code)) {
      onCountriesChange(selectedCountries.filter((c) => c !== code));
    } else {
      onCountriesChange([...selectedCountries, code]);
    }
  };

  const selectAll = () => {
    onCountriesChange(COUNTRIES.map((c) => c.code));
  };

  const clearAll = () => {
    onCountriesChange([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md max-h-[80vh] glass rounded-2xl border border-border/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Select Countries</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card/50"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={selectAll} className="text-xs">
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} className="text-xs">
                  Clear All
                </Button>
              </div>
            </div>

            {/* Countries List */}
            <div className="p-4 overflow-y-auto max-h-[400px] space-y-2">
              {filteredCountries.map((country) => {
                const isSelected = selectedCountries.includes(country.code);
                return (
                  <motion.button
                    key={country.code}
                    onClick={() => toggleCountry(country.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isSelected
                        ? "bg-primary/20 border border-primary/50"
                        : "bg-card/50 border border-border/30 hover:border-primary/30"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
                Done ({selectedCountries.length} selected)
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CountrySelector;
