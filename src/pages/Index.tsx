import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import BottomNav from "@/components/landing/BottomNav";
import ThemeSelector from "@/components/landing/ThemeSelector";
import BoostPanel from "@/components/landing/BoostPanel";
import SettingsPanel, { Gender, LookingFor } from "@/components/landing/SettingsPanel";
import FriendsPanel from "@/components/friends/FriendsPanel";
import ConfessionsPanel from "@/components/confessions/ConfessionsPanel";
import PremiumPopup from "@/components/landing/PremiumPopup";
import AuthGate from "@/components/auth/AuthGate";
import UserHeader from "@/components/landing/UserHeader";
import { usePresence } from "@/hooks/usePresence";
import { useFriends } from "@/hooks/useFriends";
import { useFriendNotifications } from "@/hooks/useFriendNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { SessionVibe } from "@/components/landing/SessionVibes";

type AppState = 'home' | 'mode-select' | 'chat';
type NavTab = 'home' | 'elevate' | 'theme' | 'settings' | 'friends' | 'confessions';

const Index = () => {
  const { user, loading, subscribed, gender: userGender, guestInfo, isGuest, updateGender, checkSubscription } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('home');
  const [chatMode, setChatMode] = useState<ChatMode>('video-text');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender>((userGender as Gender) || (guestInfo?.gender as Gender) || 'other');
  const [lookingFor, setLookingFor] = useState<LookingFor>('everyone');
  const isPremium = subscribed;
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<SessionVibe>(null);

  // Track online presence (only for authenticated users)
  usePresence();
  const { friends, incomingRequests } = useFriends();
  useFriendNotifications(friends, incomingRequests);

  // Redirect to entry if no user and no guest
  useEffect(() => {
    if (!loading && !user && !guestInfo) {
      navigate("/auth");
    }
  }, [user, loading, navigate, guestInfo]);

  // Sync gender from profile or guest
  useEffect(() => {
    if (userGender) setGender(userGender as Gender);
    else if (guestInfo?.gender) setGender(guestInfo.gender as Gender);
  }, [userGender, guestInfo?.gender]);

  useEffect(() => {
    document.title = "HighVibeChat - Anonymous Chat for Elevated Minds";
  }, []);

  // Handle checkout success — activate premium access
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");
    if (checkout === "success" && sessionId && user) {
      const activate = async () => {
        try {
          const { data: { session: authSession } } = await supabase.auth.getSession();
          if (!authSession) return;
          const { data, error } = await supabase.functions.invoke("activate-premium", {
            body: { sessionId },
            headers: { Authorization: `Bearer ${authSession.access_token}` },
          });
          if (error) throw error;
          if (data?.already_activated) {
            toast.info("Premium already activated!");
          } else {
            toast.success(`${data.tier ? data.tier.replace("_", " ") : "Premium"} activated! 🔥`);
          }
          await checkSubscription();
        } catch (err: any) {
          console.error("Activation error:", err);
          toast.error("Failed to activate premium. Please refresh the page.");
        }
        // Clean URL
        setSearchParams({});
      };
      activate();
    } else if (checkout === "cancel") {
      toast.info("Checkout cancelled");
      setSearchParams({});
    }
  }, [searchParams, user]);

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

  // Need either user or guest
  if (!user && !guestInfo) return null;

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
    if (activeTab === 'confessions') {
      return <ConfessionsPanel />;
    }
    if (activeTab === 'friends') {
      // Friends requires auth
      if (!user) {
        return <AuthGate message="Sign up to add friends and save your connections 🌿" />;
      }
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
          onGenderChange={(g) => { setGender(g); updateGender(g); }}
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
      
      {appState === 'chat' && (
        <ChatInterface 
          onLeave={handleLeaveChat} 
          onGoElevate={() => { setAppState('home'); setActiveTab('elevate'); }}
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
           <UserHeader />
           <main className="relative z-10 pb-24 pt-14">
             {renderContent()}
           </main>
           <BottomNav 
             activeTab={activeTab} 
             onTabChange={handleTabChange} 
             friendRequestCount={incomingRequests.length}
           />
           <PremiumPopup onGoElevate={() => setActiveTab('elevate')} />
         </>
      )}
    </>
  );
};

export default Index;
