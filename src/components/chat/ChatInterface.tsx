import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, SkipForward, Flag, Leaf, Video, VideoOff, Mic, MicOff, Camera, UserPlus } from "lucide-react";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useFriends } from "@/hooks/useFriends";
import { useAuth } from "@/contexts/AuthContext";
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
  selectedVibe?: string | null;
}

const ChatInterface = ({ 
  onLeave, 
  mode, 
  interests = [],
  gender = 'other',
  lookingFor = 'everyone',
  isPremium = false,
  selectedCountries = [],
  selectedVibe = null
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
  } = useMatchmaking(interests, gender, lookingFor, isPremium, selectedCountries, selectedVibe);

  const [inputValue, setInputValue] = useState("");
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { sendFriendRequest } = useFriends();

  const { isPartnerTyping, sendTyping } = useTypingIndicator({
    roomId: status === 'connected' ? room?.id || null : null,
    userId,
  });

  const isVideoMode = mode === 'video-text';

  // Determine peer ID and if we're the initiator
  const peerId = room ? (room.user1_id === userId ? room.user2_id : room.user1_id) : null;
  const peerAuthId = room ? (room.user1_id === userId ? room.user2_auth_id : room.user1_auth_id) : null;
  const isInitiator = room ? room.user1_id === userId : false;

  // Reset friend request sent when partner changes
  useEffect(() => {
    setFriendRequestSent(false);
  }, [peerId]);

  const handleAddFriend = async () => {
    if (!peerAuthId || !user) {
      toast.error("Can't add this user as a friend");
      return;
    }
    if (peerAuthId === user.id) return;
    await sendFriendRequest(peerAuthId);
    setFriendRequestSent(true);
  };

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
  }, [messages, isPartnerTyping]);

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
      <header className="flex items-center justify-between px-3 py-2 border-b border-border/50 glass-heavy z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-display font-semibold text-sm">HighVibeChat</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {getModeLabel()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "connected" && peerAuthId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddFriend}
              disabled={friendRequestSent}
              className={`h-7 px-2 text-xs rounded-full ${
                friendRequestSent 
                  ? "bg-primary/20 text-primary" 
                  : "bg-accent/20 text-accent hover:bg-accent/30"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              {friendRequestSent ? "Sent ✓" : "Add Friend"}
            </Button>
          )}
          {status === "connected" && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Connected
            </div>
          )}
          {status === "searching" && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Searching...
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLeave}
          className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Video section */}
        {isVideoMode && (
          <div className="flex-[2] flex flex-col min-h-0 relative">
            {!permissionGranted ? (
              <div className="flex-1 flex items-center justify-center bg-muted/20 m-2 rounded-2xl">
                <div className="text-center space-y-3 p-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-semibold">Enable Camera & Mic</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Allow access to start video chatting.
                  </p>
                  <Button onClick={handleRequestPermissions} className="gap-2" size="sm">
                    <Video className="w-4 h-4" />
                    Allow Access
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-1 p-1 min-h-0">
                {/* Remote video - takes most space */}
                <div className="flex-1 min-h-0 relative">
                  <VideoPanel 
                    isLocal={false} 
                    isConnected={status === "connected"} 
                    isSearching={status === "searching"}
                    stream={remoteStream}
                    videoRef={remoteVideoRef}
                    connectionState={connectionState}
                  />
                </div>
                {/* Local video - small overlay */}
                <div className="absolute bottom-2 right-2 w-24 h-32 sm:w-32 sm:h-40 z-20 rounded-xl overflow-hidden border-2 border-border/50 shadow-lg">
                  <VideoPanel 
                    isLocal={true} 
                    isConnected={status === "connected"}
                    isVideoEnabled={isVideoEnabled}
                    isAudioEnabled={isAudioEnabled}
                    stream={localStream}
                    videoRef={localVideoRef}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat section - always visible, compact in video mode */}
        <div className={`
          ${isVideoMode ? 'flex-1 min-h-[180px] max-h-[40%] lg:max-h-full lg:w-80 lg:min-w-[320px]' : 'flex-1'} 
          flex flex-col border-t lg:border-t-0 lg:border-l border-border/50 bg-card/50 min-h-0
        `}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
            {status === "searching" && !isVideoMode && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  <Leaf className="absolute inset-0 m-auto w-5 h-5 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">Finding your vibe match...</p>
              </div>
            )}

            {status === "disconnected" && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="text-base font-display text-muted-foreground">Stranger disconnected</p>
                <Button onClick={handleNext} className="gap-2" size="sm">
                  <SkipForward className="w-4 h-4" />
                  Find New Vibe
                </Button>
              </div>
            )}

            {status === "connected" && (
              <>
                <div className="text-center py-1">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
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
                        max-w-[85%] px-3 py-2 rounded-2xl
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
                {isPartnerTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-3 py-2 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}

            {status === "searching" && isVideoMode && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-xs">Searching for someone...</p>
              </div>
            )}
          </div>

          {/* Input area */}
          {status === "connected" && (
            <div className="p-2 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); sendTyping(); }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="bg-muted/50 border-border/50 focus:border-primary rounded-xl text-sm h-9"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="rounded-xl bg-primary hover:bg-primary/90 h-9 w-9"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-3 p-2 border-t border-border/50 glass-heavy">
        {isVideoMode && permissionGranted && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={`w-10 h-10 rounded-full ${!isAudioEnabled ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-foreground'}`}
            >
              {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={`w-10 h-10 rounded-full ${!isVideoEnabled ? 'bg-destructive/20 text-destructive' : 'bg-muted/50 text-foreground'}`}
            >
              {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
          </>
        )}

        <Button
          onClick={handleNext}
          className="px-6 py-5 rounded-full bg-primary hover:bg-primary/90 font-display font-semibold text-sm"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Next
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-muted/50 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
        >
          <Flag className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
