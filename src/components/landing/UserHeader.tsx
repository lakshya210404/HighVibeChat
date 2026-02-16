import { useState } from "react";
import { useGuest } from "@/contexts/GuestContext";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Check, X, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface UserHeaderProps {
  onSignInClick?: () => void;
}

const UserHeader = ({ onSignInClick }: UserHeaderProps) => {
  const { guestName, setGuestName } = useGuest();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(guestName || "");

  const displayName = user
    ? (user.user_metadata?.display_name || user.email?.split("@")[0] || "User")
    : guestName || "Guest";

  const handleSave = () => {
    if (!editValue.trim()) return;
    setGuestName(editValue.trim());
    setIsEditing(false);
    toast.success("Name updated! ✨");
  };

  const handleCancel = () => {
    setEditValue(guestName || "");
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
            {displayName.charAt(0).toUpperCase()}
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
                  setEditValue(guestName || "");
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors group"
              >
                <span>{displayName}</span>
                <Pencil className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={onSignInClick}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 font-medium"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
