import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SmokeBackground from "@/components/ui/SmokeBackground";
import VibeParticles from "@/components/landing/VibeParticles";
import FourTwentySurprise from "@/components/landing/FourTwentySurprise";
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
import FriendsPanel from "@/components/friends/FriendsPanel";
import { SessionVibe } from "@/components/landing/SessionVibes";
import { usePresence } from "@/hooks/usePresence";
import { useFriends } from "@/hooks/useFriends";
import { useFriendNotifications } from "@/hooks/useFriendNotifications";

type AppState = 'age-verify' | 'home' | 'mode-select' | 'chat';
type NavTab = 'home' | 'elevate' | 'theme' | 'settings' | 'friends';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('home');
  const [chatMode, setChatMode] = useState<ChatMode>('video-text');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>('other');
  const [lookingFor, setLookingFor] = useState<LookingFor>('everyone');
  const [isPremium, setIsPremium] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<SessionVibe>(null);

  // Track online presence
  usePresence();
  const { friends, incomingRequests } = useFriends();
  useFriendNotifications(friends, incomingRequests);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.title = "HighVibeChat - Anonymous Chat for Elevated Minds";
  }, []);

  const handleAgeVerified = () => {
    setAppState('home');
  };

  if (loading) {
    return (
      <>
        <SmokeBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-foreground/60 text-lg font-display animate-pulse">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) return null;

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

  const renderContent = () => {
    if (activeTab === 'friends') {
      return <FriendsPanel />;
    }
    if (activeTab === 'theme') {
      return <ThemeSelector />;
    }
    if (activeTab === 'elevate') {
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
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
        />
      );
    }
    return (
      <>
        <Hero 
          onStartChat={handleStartChat} 
          interests={interests}
          onInterestsChange={setInterests}
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
          selectedVibe={selectedVibe}
          onVibeChange={setSelectedVibe}
        />
        <Reviews />
        <Features />
        <Premium onGoElevate={() => setActiveTab('elevate')} />
        <Footer />
      </>
    );
  };

  return (
    <>
      <SmokeBackground />
      <VibeParticles />
      <FourTwentySurprise />
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
          selectedCountries={selectedCountries}
          selectedVibe={selectedVibe}
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            friendRequestCount={incomingRequests.length}
          />
        </>
      )}
    </>
  );
};

export default Index;
