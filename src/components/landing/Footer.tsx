import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold">HighVibeChat</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Safety</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 HighVibeChat. All rights reserved.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground/60 text-center mt-8 max-w-2xl mx-auto">
          HighVibeChat is designed for adults 21+. Please vibe responsibly. 
          We do not condone illegal activities.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
