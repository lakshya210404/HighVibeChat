import { useState, useEffect } from "react";
import SmokeBackground from "@/components/ui/SmokeBackground";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Premium from "@/components/landing/Premium";
import Footer from "@/components/landing/Footer";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  useEffect(() => {
    document.title = "HighVibeChat - Anonymous Chat for Elevated Minds";
  }, []);

  const handleStartChat = () => {
    setIsChatActive(true);
  };

  const handleLeaveChat = () => {
    setIsChatActive(false);
  };

  return (
    <>
      <SmokeBackground />
      
      {isChatActive ? (
        <ChatInterface onLeave={handleLeaveChat} />
      ) : (
        <main className="relative z-10">
          <Hero onStartChat={handleStartChat} />
          <Features />
          <Premium />
          <Footer />
        </main>
      )}
    </>
  );
};

export default Index;
