import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Check, X, MessageCircle, Video, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFriends, Friend, FriendRequest } from "@/hooks/useFriends";
import { formatDistanceToNow } from "date-fns";

interface FriendsPanelProps {
  onPingFriend?: (friendId: string, mode: "text" | "video") => void;
}

const FriendsPanel = ({ onPingFriend }: FriendsPanelProps) => {
  const { friends, incomingRequests, loading, acceptRequest, declineRequest, removeFriend } = useFriends();
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="font-display text-3xl font-bold text-center">Friends</h2>
          {incomingRequests.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground font-bold">
              {incomingRequests.length}
            </span>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "friends"
                ? "bg-primary text-primary-foreground"
                : "bg-card/70 text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === "requests"
                ? "bg-primary text-primary-foreground"
                : "bg-card/70 text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            Requests
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] rounded-full bg-accent text-accent-foreground font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Friends list */}
        {activeTab === "friends" && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : friends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No friends yet</p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Connect with someone in chat and send them a friend request!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onPing={onPingFriend}
                    onRemove={() => removeFriend(friend.friendship_id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Requests list */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {incomingRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No pending requests</p>
              </div>
            ) : (
              <AnimatePresence>
                {incomingRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onAccept={() => acceptRequest(req.id, req.sender_id)}
                    onDecline={() => declineRequest(req.id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const FriendCard = ({
  friend,
  onPing,
  onRemove,
}: {
  friend: Friend;
  onPing?: (friendId: string, mode: "text" | "video") => void;
  onRemove: () => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 rounded-xl bg-card/70 border border-border hover:border-primary/30 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online dot */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-sm font-bold text-primary">
              {friend.display_name.charAt(0).toUpperCase()}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                friend.is_online ? "bg-emerald-500" : "bg-muted-foreground/40"
              }`}
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{friend.display_name}</p>
            <p className="text-xs text-muted-foreground">
              {friend.is_online
                ? "Online now"
                : friend.last_seen
                  ? `Last seen ${formatDistanceToNow(new Date(friend.last_seen), { addSuffix: true })}`
                  : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {friend.is_online && onPing && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full text-primary hover:bg-primary/10"
                onClick={() => onPing(friend.id, "text")}
                title="Text chat"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full text-accent hover:bg-accent/10"
                onClick={() => onPing(friend.id, "video")}
                title="Video chat"
              >
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            title="Remove friend"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const RequestCard = ({
  request,
  onAccept,
  onDecline,
}: {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-4 rounded-xl bg-card/70 border border-accent/30"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center text-sm font-bold text-accent">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">{request.sender_name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="icon"
          className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90"
          onClick={onAccept}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onDecline}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </motion.div>
);

export default FriendsPanel;
