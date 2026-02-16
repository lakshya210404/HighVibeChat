import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Friend {
  id: string;
  friendship_id: string;
  display_name: string;
  is_online: boolean;
  last_seen: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  sender_name?: string;
  created_at: string;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!user) return;

    // Get friendships where user is either user1 or user2
    const { data: friendships, error } = await supabase
      .from("friendships")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (error) { console.error(error); return; }

    if (!friendships || friendships.length === 0) {
      setFriends([]);
      setLoading(false);
      return;
    }

    // Get friend user IDs
    const friendIds = friendships.map(f => f.user1_id === user.id ? f.user2_id : f.user1_id);

    // Get profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", friendIds);

    // Get presence
    const { data: presence } = await supabase
      .from("user_presence")
      .select("*")
      .in("user_id", friendIds);

    const friendList: Friend[] = friendIds.map(fid => {
      const profile = profiles?.find(p => p.id === fid);
      const pres = presence?.find(p => p.user_id === fid);
      const friendship = friendships.find(f => f.user1_id === fid || f.user2_id === fid);
      return {
        id: fid,
        friendship_id: friendship?.id || "",
        display_name: profile?.display_name || "Unknown",
        is_online: pres?.is_online || false,
        last_seen: pres?.last_seen || "",
      };
    });

    // Sort: online first
    friendList.sort((a, b) => (b.is_online ? 1 : 0) - (a.is_online ? 1 : 0));
    setFriends(friendList);
    setLoading(false);
  }, [user]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    if (error) { console.error(error); return; }

    // Enrich with sender names
    if (data && data.length > 0) {
      const senderIds = data.map(r => r.sender_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", senderIds);

      const enriched = data.map(r => ({
        ...r,
        sender_name: profiles?.find(p => p.id === r.sender_id)?.display_name || "Someone",
      }));
      setIncomingRequests(enriched);
    } else {
      setIncomingRequests([]);
    }
  }, [user]);

  const sendFriendRequest = useCallback(async (receiverId: string) => {
    if (!user) return;

    // Check if already friends
    const { data: existing } = await supabase
      .from("friendships")
      .select("id")
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      toast.info("You're already friends! ✨");
      return;
    }

    // Check for existing request
    const { data: existingReq } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("sender_id", user.id)
      .eq("receiver_id", receiverId)
      .eq("status", "pending")
      .maybeSingle();

    if (existingReq) {
      toast.info("Friend request already sent!");
      return;
    }

    const { error } = await supabase
      .from("friend_requests")
      .insert({ sender_id: user.id, receiver_id: receiverId, status: "pending" });

    if (error) {
      console.error(error);
      toast.error("Failed to send friend request");
    } else {
      toast.success("Friend request sent! 🤝");
    }
  }, [user]);

  const acceptRequest = useCallback(async (requestId: string, senderId: string) => {
    if (!user) return;

    // Update request status
    await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    // Create friendship
    await supabase
      .from("friendships")
      .insert({ user1_id: senderId, user2_id: user.id });

    toast.success("Friend added! 🎉");
    fetchFriends();
    fetchRequests();
  }, [user, fetchFriends, fetchRequests]);

  const declineRequest = useCallback(async (requestId: string) => {
    await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .eq("id", requestId);

    toast.info("Request declined");
    fetchRequests();
  }, [fetchRequests]);

  const removeFriend = useCallback(async (friendshipId: string) => {
    await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    toast.info("Friend removed");
    fetchFriends();
  }, [fetchFriends]);

  // Initial fetch
  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, [fetchFriends, fetchRequests]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const friendsChannel = supabase
      .channel("friendships-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, () => {
        fetchFriends();
      })
      .subscribe();

    const requestsChannel = supabase
      .channel("friend-requests-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "friend_requests" }, () => {
        fetchRequests();
      })
      .subscribe();

    const presenceChannel = supabase
      .channel("presence-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_presence" }, () => {
        fetchFriends();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(friendsChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user, fetchFriends, fetchRequests]);

  return {
    friends,
    incomingRequests,
    loading,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    refetch: fetchFriends,
  };
};
