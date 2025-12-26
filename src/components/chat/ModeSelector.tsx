import { Video, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ChatMode = 'video-text' | 'video-only' | 'text-only';

interface ModeOption {
  id: ChatMode;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const modes: ModeOption[] = [
  {
    id: 'video-text',
    icon: <><Video className="w-6 h-6" /><MessageSquare className="w-5 h-5" /></>,
    title: 'Video + Text',
    description: 'Full experience with camera and chat',
    color: 'primary',
  },
  {
    id: 'video-only',
    icon: <Video className="w-7 h-7" />,
    title: 'Video Only',
    description: 'Face-to-face without text chat',
    color: 'accent',
  },
  {
    id: 'text-only',
    icon: <MessageSquare className="w-7 h-7" />,
    title: 'Text Only',
    description: 'Classic anonymous text chat',
    color: 'secondary',
  },
];

interface ModeSelectorProps {
  onSelectMode: (mode: ChatMode) => void;
  onBack: () => void;
}

const ModeSelector = ({ onSelectMode, onBack }: ModeSelectorProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] smoke-drift" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] smoke-drift" style={{ animationDelay: "-5s" }} />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Choose your vibe</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            How do you want to <span className="text-gradient">connect</span>?
          </h2>
          <p className="text-muted-foreground">
            Pick your preferred way to meet new people
          </p>
        </div>

        {/* Mode options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {modes.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`
                group relative p-6 rounded-2xl glass hover:bg-card/80 
                transition-all duration-300 text-left
                hover:scale-105 hover:glow-primary
                slide-up
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center gap-1 mb-4
                ${mode.color === 'primary' ? 'bg-primary/20 text-primary' : ''}
                ${mode.color === 'accent' ? 'bg-accent/20 text-accent' : ''}
                ${mode.color === 'secondary' ? 'bg-secondary/20 text-secondary' : ''}
                group-hover:scale-110 transition-transform duration-300
              `}>
                {mode.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {mode.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {mode.description}
              </p>

              {/* Hover indicator */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${mode.color === 'primary' ? 'bg-primary/5' : ''}
                ${mode.color === 'accent' ? 'bg-accent/5' : ''}
                ${mode.color === 'secondary' ? 'bg-secondary/5' : ''}
              `} />
            </button>
          ))}
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Back to home
        </Button>
      </div>
    </div>
  );
};

export default ModeSelector;
