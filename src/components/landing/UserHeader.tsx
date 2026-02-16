import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X, LogOut, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthGate from "@/components/auth/AuthGate";


const genderOptions = [
  { value: "male", emoji: "♂️", label: "Male" },
  { value: "female", emoji: "♀️", label: "Female" },
  { value: "other", emoji: "⚧️", label: "Other" },
];

const UserHeader = () => {
  const { displayName, gender, user, isGuest, updateDisplayName, updateGender, signOut, guestInfo, setGuestInfo } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editName, setEditName] = useState(displayName || "");
  const [editGender, setEditGender] = useState(gender || "other");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const name = displayName || "User";
  const genderEmoji = gender === "male" ? "♂️" : gender === "female" ? "♀️" : "⚧️";

  const handleOpenProfile = () => {
    setEditName(displayName || "");
    setEditGender(gender || "other");
    setShowProfileEdit(true);
  };

  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    // Update name
    await updateDisplayName(trimmedName);

    // Update gender
    await updateGender(editGender);

    setShowProfileEdit(false);
    toast.success("Profile updated! ✨");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveProfile();
    if (e.key === "Escape") setShowProfileEdit(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 glass-heavy border-b border-border/30">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          {/* Avatar - clickable to edit profile */}
          <button
            onClick={handleOpenProfile}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center text-xs font-bold text-primary hover:ring-2 hover:ring-primary/40 transition-all"
          >
            {name.charAt(0).toUpperCase()}
          </button>

          <button
            onClick={handleOpenProfile}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span>{name}</span>
            <span className="text-xs">{genderEmoji}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isGuest && (
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0 border-border/50 bg-background">
                <AuthGate
                  message="Sign in or create an account to save your progress 🌿"
                  onSuccess={() => setShowAuthDialog(false)}
                />
              </DialogContent>
            </Dialog>
          )}
          {user && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Profile edit dropdown */}
      <AnimatePresence>
        {showProfileEdit && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="border-t border-border/20 overflow-hidden"
          >
            <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Display Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-sm bg-muted/50 border-border/50 rounded-lg"
                  maxLength={30}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Gender</label>
                <div className="flex gap-2">
                  {genderOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEditGender(opt.value)}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-sm
                        ${editGender === opt.value
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border/50 bg-card/50 text-muted-foreground hover:border-border"
                        }
                      `}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHeader;
