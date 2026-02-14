import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTypingIndicatorOptions {
  roomId: string | null;
  userId: string;
}

export const useTypingIndicator = ({ roomId, userId }: UseTypingIndicatorOptions) => {
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sendThrottleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomId || !userId) return;

    const channel = supabase.channel(`typing-${roomId}`);

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.userId !== userId) {
          setIsPartnerTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 2000);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (sendThrottleRef.current) clearTimeout(sendThrottleRef.current);
      setIsPartnerTyping(false);
    };
  }, [roomId, userId]);

  const sendTyping = useCallback(() => {
    if (!channelRef.current || sendThrottleRef.current) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId },
    });

    // Throttle to once per second
    sendThrottleRef.current = setTimeout(() => {
      sendThrottleRef.current = null;
    }, 1000);
  }, [userId]);

  return { isPartnerTyping, sendTyping };
};
