import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Check, X, LogOut, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthGate from "@/components/auth/AuthGate";

const UserHeader = () => {
  const { displayName, gender, user, isGuest, updateDisplayName, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayName || "");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const name = displayName || "User";
  const genderEmoji = gender === "male" ? "♂️" : gender === "female" ? "♀️" : "⚧️";

  const handleSave = async () => {
    if (!editValue.trim()) return;
    await updateDisplayName(editValue.trim());
    setIsEditing(false);
    toast.success("Name updated! ✨");
  };

  const handleCancel = () => {
    setEditValue(displayName || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 glass-heavy border-b border-border/30">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center text-xs font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-1"
              >
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-7 w-32 text-sm bg-muted/50 border-border/50 rounded-lg px-2"
                  maxLength={30}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setEditValue(displayName || "");
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
              >
                <span>{name}</span>
                <span className="text-xs">{genderEmoji}</span>
                <Pencil className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>
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
    </div>
  );
};

export default UserHeader;
