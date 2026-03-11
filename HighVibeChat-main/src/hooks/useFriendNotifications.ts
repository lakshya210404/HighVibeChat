import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Friend, FriendRequest } from "@/hooks/useFriends";

// Simple notification sound using Web Audio API
const playNotificationSound = (type: "online" | "request") => {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    if (type === "request") {
      // Two-tone chime for friend request
      oscillator.frequency.setValueAtTime(587, ctx.currentTime); // D5
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } else {
      // Soft pop for friend online
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    }

    oscillator.onended = () => ctx.close();
  } catch {
    // Audio not available, skip silently
  }
};

export const useFriendNotifications = (
  friends: Friend[],
  incomingRequests: FriendRequest[]
) => {
  const prevOnlineIds = useRef<Set<string>>(new Set());
  const prevRequestIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  // Track friends coming online
  useEffect(() => {
    const currentOnlineIds = new Set(
      friends.filter((f) => f.is_online).map((f) => f.id)
    );

    if (initialized.current) {
      // Find newly online friends
      currentOnlineIds.forEach((id) => {
        if (!prevOnlineIds.current.has(id)) {
          const friend = friends.find((f) => f.id === id);
          if (friend) {
            playNotificationSound("online");
            toast(`${friend.display_name} is now online 🟢`, {
              duration: 4000,
            });
          }
        }
      });
    }

    prevOnlineIds.current = currentOnlineIds;
    if (!initialized.current && friends.length > 0) {
      initialized.current = true;
    }
  }, [friends]);

  // Track new friend requests
  useEffect(() => {
    const currentRequestIds = new Set(incomingRequests.map((r) => r.id));

    if (initialized.current) {
      incomingRequests.forEach((req) => {
        if (!prevRequestIds.current.has(req.id)) {
          playNotificationSound("request");
          toast(`${req.sender_name || "Someone"} sent you a friend request! 🤝`, {
            duration: 5000,
          });
        }
      });
    }

    prevRequestIds.current = currentRequestIds;
    if (!initialized.current && incomingRequests.length > 0) {
      initialized.current = true;
    }
  }, [incomingRequests]);
};
