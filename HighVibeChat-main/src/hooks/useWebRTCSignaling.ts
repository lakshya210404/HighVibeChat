import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SignalData {
  id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  signal_type: 'offer' | 'answer' | 'ice-candidate';
  signal_data: RTCSessionDescriptionInit | RTCIceCandidateInit;
  created_at: string;
}

interface UseWebRTCSignalingOptions {
  userId: string;
  roomId: string | null;
  peerId: string | null;
  onOffer: (offer: RTCSessionDescriptionInit) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
}

export const useWebRTCSignaling = ({
  userId,
  roomId,
  peerId,
  onOffer,
  onAnswer,
  onIceCandidate,
}: UseWebRTCSignalingOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const processedSignalsRef = useRef<Set<string>>(new Set());

  // Subscribe to signals for this room
  useEffect(() => {
    if (!roomId || !userId) return;

    console.log('[WebRTC Signaling] Subscribing to room:', roomId);

    const channel = supabase
      .channel(`webrtc-signals-${roomId}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signals',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const signal = payload.new as SignalData;
          
          // Skip if signal is from us or already processed
          if (signal.sender_id === userId || processedSignalsRef.current.has(signal.id)) {
            return;
          }
          
          // Skip if signal is not for us
          if (signal.receiver_id !== userId) {
            return;
          }

          processedSignalsRef.current.add(signal.id);
          console.log('[WebRTC Signaling] Received signal:', signal.signal_type);

          switch (signal.signal_type) {
            case 'offer':
              onOffer(signal.signal_data as RTCSessionDescriptionInit);
              break;
            case 'answer':
              onAnswer(signal.signal_data as RTCSessionDescriptionInit);
              break;
            case 'ice-candidate':
              onIceCandidate(signal.signal_data as RTCIceCandidateInit);
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('[WebRTC Signaling] Channel status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    // Also fetch any existing signals we might have missed
    fetchExistingSignals();

    return () => {
      console.log('[WebRTC Signaling] Unsubscribing from room:', roomId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      processedSignalsRef.current.clear();
    };
  }, [roomId, userId, onOffer, onAnswer, onIceCandidate]);

  const fetchExistingSignals = useCallback(async () => {
    if (!roomId || !userId) return;

    try {
      const { data: signals, error } = await supabase
        .from('webrtc_signals')
        .select('*')
        .eq('room_id', roomId)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[WebRTC Signaling] Error fetching signals:', error);
        return;
      }

      for (const signal of signals || []) {
        if (processedSignalsRef.current.has(signal.id)) continue;
        
        processedSignalsRef.current.add(signal.id);
        console.log('[WebRTC Signaling] Processing existing signal:', signal.signal_type);

        switch (signal.signal_type) {
          case 'offer':
            onOffer(signal.signal_data as unknown as RTCSessionDescriptionInit);
            break;
          case 'answer':
            onAnswer(signal.signal_data as unknown as RTCSessionDescriptionInit);
            break;
          case 'ice-candidate':
            onIceCandidate(signal.signal_data as unknown as RTCIceCandidateInit);
            break;
        }
      }
    } catch (error) {
      console.error('[WebRTC Signaling] Error:', error);
    }
  }, [roomId, userId, onOffer, onAnswer, onIceCandidate]);

  const sendSignal = useCallback(async (
    signalType: 'offer' | 'answer' | 'ice-candidate',
    signalData: RTCSessionDescriptionInit | RTCIceCandidateInit
  ) => {
    if (!roomId || !peerId) {
      console.warn('[WebRTC Signaling] Cannot send signal - missing roomId or peerId');
      return;
    }

    console.log('[WebRTC Signaling] Sending signal:', signalType);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('webrtc_signals')
        .insert({
          room_id: roomId,
          sender_id: userId,
          receiver_id: peerId,
          signal_type: signalType,
          signal_data: JSON.parse(JSON.stringify(signalData))
        } as any);

      if (error) {
        console.error('[WebRTC Signaling] Error sending signal:', error);
        throw error;
      }
    } catch (error) {
      console.error('[WebRTC Signaling] Send error:', error);
    }
  }, [roomId, userId, peerId]);

  const sendOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    return sendSignal('offer', offer);
  }, [sendSignal]);

  const sendAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
    return sendSignal('answer', answer);
  }, [sendSignal]);

  const sendIceCandidate = useCallback((candidate: RTCIceCandidateInit) => {
    return sendSignal('ice-candidate', candidate);
  }, [sendSignal]);

  const cleanup = useCallback(async () => {
    if (!roomId) return;

    try {
      // Clean up old signals for this room
      await supabase
        .from('webrtc_signals')
        .delete()
        .eq('room_id', roomId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    } catch (error) {
      console.error('[WebRTC Signaling] Cleanup error:', error);
    }
  }, [roomId, userId]);

  return {
    isConnected,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    cleanup,
  };
};
