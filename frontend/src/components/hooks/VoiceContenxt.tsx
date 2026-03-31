import { createContext, useContext, useState, ReactNode } from "react";

type VoiceContextType = {
  voiceAssistanceEnabled: boolean;
  setVoiceAssistanceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [voiceAssistanceEnabled, setVoiceAssistanceEnabled] = useState(false);

  return (
    <VoiceContext.Provider
      value={{ voiceAssistanceEnabled, setVoiceAssistanceEnabled }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used inside VoiceProvider");
  }
  return context;
}