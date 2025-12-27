import { useState } from "react";
import { Leaf, ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SmokeBackground from "@/components/ui/SmokeBackground";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent! 🌿",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

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
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold">Contact Us</h1>
        </div>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          Got questions, feedback, or just want to say high? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Only provide if you want us to respond directly
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What's on your mind?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="bg-background/50 resize-none"
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Quick Help
              </h2>
              <p className="text-muted-foreground mb-4">
                Before reaching out, you might find your answer in these resources:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  {" "}— Learn about how we handle your data
                </li>
                <li>
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {" "}— Our rules and guidelines
                </li>
                <li>
                  <Link to="/safety" className="text-primary hover:underline">
                    Safety Center
                  </Link>
                  {" "}— Tips for staying safe online
                </li>
              </ul>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Common Topics</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">🐛</span>
                  <span>Bug reports and technical issues</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">💡</span>
                  <span>Feature suggestions and feedback</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">⚠️</span>
                  <span>Safety concerns and reports</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">💎</span>
                  <span>Premium subscription questions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">🤝</span>
                  <span>Partnership inquiries</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-primary/30">
              <h2 className="text-xl font-semibold mb-2">Response Time</h2>
              <p className="text-muted-foreground">
                We typically respond within 24-48 hours. For urgent safety concerns, please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
