import { Leaf, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SmokeBackground from "@/components/ui/SmokeBackground";

const Terms = () => {
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
          <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
        </div>

        <div className="space-y-8 text-muted-foreground">
          <p className="text-sm">Last updated: December 27, 2025</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HighVibeChat, you agree to be bound by these Terms of Service. If you don't agree with any part of these terms, please don't use our service. It's all about good vibes here.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Age Requirement</h2>
            <p>
              <strong>You must be 21 years of age or older to use HighVibeChat.</strong> By using our service, you confirm that you meet this age requirement. We take this seriously—this is a platform designed for adults only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Description of Service</h2>
            <p>
              HighVibeChat is an anonymous video and text chat platform designed to connect like-minded adults in the cannabis community. We provide:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Random matching with other users based on interests and preferences</li>
              <li>Real-time video and text communication</li>
              <li>Session-based interactions with no persistent accounts</li>
              <li>Premium features for enhanced matching and customization</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. User Conduct</h2>
            <p>When using HighVibeChat, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Treat other users with respect and kindness</li>
              <li>Not engage in harassment, bullying, or threatening behavior</li>
              <li>Not share explicit content without consent</li>
              <li>Not use the platform for illegal activities</li>
              <li>Not attempt to collect personal information from other users</li>
              <li>Not spam, advertise, or promote external services</li>
              <li>Not impersonate others or misrepresent yourself</li>
              <li>Not attempt to circumvent our safety or moderation systems</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Prohibited Content</h2>
            <p>The following content is strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Illegal content of any kind</li>
              <li>Content involving minors</li>
              <li>Non-consensual intimate content</li>
              <li>Hate speech or discrimination</li>
              <li>Violence or threats of violence</li>
              <li>Content that promotes illegal drug trafficking</li>
              <li>Malware, phishing, or other malicious content</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Disclaimer</h2>
            <p>
              HighVibeChat is provided "as is" without warranties of any kind. We do not endorse, verify, or take responsibility for the content shared by users. We do not condone or promote illegal activities, including the illegal use or distribution of controlled substances.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Enforcement</h2>
            <p>
              We reserve the right to remove users who violate these terms, either temporarily or permanently. Repeated or severe violations may result in permanent bans from the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Intellectual Property</h2>
            <p>
              All content, branding, and technology powering HighVibeChat are owned by us or our licensors. You may not copy, modify, or distribute our platform or its components without permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, HighVibeChat and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p>
              Questions about these terms? Visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
