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
  
  // Only activate signaling after peer connection is ready
  const [signalingRoomId, setSignalingRoomId] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const hasCreatedOfferRef = useRef(false);
  const isNegotiatingRef = useRef(false);
  const signalingRef = useRef<ReturnType<typeof useWebRTCSignaling> | null>(null);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    console.log('[WebRTC Call] Received offer');
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.warn('[WebRTC Call] No peer connection for offer');
      return;
    }

    try {
      if (pc.signalingState !== 'stable') {
        console.log('[WebRTC Call] Ignoring offer - state:', pc.signalingState);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      for (const candidate of pendingCandidatesRef.current) {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn('ICE add error:', e); }
      }
      pendingCandidatesRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log('[WebRTC Call] Sending answer');
      signalingRef.current?.sendAnswer(answer);
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
        console.log('[WebRTC Call] Ignoring answer - state:', pc.signalingState);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      
      for (const candidate of pendingCandidatesRef.current) {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn('ICE add error:', e); }
      }
      pendingCandidatesRef.current = [];
    } catch (error) {
      console.error('[WebRTC Call] Error handling answer:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
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

  // Only subscribe to signaling when peer connection is ready (signalingRoomId is set)
  const signaling = useWebRTCSignaling({
    userId,
    roomId: signalingRoomId,
    peerId,
    onOffer: handleOffer,
    onAnswer: handleAnswer,
    onIceCandidate: handleIceCandidate,
  });

  // Keep signalingRef in sync
  useEffect(() => {
    signalingRef.current = signaling;
  }, [signaling]);

  const createPeerConnection = useCallback(() => {
    console.log('[WebRTC Call] Creating peer connection');
    
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.relay.metered.ca:80' },
        {
          urls: 'turn:global.relay.metered.ca:80',
          username: 'open',
          credential: 'open',
        },
        {
          urls: 'turn:global.relay.metered.ca:443',
          username: 'open',
          credential: 'open',
        },
        {
          urls: 'turn:global.relay.metered.ca:443?transport=tcp',
          username: 'open',
          credential: 'open',
        },
      ],
      iceCandidatePoolSize: 10,
    };

    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingRef.current?.sendIceCandidate(event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC Call] Remote track received:', event.track.kind);
      const stream = event.streams[0];
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC Call] Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState);
      
      if (pc.connectionState === 'failed') {
        console.log('[WebRTC Call] Connection failed, attempting restart');
        pc.restartIce();
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC Call] ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        pc.restartIce();
      }
    };

    pc.onnegotiationneeded = () => {
      // Don't create offers here - the initial offer is created in the 2s timer
      // after signaling is ready. This event fires too early (before signalingRef is updated).
      console.log('[WebRTC Call] Negotiation needed event (handled by timer)');
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [isInitiator]);

  const requestPermissions = useCallback(async () => {
    console.log('[WebRTC Call] Requesting camera/mic permissions');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
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

      console.log('[WebRTC Call] Permissions granted, tracks:', stream.getTracks().map(t => `${t.kind}:${t.enabled}`));
      return stream;
    } catch (error) {
      console.error('[WebRTC Call] Error accessing media devices:', error);
      setPermissionGranted(false);
      throw error;
    }
  }, []);

  const addLocalStreamToConnection = useCallback((stream: MediaStream) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    console.log('[WebRTC Call] Adding local tracks to connection:', stream.getTracks().length);
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
    
    setSignalingRoomId(null);
    setRemoteStream(null);
    setConnectionState('new');
    setPermissionGranted(false);
    pendingCandidatesRef.current = [];
    hasCreatedOfferRef.current = false;
    isNegotiatingRef.current = false;
    
    signalingRef.current?.cleanup();
  }, [localStream]);

  // Initialize WebRTC when room and peer are available AND permission is granted
  useEffect(() => {
    if (!roomId || !peerId || !permissionGranted || !localStream) {
      setSignalingRoomId(null);
      return;
    }

    console.log('[WebRTC Call] Initializing call - isInitiator:', isInitiator, 'roomId:', roomId);
    
    // Step 1: Create peer connection and add tracks FIRST
    const pc = createPeerConnection();
    addLocalStreamToConnection(localStream);
    
    // Step 2: NOW activate signaling so it can receive/fetch signals with PC ready
    setSignalingRoomId(roomId);
    
    // Step 3: If initiator, create offer after a delay to let responder subscribe
    if (isInitiator) {
      const timer = setTimeout(async () => {
        if (pc.signalingState === 'stable' && !hasCreatedOfferRef.current) {
          console.log('[WebRTC Call] Creating initial offer');
          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            signalingRef.current?.sendOffer(offer);
            hasCreatedOfferRef.current = true;
          } catch (error) {
            console.error('[WebRTC Call] Error creating offer:', error);
          }
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        cleanupConnection();
      };
    }

    return () => {
      cleanupConnection();
    };
  }, [roomId, peerId, isInitiator, permissionGranted, localStream]);

  const cleanupConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setSignalingRoomId(null);
    setRemoteStream(null);
    setConnectionState('new');
    pendingCandidatesRef.current = [];
    hasCreatedOfferRef.current = false;
    isNegotiatingRef.current = false;
    signalingRef.current?.cleanup();
  }, []);

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
