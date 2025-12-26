import { useRef, useEffect, useState } from "react";
import { Leaf, Video, VideoOff } from "lucide-react";

interface VideoPanelProps {
  isLocal: boolean;
  isConnected?: boolean;
  isSearching?: boolean;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
}

const VideoPanel = ({ 
  isLocal, 
  isConnected = false, 
  isSearching = false,
  isVideoEnabled = true,
  isAudioEnabled = true 
}: VideoPanelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isLocal && isVideoEnabled) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: isAudioEnabled 
      })
        .then((mediaStream) => {
          setStream(mediaStream);
          setHasVideo(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          setHasVideo(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLocal, isVideoEnabled, isAudioEnabled]);

  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoEnabled;
      }
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isAudioEnabled;
      }
    }
  }, [isVideoEnabled, isAudioEnabled, stream]);

  return (
    <div className={`
      relative flex-1 rounded-2xl overflow-hidden bg-card/80 border border-border/30
      ${isLocal ? 'lg:max-w-xs lg:max-h-48 lg:absolute lg:bottom-4 lg:right-4 lg:z-20' : ''}
    `}>
      {/* Video element */}
      {((isLocal && hasVideo && isVideoEnabled) || (!isLocal && isConnected)) ? (
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
      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
        {isLocal ? 'You' : 'Stranger'}
      </div>

      {/* Video off indicator for connected state */}
      {!isLocal && isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/90">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              <Video className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">Video coming soon...</p>
            <p className="text-muted-foreground/60 text-xs">WebRTC signaling in development</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPanel;
