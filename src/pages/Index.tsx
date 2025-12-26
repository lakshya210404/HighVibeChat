import { useState, useEffect } from "react";
import SmokeBackground from "@/components/ui/SmokeBackground";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Premium from "@/components/landing/Premium";
import Footer from "@/components/landing/Footer";
import ChatInterface from "@/components/chat/ChatInterface";
import ModeSelector, { ChatMode } from "@/components/chat/ModeSelector";
import AgeVerification from "@/components/AgeVerification";

type AppState = 'age-verify' | 'home' | 'mode-select' | 'chat';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('age-verify');
  const [chatMode, setChatMode] = useState<ChatMode>('video-text');

  useEffect(() => {
    document.title = "HighVibeChat - Anonymous Chat for Elevated Minds";
  }, []);

  const handleAgeVerified = () => {
    setAppState('home');
  };

  const handleStartChat = () => {
    setAppState('mode-select');
  };

  const handleSelectMode = (mode: ChatMode) => {
    setChatMode(mode);
    setAppState('chat');
  };

  const handleLeaveChat = () => {
    setAppState('home');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  return (
    <>
      <SmokeBackground />
      
      {appState === 'age-verify' && (
        <AgeVerification onVerified={handleAgeVerified} />
      )}
      
      {appState === 'chat' && (
        <ChatInterface onLeave={handleLeaveChat} mode={chatMode} />
      )}
      
      {appState === 'mode-select' && (
        <ModeSelector onSelectMode={handleSelectMode} onBack={handleBackToHome} />
      )}
      
      {appState === 'home' && (
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
