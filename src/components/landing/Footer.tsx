import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="HighVibeChat" className="w-10 h-10" />
            <span className="font-display text-xl font-bold">HighVibeChat</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/safety" className="hover:text-foreground transition-colors">Safety</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
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
