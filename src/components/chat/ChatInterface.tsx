import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, SkipForward, Flag, Leaf, Video, VideoOff, Mic, MicOff, MessageSquare, Camera } from "lucide-react";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import VideoPanel from "./VideoPanel";
import { ChatMode } from "./ModeSelector";
import { toast } from "sonner";

interface ChatInterfaceProps {
  onLeave: () => void;
  mode: ChatMode;
  interests?: string[];
  gender?: string;
  lookingFor?: string;
  isPremium?: boolean;
  selectedCountries?: string[];
}

const ChatInterface = ({ 
  onLeave, 
  mode, 
  interests = [],
  gender = 'other',
  lookingFor = 'everyone',
  isPremium = false,
  selectedCountries = []
}: ChatInterfaceProps) => {
  const {
    userId,
    status,
    room,
    messages,
    joinQueue,
    leaveQueue,
    leaveRoom,
    sendMessage,
    findNext,
  } = useMatchmaking(interests, gender, lookingFor, isPremium, selectedCountries);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isVideoMode = mode === 'video-text';
  const isTextMode = true; // Text is always available

  // Determine peer ID and if we're the initiator
  const peerId = room ? (room.user1_id === userId ? room.user2_id : room.user1_id) : null;
  const isInitiator = room ? room.user1_id === userId : false;

  // Initialize WebRTC call
  const {
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
    cleanup: cleanupWebRTC,
    requestPermissions,
  } = useWebRTCCall({
    userId,
    roomId: isVideoMode && status === 'connected' ? room?.id || null : null,
    peerId: isVideoMode && status === 'connected' ? peerId : null,
    isInitiator,
  });

  const handleRequestPermissions = async () => {
    try {
      await requestPermissions();
      toast.success("Camera and microphone enabled!");
    } catch (error) {
      toast.error("Failed to access camera/microphone. Please allow permissions.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start searching when component mounts
  useEffect(() => {
    joinQueue();
    return () => {
      leaveQueue();
      cleanupWebRTC();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || status !== "connected") return;
    
    const messageContent = inputValue.trim();
    setInputValue("");
    await sendMessage(messageContent);
  };

  const handleNext = async () => {
    cleanupWebRTC();
    await findNext();
  };

  const handleLeave = async () => {
    cleanupWebRTC();
    await leaveRoom();
    await leaveQueue();
    onLeave();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'video-text': return 'Video Sesh';
      case 'text-only': return 'Text Sesh';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 glass-heavy z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-semibold">HighVibeChat</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {getModeLabel()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "connected" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Connected
              {isVideoMode && connectionState === 'connected' && (
                <span className="text-xs opacity-70">(Video)</span>
              )}
            </div>
          )}
          {status === "searching" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Searching...
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLeave}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video section - only show if video mode */}
        {isVideoMode && (
          <div className="flex-1 flex flex-col lg:flex-row gap-2 p-2 relative">
            {!permissionGranted ? (
              <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold">Enable Camera & Microphone</h3>
                  <p className="text-muted-foreground max-w-sm">
                    To start video chatting, we need access to your camera and microphone.
                  </p>
                  <Button onClick={handleRequestPermissions} className="gap-2">
                    <Video className="w-4 h-4" />
                    Allow Access
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <VideoPanel 
                  isLocal={false} 
                  isConnected={status === "connected"} 
                  isSearching={status === "searching"}
                  stream={remoteStream}
                  videoRef={remoteVideoRef}
                  connectionState={connectionState}
                />
                <VideoPanel 
                  isLocal={true} 
                  isConnected={status === "connected"}
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  stream={localStream}
                  videoRef={localVideoRef}
                />
              </>
            )}
          </div>
        )}

        {/* Chat sidebar/main area */}
        {isTextMode && showChat && (
          <div className={`
            ${isVideoMode ? 'w-full lg:w-96 border-l border-border/50' : 'flex-1'} 
            flex flex-col bg-card/50
          `}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {status === "searching" && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <Leaf className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Finding your vibe match...</p>
                </div>
              )}

              {status === "disconnected" && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-lg font-display text-muted-foreground">Stranger disconnected</p>
                  <Button onClick={handleNext} className="gap-2">
                    <SkipForward className="w-4 h-4" />
                    Find New Vibe
                  </Button>
                </div>
              )}

              {status === "connected" && (
                <>
                  <div className="text-center py-2">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      Connected with a stranger ✌️
                    </span>
                  </div>
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] px-4 py-2.5 rounded-2xl
                          ${message.sender_id === userId 
                            ? "bg-primary text-primary-foreground rounded-br-sm" 
                            : "bg-muted text-foreground rounded-bl-sm"
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            {status === "connected" && (
              <div className="p-3 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-muted/50 border-border/50 focus:border-primary rounded-xl"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-t border-border/50 glass-heavy">
        {isVideoMode && permissionGranted && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full ${!isAudioEnabled ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-foreground'}`}
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full ${!isVideoEnabled ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-foreground'}`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
          </>
        )}

        <Button
          onClick={handleNext}
          className="px-8 py-6 rounded-full bg-primary hover:bg-primary/90 font-display font-semibold"
        >
          <SkipForward className="w-5 h-5 mr-2" />
          Next
        </Button>

        {isVideoMode && isTextMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(!showChat)}
            className={`w-12 h-12 rounded-full ${showChat ? 'bg-primary/20 text-primary' : 'bg-muted/50'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-muted/50 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
        >
          <Flag className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
