import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GuestContextType {
  guestName: string | null;
  setGuestName: (name: string) => void;
  hasEnteredSite: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [guestName, setGuestNameState] = useState<string | null>(() => {
    return localStorage.getItem("hvc_guest_name");
  });

  const hasEnteredSite = !!guestName;

  const setGuestName = (name: string) => {
    localStorage.setItem("hvc_guest_name", name);
    setGuestNameState(name);
  };

  return (
    <GuestContext.Provider value={{ guestName, setGuestName, hasEnteredSite }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within GuestProvider");
  return context;
};
