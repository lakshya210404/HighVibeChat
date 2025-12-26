import { useState, useRef, useCallback, useEffect } from 'react';
import { useWebRTCSignaling } from './useWebRTCSignaling';

interface UseWebRTCCallOptions {
  userId: string;
  roomId: string | null;
  peerId: string | null;
  isInitiator: boolean;
}

export const useWebRTCCall = ({
  userId,
  roomId,
  peerId,
  isInitiator,
}: UseWebRTCCallOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const hasCreatedOfferRef = useRef(false);
  const isNegotiatingRef = useRef(false);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    console.log('[WebRTC Call] Received offer');
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.warn('[WebRTC Call] No peer connection');
      return;
    }

    try {
      if (pc.signalingState !== 'stable') {
        console.log('[WebRTC Call] Ignoring offer - not in stable state:', pc.signalingState);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Add any pending candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidatesRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log('[WebRTC Call] Sending answer');
      signaling.sendAnswer(answer);
    } catch (error) {
      console.error('[WebRTC Call] Error handling offer:', error);
    }
  }, []);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    console.log('[WebRTC Call] Received answer');
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      if (pc.signalingState !== 'have-local-offer') {
        console.log('[WebRTC Call] Ignoring answer - not waiting for answer:', pc.signalingState);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      
      // Add any pending candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidatesRef.current = [];
    } catch (error) {
      console.error('[WebRTC Call] Error handling answer:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    console.log('[WebRTC Call] Received ICE candidate');
    const pc = peerConnectionRef.current;
    if (!pc) return;

    try {
      if (pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    } catch (error) {
      console.error('[WebRTC Call] Error adding ICE candidate:', error);
    }
  }, []);

  const signaling = useWebRTCSignaling({
    userId,
    roomId,
    peerId,
    onOffer: handleOffer,
    onAnswer: handleAnswer,
    onIceCandidate: handleIceCandidate,
  });

  const createPeerConnection = useCallback(() => {
    console.log('[WebRTC Call] Creating peer connection');
    
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('[WebRTC Call] Sending ICE candidate');
        signaling.sendIceCandidate(event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC Call] Remote track received');
      const stream = event.streams[0];
      setRemoteStream(stream);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC Call] Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState);
    };

    pc.onnegotiationneeded = async () => {
      if (isNegotiatingRef.current) return;
      
      try {
        isNegotiatingRef.current = true;
        
        if (isInitiator && !hasCreatedOfferRef.current) {
          console.log('[WebRTC Call] Negotiation needed - creating offer');
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          signaling.sendOffer(offer);
          hasCreatedOfferRef.current = true;
        }
      } catch (error) {
        console.error('[WebRTC Call] Negotiation error:', error);
      } finally {
        isNegotiatingRef.current = false;
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log('[WebRTC Call] ICE gathering state:', pc.iceGatheringState);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [isInitiator, signaling]);

  const requestPermissions = useCallback(async () => {
    console.log('[WebRTC Call] Requesting camera/mic permissions');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setLocalStream(stream);
      setPermissionGranted(true);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log('[WebRTC Call] Permissions granted, stream started');
      return stream;
    } catch (error) {
      console.error('[WebRTC Call] Error accessing media devices:', error);
      setPermissionGranted(false);
      throw error;
    }
  }, []);

  const startLocalStream = useCallback(async () => {
    console.log('[WebRTC Call] Starting local stream');
    
    // If we already have a stream, return it
    if (localStream) {
      return localStream;
    }
    
    return requestPermissions();
  }, [localStream, requestPermissions]);

  const addLocalStreamToConnection = useCallback((stream: MediaStream) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    console.log('[WebRTC Call] Adding local tracks to connection');
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const cleanup = useCallback(() => {
    console.log('[WebRTC Call] Cleaning up');
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setRemoteStream(null);
    setConnectionState('new');
    setPermissionGranted(false);
    pendingCandidatesRef.current = [];
    hasCreatedOfferRef.current = false;
    isNegotiatingRef.current = false;
    
    signaling.cleanup();
  }, [localStream, signaling]);

  // Initialize WebRTC when room and peer are available AND permission is granted
  useEffect(() => {
    if (!roomId || !peerId || !permissionGranted || !localStream) {
      return;
    }

    console.log('[WebRTC Call] Initializing call - isInitiator:', isInitiator);
    
    const initCall = async () => {
      try {
        const pc = createPeerConnection();
        addLocalStreamToConnection(localStream);
        
        // If we're the initiator, wait a bit then create offer
        if (isInitiator) {
          // Small delay to ensure both peers are ready
          setTimeout(async () => {
            if (pc.signalingState === 'stable' && !hasCreatedOfferRef.current) {
              console.log('[WebRTC Call] Creating initial offer');
              try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                signaling.sendOffer(offer);
                hasCreatedOfferRef.current = true;
              } catch (error) {
                console.error('[WebRTC Call] Error creating offer:', error);
              }
            }
          }, 1000);
        }
      } catch (error) {
        console.error('[WebRTC Call] Error initializing call:', error);
      }
    };

    initCall();

    return () => {
      // Only cleanup peer connection, not the stream
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      setRemoteStream(null);
      setConnectionState('new');
      pendingCandidatesRef.current = [];
      hasCreatedOfferRef.current = false;
      isNegotiatingRef.current = false;
      signaling.cleanup();
    };
  }, [roomId, peerId, isInitiator, permissionGranted, localStream]);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isVideoEnabled,
    isAudioEnabled,
    connectionState,
    permissionGranted,
    toggleVideo,
    toggleAudio,
    cleanup,
    requestPermissions,
  };
};
