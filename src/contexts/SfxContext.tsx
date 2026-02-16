import { createContext, useContext, useState, ReactNode } from "react";

interface SfxContextType {
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;
}

const SfxContext = createContext<SfxContextType>({ sfxEnabled: true, setSfxEnabled: () => {} });

export const SfxProvider = ({ children }: { children: ReactNode }) => {
  const [sfxEnabled, setSfxEnabledState] = useState(() => {
    const stored = localStorage.getItem("hvc_sfx");
    return stored !== null ? stored === "true" : true;
  });

  const setSfxEnabled = (enabled: boolean) => {
    localStorage.setItem("hvc_sfx", String(enabled));
    setSfxEnabledState(enabled);
  };

  return (
    <SfxContext.Provider value={{ sfxEnabled, setSfxEnabled }}>
      {children}
    </SfxContext.Provider>
  );
};

export const useSfx = () => useContext(SfxContext);
