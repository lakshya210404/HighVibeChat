import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareHeart, ChevronUp, ChevronDown, MessageCircle, Send, Trash2, Globe, User } from "lucide-react";
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
  upvotes: number;
  downvotes: number;
  comments_count: number;
  created_at: string;
  my_vote: "up" | "down" | null;
}

interface Comment {
  id: string;
  confession_id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
}

const EMOJI_OPTIONS = ["🔥", "💀", "😭", "🤣", "💚", "🫣", "👀", "🥴"];

// Generate a persistent anonymous ID for guests
const getAnonId = (): string => {
  let id = localStorage.getItem("hvc_anon_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("hvc_anon_id", id);
  }
  return id;
};

type FeedTab = "all" | "mine";

const ConfessionsPanel = () => {
  const { user, guestInfo } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FeedTab>("all");

  const visitorId = user?.id || getAnonId();
  const visitorName = user ? (guestInfo?.name || user.email?.split("@")[0] || "Anonymous") : (guestInfo?.name || "Anonymous");

  const fetchConfessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) { console.error(error); return; }

    // Fetch user's votes
    const { data: myVotes } = await supabase
      .from("confession_votes")
      .select("confession_id, vote_type")
      .eq("user_id", visitorId);

    const voteMap: Record<string, "up" | "down"> = {};
    (myVotes || []).forEach(v => { voteMap[v.confession_id] = v.vote_type as "up" | "down"; });

    setConfessions(
      (data || []).map(c => ({
        ...c,
        my_vote: voteMap[c.id] || null,
      }))
    );
    setLoading(false);
  }, [visitorId]);

  useEffect(() => { fetchConfessions(); }, [fetchConfessions]);

  useEffect(() => {
    const channel = supabase
      .channel("confessions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => fetchConfessions())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchConfessions]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("confessions")
      .insert({ title: title.trim() || null, content: content.trim(), emoji: selectedEmoji, user_id: visitorId });
    if (error) {
      toast.error("Failed to post confession");
      console.error(error);
    } else {
      toast.success("Confession posted anonymously 🤫");
      setTitle("");
      setContent("");
      setSelectedEmoji("🔥");
      // Immediately refetch so the new confession shows up
      await fetchConfessions();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("confessions").delete().eq("id", id);
    toast.info("Confession deleted");
    await fetchConfessions();
  };

  const handleVote = async (confession: Confession, type: "up" | "down") => {
    const currentVote = confession.my_vote;

    // Optimistic update
    setConfessions(prev => prev.map(c => {
      if (c.id !== confession.id) return c;
      let upvotes = c.upvotes;
      let downvotes = c.downvotes;

      if (currentVote === type) {
        if (type === "up") upvotes--;
        else downvotes--;
        return { ...c, upvotes, downvotes, my_vote: null };
      } else {
        if (currentVote === "up") upvotes--;
        if (currentVote === "down") downvotes--;
        if (type === "up") upvotes++;
        else downvotes++;
        return { ...c, upvotes, downvotes, my_vote: type };
      }
    }));

    if (currentVote === type) {
      await supabase.from("confession_votes").delete()
        .eq("confession_id", confession.id).eq("user_id", visitorId);
    } else if (currentVote) {
      await supabase.from("confession_votes")
        .update({ vote_type: type })
        .eq("confession_id", confession.id).eq("user_id", visitorId);
    } else {
      await supabase.from("confession_votes")
        .insert({ confession_id: confession.id, user_id: visitorId, vote_type: type });
    }
  };

  const myConfessions = confessions.filter(c => c.user_id === visitorId);
  const displayedConfessions = activeTab === "mine" ? myConfessions : confessions;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <MessageSquareHeart className="w-6 h-6 text-primary" />
          <h2 className="font-display text-3xl font-bold text-center">HVC Confessions</h2>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Share your wildest chat stories. 100% anonymous. No judgement. 🤫
        </p>

        {/* Post form */}
        <div className="p-4 rounded-xl bg-card/70 border border-border mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a catchy title... 🎯 (optional)"
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
            placeholder="Spill the tea... what happened? 👀"
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
              disabled={!content.trim() || submitting}
              className="rounded-xl gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Confess
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-2 text-right">
            {content.split(/\s+/).filter(Boolean).length}/1000 words
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Globe className="w-4 h-4" />
            All ({confessions.length})
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "mine"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="w-4 h-4" />
            My Confessions ({myConfessions.length})
          </button>
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading confessions...</div>
          ) : displayedConfessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareHeart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {activeTab === "mine" ? "You haven't confessed yet" : "No confessions yet"}
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                {activeTab === "mine" ? "Go ahead, spill the tea! ☝️" : "Be the first to spill! 🫖"}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedConfessions.map((confession) => (
                <ConfessionCard
                  key={confession.id}
                  confession={confession}
                  onVote={(type) => handleVote(confession, type)}
                  onDelete={() => handleDelete(confession.id)}
                  isOwner={confession.user_id === visitorId}
                  expanded={expandedId === confession.id}
                  onToggleComments={() => setExpandedId(expandedId === confession.id ? null : confession.id)}
                  visitorId={visitorId}
                  visitorName={visitorName}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Confession Card ─── */
const ConfessionCard = ({
  confession,
  onVote,
  onDelete,
  isOwner,
  expanded,
  onToggleComments,
  visitorId,
  visitorName,
}: {
  confession: Confession;
  onVote: (type: "up" | "down") => void;
  onDelete: () => void;
  isOwner: boolean;
  expanded: boolean;
  onToggleComments: () => void;
  visitorId: string;
  visitorName: string;
}) => {
  const score = confession.upvotes - confession.downvotes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl bg-card/70 border border-border hover:border-primary/20 transition-all overflow-hidden"
    >
      <div className="flex">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 py-3 px-2 bg-muted/30">
          <button
            onClick={() => onVote("up")}
            className={`p-1 rounded transition-colors ${
              confession.my_vote === "up"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className={`text-xs font-bold min-w-[20px] text-center ${
            score > 0 ? "text-primary" : score < 0 ? "text-destructive" : "text-muted-foreground"
          }`}>
            {score}
          </span>
          <button
            onClick={() => onVote("down")}
            className={`p-1 rounded transition-colors ${
              confession.my_vote === "down"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 min-w-0">
          {/* Meta line */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">{confession.emoji}</span>
            <span className="text-[11px] text-muted-foreground/60">
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Title */}
          {confession.title && (
            <h3 className="font-display font-bold text-foreground mb-1 leading-snug">
              {confession.title}
            </h3>
          )}

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
            {confession.content}
          </p>

          {/* Actions bar */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onToggleComments}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                expanded
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {confession.comments_count > 0 ? confession.comments_count : ""} Comments
            </button>
            {isOwner && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CommentsSection
              confessionId={confession.id}
              visitorId={visitorId}
              visitorName={visitorName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Comments Section ─── */
const CommentsSection = ({
  confessionId,
  visitorId,
  visitorName,
}: {
  confessionId: string;
  visitorId: string;
  visitorName: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("confession_comments")
      .select("*")
      .eq("confession_id", confessionId)
      .order("created_at", { ascending: true });

    if (!error) setComments(data || []);
    setLoadingComments(false);
  }, [confessionId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments-${confessionId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "confession_comments",
        filter: `confession_id=eq.${confessionId}`,
      }, () => fetchComments())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [confessionId, fetchComments]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("confession_comments").insert({
      confession_id: confessionId,
      user_id: visitorId,
      display_name: visitorName,
      content: newComment.trim(),
    });
    if (error) {
      toast.error("Failed to post comment");
    } else {
      setNewComment("");
    }
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("confession_comments").delete().eq("id", id);
  };

  return (
    <div className="border-t border-border/50 bg-muted/20 px-4 py-3">
      {/* Comment list */}
      {loadingComments ? (
        <p className="text-xs text-muted-foreground py-2">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 py-2">No comments yet — be the first!</p>
      ) : (
        <div className="space-y-2.5 mb-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary/80">{c.display_name}</span>
                  <span className="text-[10px] text-muted-foreground/50">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  </span>
                  {c.user_id === visitorId && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment input */}
      <div className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handlePost()}
          placeholder="Add a comment..."
          className="flex-1 bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30"
          maxLength={500}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePost}
          disabled={!newComment.trim() || posting}
          className="px-2 h-8"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ConfessionsPanel;
