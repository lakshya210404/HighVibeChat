import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, SkipForward, Flag, Loader2, Leaf } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onLeave: () => void;
}

type ChatStatus = "searching" | "connected" | "disconnected";

const ChatInterface = ({ onLeave }: ChatInterfaceProps) => {
  const [status, setStatus] = useState<ChatStatus>("searching");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate finding a match
  useEffect(() => {
    if (status === "searching") {
      const timeout = setTimeout(() => {
        setStatus("connected");
        setMessages([{
          id: crypto.randomUUID(),
          text: "You're now chatting with a stranger. Say hi! ✌️",
          sender: "stranger",
          timestamp: new Date(),
        }]);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || status !== "connected") return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate stranger typing and responding
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: getRandomResponse(),
        sender: "stranger",
        timestamp: new Date(),
      }]);
    }, 1500 + Math.random() * 2000);
  };

  const handleNext = () => {
    setStatus("searching");
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 glass-heavy">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-semibold">HighVibeChat</span>
        </div>

        <div className="flex items-center gap-2">
          {status === "connected" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Connected
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onLeave}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {status === "searching" && (
          <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <Leaf className="absolute inset-0 m-auto w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Finding your vibe match...</p>
          </div>
        )}

        {status === "disconnected" && (
          <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
            <p className="text-xl font-display text-muted-foreground">Stranger disconnected</p>
            <Button onClick={handleNext} className="gap-2">
              <SkipForward className="w-4 h-4" />
              Find New Vibe
            </Button>
          </div>
        )}

        {status === "connected" && (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] px-4 py-3 rounded-2xl
                    ${message.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-sm" 
                      : "bg-muted text-foreground rounded-bl-sm"
                    }
                  `}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
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
        <div className="p-4 border-t border-border/50 glass-heavy">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="flex-shrink-0 text-muted-foreground hover:text-accent hover:bg-accent/20"
              title="Next"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-12 bg-muted/50 border-border/50 focus:border-primary rounded-xl"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
              title="Report"
            >
              <Flag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const responses = [
  "Hey! What's good? 🌿",
  "Nice vibes today, huh?",
  "Just chilling, you?",
  "This is pretty chill ngl",
  "Ayy what strain you on? 😂",
  "Love the energy here",
  "First time on here, pretty cool app",
  "Where you vibing from?",
];

const getRandomResponse = () => responses[Math.floor(Math.random() * responses.length)];

export default ChatInterface;
