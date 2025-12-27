import { useState, useEffect } from "react";
import SmokeBackground from "@/components/ui/SmokeBackground";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Premium from "@/components/landing/Premium";
import Footer from "@/components/landing/Footer";
import Reviews from "@/components/landing/Reviews";
import ChatInterface from "@/components/chat/ChatInterface";
import ModeSelector, { ChatMode } from "@/components/chat/ModeSelector";
import AgeVerification from "@/components/AgeVerification";
import BottomNav from "@/components/landing/BottomNav";
import ThemeSelector from "@/components/landing/ThemeSelector";
import BoostPanel from "@/components/landing/BoostPanel";
import SettingsPanel, { Gender, LookingFor } from "@/components/landing/SettingsPanel";

type AppState = 'age-verify' | 'home' | 'mode-select' | 'chat';
type NavTab = 'home' | 'boost' | 'theme' | 'settings';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('age-verify');
  const [chatMode, setChatMode] = useState<ChatMode>('video-text');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>('other');
  const [lookingFor, setLookingFor] = useState<LookingFor>('everyone');
  const [isPremium, setIsPremium] = useState(false);

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
    setActiveTab('home');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'theme') {
      return <ThemeSelector />;
    }
    if (activeTab === 'boost') {
      return <BoostPanel />;
    }
    if (activeTab === 'settings') {
      return (
        <SettingsPanel 
          gender={gender}
          lookingFor={lookingFor}
          onGenderChange={setGender}
          onLookingForChange={setLookingFor}
          isPremium={isPremium}
        />
      );
    }
    // Home tab - show the regular content
    return (
      <>
        <Hero 
          onStartChat={handleStartChat} 
          interests={interests}
          onInterestsChange={setInterests}
        />
        <Reviews />
        <Features />
        <Premium />
        <Footer />
      </>
    );
  };

  return (
    <>
      <SmokeBackground />
      
      {appState === 'age-verify' && (
        <AgeVerification onVerified={handleAgeVerified} />
      )}
      
      {appState === 'chat' && (
        <ChatInterface 
          onLeave={handleLeaveChat} 
          mode={chatMode} 
          interests={interests}
          gender={gender}
          lookingFor={lookingFor}
          isPremium={isPremium}
        />
      )}
      
      {appState === 'mode-select' && (
        <ModeSelector onSelectMode={handleSelectMode} onBack={handleBackToHome} />
      )}
      
      {appState === 'home' && (
        <>
          <main className="relative z-10 pb-24">
            {renderContent()}
          </main>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
    </>
  );
};

export default Index;
