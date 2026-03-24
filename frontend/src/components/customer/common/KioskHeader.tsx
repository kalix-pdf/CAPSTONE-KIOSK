import { Button } from "../../ui/button";
import { LogOut, User, Home, Volume2, VolumeX, Languages, Type } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface KioskHeaderProps {
  mode: 'customer' | 'admin' | 'queue-display' | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  // Accessibility props
  voiceAssistanceEnabled?: boolean;
  onVoiceAssistanceToggle?: () => void;
  language?: "en" | "fil";
  onLanguageChange?: (lang: "en" | "fil") => void;
  textSize?: "small" | "medium" | "large";
  onTextSizeChange?: (size: "small" | "medium" | "large") => void;
}

export function KioskHeader({ mode, isAuthenticated, onLogout, voiceAssistanceEnabled, onVoiceAssistanceToggle, language, onLanguageChange, textSize, onTextSizeChange }: KioskHeaderProps) {
  // Translation labels
  const translations = {
    en: { small: "Small", medium: "Medium", large: "Large" },
    fil: { small: "Maliit", medium: "Katamtaman", large: "Malaki" }
  };
  const t = translations[language || "en"];

  return (
    <div className="bg-gradient-to-r from-lumot-600 to-lumot-900 text-white p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <img className="object-fit" src="/images/logo-white.png" alt="⚕️" />
            </div>
          <div>
            <h1 className="mb-1">QiMedSc Kiosk</h1>
            <p className="text-blue-100">Medication Information & Pharmacy Health Kiosk with AI-Powered OCR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Accessibility controls - only show in customer mode */}
          {mode === 'customer' && onVoiceAssistanceToggle && onLanguageChange && onTextSizeChange && (
            <>
              {/* <Button
                onClick={onVoiceAssistanceToggle}
                variant={voiceAssistanceEnabled ? "default" : "secondary"}
                size="lg"
                className="h-12"
              >
                {voiceAssistanceEnabled ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
              </Button> */}
              
              <Select
                value={language}
                onValueChange={onLanguageChange}
              >
                <SelectTrigger className="w-36 h-12 bg-white text-gray-900">
                  <Languages className="h-5 w-5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fil">Filipino</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={textSize}
                onValueChange={onTextSizeChange}
              >
                <SelectTrigger className="w-36 h-12 bg-white text-gray-900">
                  <Type className="h-5 w-5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t.small}</SelectItem>
                  <SelectItem value="medium">{t.medium}</SelectItem>
                  <SelectItem value="large">{t.large}</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          
          {isAuthenticated && (
            <>
              <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
                <User className="h-5 w-5" />
                <span>Pharmacist</span>
              </div>
              <Button
                onClick={onLogout}
                variant="destructive"
                size="lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}