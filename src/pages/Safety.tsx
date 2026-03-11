import { Leaf, ArrowLeft, Shield, AlertTriangle, Heart, MessageCircle, Ban, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SmokeBackground from "@/components/ui/SmokeBackground";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SmokeBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold">Safety Center</h1>
        </div>

        <p className="text-lg text-muted-foreground mb-12">
          Your safety is our priority. Here's everything you need to know about staying safe while vibing on HighVibeChat.
        </p>

        <div className="grid gap-8">
          {/* Safety Tips */}
          <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Safety Tips</h2>
            </div>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Protect your identity:</strong> Never share personal information like your real name, address, phone number, or social media handles.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Trust your instincts:</strong> If something feels off, skip to the next chat. There's no pressure to continue any conversation.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Keep it on platform:</strong> Be cautious of users who try to move the conversation to other platforms quickly.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Be mindful of your surroundings:</strong> Be aware of what's visible in your video background.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Set boundaries:</strong> You're in control. Don't feel pressured to do or share anything you're not comfortable with.</span>
              </li>
            </ul>
          </section>

          {/* Reporting */}
          <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-semibold">Reporting Users</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If you encounter someone who violates our community guidelines, you can report them. Reports help us keep the community safe.
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">1.</span>
                <span>Use the report button available during or after a chat session</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">2.</span>
                <span>Select the reason for your report</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">3.</span>
                <span>Our team reviews all reports and takes appropriate action</span>
              </li>
            </ul>
          </section>

          {/* What We Do */}
          <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">How We Keep You Safe</h2>
            </div>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Age Verification:</strong> We require users to confirm they are 21+ before accessing the platform.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Anonymous by Default:</strong> No accounts means no persistent data that could identify you.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Rate Limiting:</strong> We prevent spam and abuse through message rate limits.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Temporary Blocks:</strong> Users who receive multiple reports may be temporarily blocked.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span><strong>Ephemeral Chats:</strong> Messages are not stored after your session ends.</span>
              </li>
            </ul>
          </section>

          {/* Blocked Behaviors */}
          <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Ban className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-semibold">Zero Tolerance Behaviors</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              The following behaviors result in immediate removal from the platform:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Harassment or bullying</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Sharing explicit content without consent</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Hate speech or discrimination</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Threats or intimidation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Illegal activity of any kind</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>Solicitation or advertising</span>
              </li>
            </ul>
          </section>

          {/* Community Guidelines */}
          <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Community Vibes</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Help us maintain a positive community by following these guidelines:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Be respectful and kind to everyone</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Keep conversations positive and uplifting</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Respect boundaries—if someone says no, accept it</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Report bad actors to help keep the community safe</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Vibe responsibly and have fun!</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need to report an issue or have safety concerns?
          </p>
          <Link to="/contact">
            <Button className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Safety;
