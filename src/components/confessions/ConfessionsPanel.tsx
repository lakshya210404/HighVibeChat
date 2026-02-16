import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareHeart, Heart, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Confession {
  id: string;
  user_id: string | null;
  title: string | null;
  content: string;
  emoji: string;
  likes_count: number;
  created_at: string;
  liked_by_me: boolean;
  display_name: string | null;
}

const EMOJI_OPTIONS = ["🔥", "💀", "😭", "🤣", "💚", "🫣", "👀", "🥴"];

const ConfessionsPanel = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const [submitting, setSubmitting] = useState(false);

  const fetchConfessions = useCallback(async () => {

    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) { console.error(error); return; }

    // Fetch display names for all user_ids
    const userIds = [...new Set((data || []).map(c => c.user_id).filter(Boolean))] as string[];
    let profileMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);
      profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.display_name || "Anonymous"]));
    }

    // Check which ones user has liked
    let likedIds = new Set<string>();
    if (user) {
      const { data: myLikes } = await supabase
        .from("confession_likes")
        .select("confession_id")
        .eq("user_id", user.id);
      likedIds = new Set(myLikes?.map(l => l.confession_id) || []);
    }

    setConfessions(
      (data || []).map(c => ({
        ...c,
        liked_by_me: likedIds.has(c.id),
        display_name: c.user_id ? (profileMap[c.user_id] || "Anonymous") : "Anonymous",
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("confessions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => {
        fetchConfessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchConfessions]);

  const handleSubmit = async () => {
    if (!user || !content.trim() || !title.trim()) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("confessions")
      .insert({ user_id: user.id, title: title.trim(), content: content.trim(), emoji: selectedEmoji });

    if (error) {
      toast.error("Failed to post confession");
      console.error(error);
    } else {
      toast.success("Confession posted anonymously 🤫");
      setTitle("");
      setContent("");
      setSelectedEmoji("🔥");
    }
    setSubmitting(false);
  };

  const toggleLike = async (confession: Confession) => {
    if (!user) return;

    if (confession.liked_by_me) {
      await supabase
        .from("confession_likes")
        .delete()
        .eq("confession_id", confession.id)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("confession_likes")
        .insert({ confession_id: confession.id, user_id: user.id });
    }

    // Optimistic update
    setConfessions(prev =>
      prev.map(c =>
        c.id === confession.id
          ? { ...c, liked_by_me: !c.liked_by_me, likes_count: c.likes_count + (c.liked_by_me ? -1 : 1) }
          : c
      )
    );
  };

  const handleDelete = async (id: string) => {
    await supabase.from("confessions").delete().eq("id", id);
    toast.info("Confession deleted");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <MessageSquareHeart className="w-6 h-6 text-primary" />
          <h2 className="font-display text-3xl font-bold text-center">HVC Confessions</h2>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Share your wildest chat stories. 100% anonymous. No judgement. 🤫
        </p>

        {/* Post form - only for logged in users */}
        {user ? (
          <div className="p-4 rounded-xl bg-card/70 border border-border mb-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a catchy title... 🎯"
              className="w-full bg-transparent border-none text-sm font-display font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none mb-2"
              maxLength={100}
            />
            <div className="h-px bg-border/50 mb-2" />
            <textarea
              value={content}
              onChange={(e) => {
                const words = e.target.value.split(/\s+/).filter(Boolean);
                if (words.length <= 1000 || e.target.value.length < content.length) {
                  setContent(e.target.value);
                }
              }}
              placeholder="Spill the tea... what happened in your chat? 👀"
              className="w-full bg-transparent border-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setSelectedEmoji(e)}
                    className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      selectedEmoji === e ? "bg-primary/20 scale-110" : "hover:bg-muted/50"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || submitting}
                className="rounded-xl gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Confess
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-2 text-right">
              {title.length}/100 · {content.split(/\s+/).filter(Boolean).length}/1000 words
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-card/70 border border-border mb-6 text-center">
            <p className="text-sm text-muted-foreground">Sign up to post your own confessions 🤫</p>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading confessions...</div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareHeart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No confessions yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Be the first to spill! 🫖</p>
            </div>
          ) : (
            <AnimatePresence>
              {confessions.map((confession) => (
                <ConfessionCard
                  key={confession.id}
                  confession={confession}
                  isOwner={confession.user_id === user?.id}
                  onLike={() => toggleLike(confession)}
                  onDelete={() => handleDelete(confession.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ConfessionCard = ({
  confession,
  isOwner,
  onLike,
  onDelete,
}: {
  confession: Confession;
  isOwner: boolean;
  onLike: () => void;
  onDelete: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-4 rounded-xl bg-card/70 border border-border hover:border-primary/20 transition-all"
  >
    <div className="flex gap-3">
      <span className="text-2xl mt-0.5">{confession.emoji}</span>
      <div className="flex-1 min-w-0">
        {confession.title && (
          <h3 className="font-display font-bold text-sm text-foreground mb-1">{confession.title}</h3>
        )}
        <p className="text-xs text-primary/70 font-medium mb-1">@{confession.display_name || "Anonymous"}</p>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
          {confession.content}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] text-muted-foreground/60">
            {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
                confession.liked_by_me
                  ? "text-red-400 bg-red-500/10"
                  : "text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${confession.liked_by_me ? "fill-current" : ""}`} />
              {confession.likes_count > 0 && confession.likes_count}
            </button>
            {isOwner && (
              <button
                onClick={onDelete}
                className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ConfessionsPanel;
