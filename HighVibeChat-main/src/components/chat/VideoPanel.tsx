import { useEffect, RefObject } from "react";
import { Leaf, Video, VideoOff } from "lucide-react";

interface VideoPanelProps {
  isLocal: boolean;
  isConnected?: boolean;
  isSearching?: boolean;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  stream?: MediaStream | null;
  videoRef?: RefObject<HTMLVideoElement>;
  connectionState?: RTCPeerConnectionState;
}

const VideoPanel = ({ 
  isLocal, 
  isConnected = false, 
  isSearching = false,
  isVideoEnabled = true,
  stream = null,
  videoRef,
  connectionState = 'new',
}: VideoPanelProps) => {

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef?.current && stream) {
      videoRef.current.srcObject = stream;
      // Ensure play on mobile
      videoRef.current.play().catch(() => {});
    }
  }, [stream, videoRef]);

  const hasStream = stream && stream.getVideoTracks().length > 0;
  const isWebRTCConnected = connectionState === 'connected';

  return (
    <div className={`
      relative w-full h-full rounded-xl overflow-hidden bg-card/80 border border-border/30
    `}>
      {/* Video element */}
      {hasStream && isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-card to-background">
          <div className="relative z-10 flex flex-col items-center gap-3">
            {isSearching && !isLocal ? (
              <>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <Leaf className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm font-display">Searching worldwide...</p>
              </>
            ) : isLocal && !isVideoEnabled ? (
              <>
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                  <VideoOff className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xs">Camera off</p>
              </>
            ) : !isLocal && isConnected && !isWebRTCConnected ? (
              <>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
                  <Video className="absolute inset-0 m-auto w-5 h-5 text-accent" />
                </div>
                <p className="text-muted-foreground text-sm">Connecting video...</p>
              </>
            ) : !isLocal && !isConnected ? (
              <>
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                  <Video className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-sm">Waiting for stranger...</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Label - only on larger panels */}
      {!isLocal && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1.5">
          Stranger
          {isWebRTCConnected && (
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          )}
        </div>
      )}

      {/* Connection state indicator */}
      {!isLocal && connectionState !== 'new' && connectionState !== 'connected' && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs">
          {connectionState === 'connecting' && <span className="text-accent">Connecting...</span>}
          {connectionState === 'disconnected' && <span className="text-destructive">Disconnected</span>}
          {connectionState === 'failed' && <span className="text-destructive">Failed</span>}
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
