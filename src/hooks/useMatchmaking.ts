import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Room {
  id: string;
  status: string;
  user1_id: string;
  user2_id: string | null;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const useMatchmaking = (
  interests: string[] = [],
  gender: string = 'other',
  lookingFor: string = 'everyone',
  isPremium: boolean = false,
  countries: string[] = [],
  vibe: string | null = null
) => {
  const [userId] = useState(() => crypto.randomUUID());
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'disconnected'>('idle');
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(420);
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const subscribeToRoom = useCallback((roomId: string) => {
    console.log('Subscribing to room:', roomId);
    
    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          console.log('New message received via Realtime:', newMsg.sender_id);
          // Only add if not from us (we already added optimistically)
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            // If it's from us, skip (optimistic already added)
            if (newMsg.sender_id === userId) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('Room updated:', payload.new);
          const updatedRoom = payload.new as Room;
          if (updatedRoom.status === 'ended') {
            setStatus('disconnected');
            setRoom(null);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime channel status:', status);
      });

    channelRef.current = channel;
  }, [userId]);

  const joinQueue = useCallback(async () => {
    setStatus('searching');
    clearPolling();

    try {
      const { data, error } = await supabase.functions.invoke('matchmaking', {
        body: { action: 'join_queue', userId, interests, gender, lookingFor, isPremium, countries, vibe }
      });

      if (error) throw error;

      if (data.matched && data.room) {
        setRoom(data.room);
        setStatus('connected');
        if (data.sharedInterests) setSharedInterests(data.sharedInterests);
        subscribeToRoom(data.room.id);
        return;
      }

      // Start polling for match
      pollingRef.current = setInterval(async () => {
        try {
          const { data: checkData, error: checkError } = await supabase.functions.invoke('matchmaking', {
            body: { action: 'check_match', userId }
          });

          if (checkError) throw checkError;

          if (checkData.matched && checkData.room) {
            clearPolling();
            setRoom(checkData.room);
            setStatus('connected');
            if (checkData.sharedInterests) setSharedInterests(checkData.sharedInterests);
            subscribeToRoom(checkData.room.id);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 2000);
    } catch (error) {
      console.error('Join queue error:', error);
      setStatus('idle');
    }
  }, [userId, clearPolling, subscribeToRoom, interests, gender, lookingFor, isPremium, countries, vibe]);

  const leaveRoom = useCallback(async () => {
    clearPolling();
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (room) {
      try {
        await supabase.functions.invoke('matchmaking', {
          body: { action: 'leave_room', userId, roomId: room.id }
        });
      } catch (error) {
        console.error('Leave room error:', error);
      }
    }

    setRoom(null);
    setMessages([]);
    setStatus('idle');
  }, [room, userId, clearPolling]);

  const leaveQueue = useCallback(async () => {
    clearPolling();
    
    try {
      await supabase.functions.invoke('matchmaking', {
        body: { action: 'leave_queue', userId }
      });
    } catch (error) {
      console.error('Leave queue error:', error);
    }

    setStatus('idle');
  }, [userId, clearPolling]);

  const sendMessage = useCallback(async (content: string) => {
    if (!room || !content.trim()) return;

    // Optimistically add message locally
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      room_id: room.id,
      sender_id: userId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Insert directly via Supabase client instead of edge function
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: room.id,
          sender_id: userId,
          content: content.trim()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Send message error:', error);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    }
  }, [room, userId]);

  const findNext = useCallback(async () => {
    await leaveRoom();
    await joinQueue();
  }, [leaveRoom, joinQueue]);

  // Fetch online count
  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const { data } = await supabase.functions.invoke('matchmaking', {
          body: { action: 'get_online_count', userId }
        });
        if (data?.count) {
          setOnlineCount(Math.max(data.count, 420));
        }
      } catch (error) {
        console.error('Error fetching online count:', error);
      }
    };

    fetchOnlineCount();
    const interval = setInterval(fetchOnlineCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPolling();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [clearPolling]);

  return {
    userId,
    status,
    room,
    messages,
    onlineCount,
    sharedInterests,
    joinQueue,
    leaveQueue,
    leaveRoom,
    sendMessage,
    findNext,
  };
};
