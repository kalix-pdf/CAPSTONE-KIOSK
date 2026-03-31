// CustomerApp.tsx
import { useState } from "react";
import { CustomerMode } from "./components/customer/CustomerMode";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./components/customer/cart/GlobalCart";
import KioskLanding from "./KioskLanding";
import { VoiceProvider } from "./components/hooks/VoiceContenxt";

export default function CustomerApp() {
  type TransitionState = 'landing' | 'transitioning' | 'browse';
  const [transitionState, setTransitionState] = useState<TransitionState>('landing');

  const handleEnterBrowse = () => {
    setTransitionState('transitioning');
    setTimeout(() => setTransitionState('browse'), 100); 
  };
  return (
    <>
      <Toaster />
      <VoiceProvider>
      <CartProvider>
        <div className="max-h-screen max-w-full overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-[300ms] ease-in-out"
            style={{
              opacity: transitionState === 'landing' ? 1 : 0,
              transform: transitionState !== 'landing' ? 'translateX(-32px)' : 'translateX(0)',
              pointerEvents: transitionState === 'landing' ? 'auto' : 'none',
            }}
          >
            <KioskLanding onEnterBrowse={handleEnterBrowse} />
          </div>

          {/* Browse — slides in */}
          <div
            className="transition-all duration-[900ms] ease-in-out"
            style={{
              opacity: transitionState === 'browse' ? 1 : 0,
              transform: transitionState !== 'browse' ? 'translateX(32px)' : 'translateX(0)',
              pointerEvents: transitionState === 'browse' ? 'auto' : 'none',
            }}
          >
            <CustomerMode />
          </div>

        </div>
      </CartProvider>
      </VoiceProvider>
    </>
  );
}