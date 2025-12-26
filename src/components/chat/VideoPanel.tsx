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
  isAudioEnabled = true,
  stream = null,
  videoRef,
  connectionState = 'new',
}: VideoPanelProps) => {

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef?.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  const hasStream = stream && stream.getVideoTracks().length > 0;
  const isWebRTCConnected = connectionState === 'connected';

  return (
    <div className={`
      relative flex-1 rounded-2xl overflow-hidden bg-card/80 border border-border/30
      ${isLocal ? 'lg:max-w-xs lg:max-h-48 lg:absolute lg:bottom-4 lg:right-4 lg:z-20' : ''}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-card to-deep-space">
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl smoke-drift" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-3xl smoke-drift" style={{ animationDelay: '-7s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {isSearching && !isLocal ? (
              <>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <Leaf className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm font-display">Searching worldwide...</p>
              </>
            ) : isLocal && !isVideoEnabled ? (
              <>
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xs">Camera off</p>
              </>
            ) : !isLocal && isConnected && !isWebRTCConnected ? (
              <>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
                  <Video className="absolute inset-0 m-auto w-6 h-6 text-accent" />
                </div>
                <p className="text-muted-foreground text-sm">Connecting video...</p>
                <p className="text-muted-foreground/60 text-xs">Establishing peer connection</p>
              </>
            ) : !isLocal && !isConnected ? (
              <>
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                  <Video className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-sm">Waiting for stranger...</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Label */}
      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-2">
        {isLocal ? 'You' : 'Stranger'}
        {!isLocal && isWebRTCConnected && (
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </div>

      {/* Connection state indicator for remote */}
      {!isLocal && connectionState !== 'new' && connectionState !== 'connected' && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs">
          {connectionState === 'connecting' && <span className="text-accent">Connecting...</span>}
          {connectionState === 'disconnected' && <span className="text-destructive">Disconnected</span>}
          {connectionState === 'failed' && <span className="text-destructive">Failed</span>}
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
