import { useState } from "react";
import { Helmet } from "react-helmet-async";
import SmokeBackground from "@/components/ui/SmokeBackground";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Premium from "@/components/landing/Premium";
import Footer from "@/components/landing/Footer";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  const handleStartChat = () => {
    setIsChatActive(true);
  };

  const handleLeaveChat = () => {
    setIsChatActive(false);
  };

  return (
    <>
      <Helmet>
        <title>HighVibeChat - Anonymous Chat for Elevated Minds</title>
        <meta name="description" content="Connect with like-minded souls instantly. Anonymous, secure, and designed for elevated conversations. No accounts, no judgment, just good vibes." />
        <meta name="keywords" content="anonymous chat, random chat, meet strangers, chill chat, elevated conversation" />
      </Helmet>

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
