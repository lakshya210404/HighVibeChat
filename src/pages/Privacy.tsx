import { Leaf, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SmokeBackground from "@/components/ui/SmokeBackground";

const Privacy = () => {
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
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
        </div>

        <div className="space-y-8 text-muted-foreground">
          <p className="text-sm">Last updated: December 27, 2025</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Our Commitment to Your Privacy</h2>
            <p>
              At HighVibeChat, we believe in keeping things chill—including your personal data. We're committed to protecting your privacy and ensuring you can vibe freely without worrying about your information being misused.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Anonymous by Design</h2>
            <p>
              HighVibeChat is built with anonymity at its core. We don't require you to create an account, provide your name, email, or any personal information to use our service. Your identity remains your own.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No registration or login required</li>
              <li>No persistent user profiles</li>
              <li>Chat history is not stored after sessions end</li>
              <li>Messages are ephemeral and scoped to your current session only</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Information We Collect</h2>
            <p>We collect minimal information necessary to provide our service:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Session Data:</strong> Temporary session identifiers to match you with other users</li>
              <li><strong>Preferences:</strong> Your selected interests, vibes, and matching preferences (stored only for the duration of your session)</li>
              <li><strong>Technical Data:</strong> Basic connection information required for WebRTC video calls</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. How We Use Your Information</h2>
            <p>The limited information we collect is used solely to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Match you with compatible chat partners based on your preferences</li>
              <li>Facilitate real-time video and text communication</li>
              <li>Maintain platform safety and prevent abuse</li>
              <li>Improve our matching algorithms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Data Retention</h2>
            <p>
              We keep things clean. Session data is automatically deleted when your chat session ends. We don't maintain long-term records of your conversations or activities on the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Third-Party Services</h2>
            <p>
              We use essential third-party services to power our platform, including real-time communication infrastructure. These services process only the technical data necessary to enable video and text chat.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
            <p>
              We use minimal cookies and local storage to maintain your session preferences. No tracking cookies or advertising cookies are used on our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Your Rights</h2>
            <p>Since we collect minimal data and don't maintain persistent user accounts, there's not much to request. However, you can:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Clear your browser's local storage to remove any session preferences</li>
              <li>Use private/incognito browsing for additional privacy</li>
              <li>Contact us with any privacy concerns</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out through our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
