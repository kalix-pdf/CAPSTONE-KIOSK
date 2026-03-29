import { useState, useEffect } from "react";
import { FileText, Scan, LayoutGrid, Activity } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { PrescriptionScanner } from "./components/customer/OCR/PrescriptionScanner";
import { MedicineScannerModal } from "./components/customer/OCR/MedicineScannerModal";
import { CustomerMode } from "./components/customer/CustomerMode";

// ─── Props ────────────────────────────────────────────────────────────────────
interface KioskLandingProps {
  onEnterBrowse: () => void;
}

// ─── Inject global styles once ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  :root {
    --teal-mid:  oklch(60.59% 0.10198 199.112);
    --teal-dark: #01201e;
    --teal-glow: #a0fffa;
    --teal-glow-dim: rgba(134,255,249,0.18);
    --teal-glow-faint: rgba(134,255,249,0.06);
    --card-bg: rgba(1,58,55,0.55);
    --card-border: rgba(162, 255, 250, 0.41);
    --text-primary: #e8fffd;
    --text-muted: rgba(134,255,249,0.55);
  }

  @keyframes orbit {
    from { transform: rotate(0deg)   translateX(110px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
  }
  @keyframes orbit2 {
    from { transform: rotate(120deg)  translateX(148px) rotate(-120deg); }
    to   { transform: rotate(480deg)  translateX(148px) rotate(-480deg); }
  }
  @keyframes orbit3 {
    from { transform: rotate(240deg)  translateX(182px) rotate(-240deg); }
    to   { transform: rotate(600deg)  translateX(182px) rotate(-600deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.55; }
    70%  { transform: scale(1.55); opacity: 0; }
    100% { transform: scale(1.55); opacity: 0; }
  }
  @keyframes scan-line {
    0%   { top: 0%; }
    50%  { top: 100%; }
    100% { top: 0%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes blink-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  @keyframes grid-drift {
    0%   { background-position: 0 0; }
    100% { background-position: 48px 48px; }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(28px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes halo-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .kiosk-root {
    font-family: 'Syne', sans-serif;
    background: var(--teal-dark);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
  }

  /* ── Noise + grid overlay ─────────────────────────────── */
  .kiosk-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(134,255,249,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(134,255,249,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: grid-drift 12s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Radial spotlight ─────────────────────────────────── */
  .spotlight {
    position: absolute;
    width: 900px; height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(134, 255, 249, 0.17) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Corner decorations ───────────────────────────────── */
  .corner {
    position: absolute;
    width: 80px; height: 80px;
    pointer-events: none;
    z-index: 1;
  }
  .corner::before, .corner::after {
    content: '';
    position: absolute;
    background: var(--teal-glow);
    opacity: 0.45;
  }
  .corner-tl { top: 24px; left: 24px; }
  .corner-tr { top: 24px; right: 24px; transform: scaleX(-1); }
  .corner-bl { bottom: 24px; left: 24px; transform: scaleY(-1); }
  .corner-br { bottom: 24px; right: 24px; transform: scale(-1); }
  .corner::before { top: 0; left: 0; width: 2px; height: 40px; }
  .corner::after  { top: 0; left: 0; width: 40px; height: 2px; }

  /* ── Clock block (bottom-left) ────────────────────────── */
  .clock-block {
    position: absolute;
    top: 37px; left: 36px;
    z-index: 10;
    text-align: left;
  }
  .clock-time {
    font-family: 'DM Mono', monospace;
    font-size: 2.4rem;
    font-weight: 500;
    color: var(--teal-glow);
    letter-spacing: 0.04em;
    line-height: 1;
    text-shadow: 0 0 18px rgba(134,255,249,0.5);
  }
  .clock-date {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .clock-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--teal-glow);
    margin-right: 8px;
    vertical-align: middle;
    animation: blink-dot 1.2s ease-in-out infinite;
    box-shadow: 0 0 8px var(--teal-glow);
  }

  /* ── Status badge (top-right) ─────────────────────────── */
  .status-badge {
    position: absolute;
    top: 28px; right: 32px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(134,255,249,0.07);
    border: 1px solid rgba(134,255,249,0.2);
    border-radius: 100px;
    padding: 6px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    backdrop-filter: blur(8px);
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4eff91;
    box-shadow: 0 0 8px #4eff91;
    animation: blink-dot 2s ease-in-out infinite;
  }

  /* ── Logo orbit system ────────────────────────────────── */
  .logo-wrap {
    position: relative;
    width: 200px; height: 200px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 36px;
    animation: float 5s ease-in-out infinite;
  }
  .logo-core {
    position: relative;
    z-index: 3;
    width: 90px; height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, oklch(60.59% 0.10198 199.112), #013a37);
    border: 2px solid rgba(134,255,249,0.4);
    display: flex; align-items: center; justify-content: center;
    box-shadow:
      0 0 0 8px rgba(134,255,249,0.07),
      0 0 40px rgba(134,255,249,0.2),
      inset 0 1px 0 rgba(134,255,249,0.3);
  }
  .logo-emoji { font-size: 2.4rem; filter: drop-shadow(0 0 8px rgba(134,255,249,0.6)); }

  .pulse-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid var(--teal-glow);
    animation: pulse-ring 2.8s ease-out infinite;
  }
  .pulse-ring-1 { width: 100px; height: 100px; animation-delay: 0s; }
  .pulse-ring-2 { width: 100px; height: 100px; animation-delay: 0.9s; opacity: 0.5; }
  .pulse-ring-3 { width: 100px; height: 100px; animation-delay: 1.8s; opacity: 0.3; }

  .orbit-dot {
    position: absolute;
    top: 50%; left: 50%;
    width: 8px; height: 8px;
    border-radius: 50%;
    margin: -4px;
    background: var(--teal-glow);
    box-shadow: 0 0 10px var(--teal-glow);
  }
  .orbit-dot-1 { animation: orbit  7s linear infinite; }
  .orbit-dot-2 { animation: orbit2 10s linear infinite; opacity: 0.7; }
  .orbit-dot-3 { animation: orbit3 14s linear infinite; opacity: 0.5; }

  /* halo ring around orbit */
  .orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px dashed rgba(134,255,249,0.12);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
  .orbit-ring-1 { width: 228px; height: 228px; }
  .orbit-ring-2 { width: 304px; height: 304px; }
  .orbit-ring-3 { width: 372px; height: 372px; }

  /* ── Heading ──────────────────────────────────────────── */
  .kiosk-title {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 10px;
  }
  .kiosk-title .brand {
    background: linear-gradient(90deg, var(--teal-glow), oklch(60.59% 0.10198 199.112));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .kiosk-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 52px;
  }

  /* ── Action cards ─────────────────────────────────────── */
  .cards-row {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    width:100vh;
  }

  .action-card {
    position: relative;
    width: 240px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 20px;
    padding: 32px 22px 28px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    text-align: center;
    backdrop-filter: blur(16px);
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease, border-color 0.25s ease;
    overflow: hidden;
    opacity: 0;
  }
  .action-card.visible {
    animation: card-in 0.5s cubic-bezier(.34,1.56,.64,1) forwards;
  }
  .action-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(134,255,249,0.06) 0%, transparent 60%);
    pointer-events: none;
    border-radius: inherit;
  }
  /* scan-line shimmer on hover */
  .action-card::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--teal-glow), transparent);
    top: -2px;
    transition: top 0s;
    opacity: 0;
  }
  .action-card:hover::after {
    opacity: 1;
    animation: scan-line 1.4s linear infinite;
  }
  .action-card:hover {
    transform: translateY(-6px) scale(1.03);
    border-color: rgba(134,255,249,0.5);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 32px rgba(134,255,249,0.12);
  }

  .card-icon-wrap {
    width: 64px; height: 60px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .card-icon-wrap::after {
    content: '';
    position: absolute; inset: -2px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(134,255,249,0.3), transparent 60%);
    z-index: -1;
  }
  .card-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 0.01em;
  }
  .card-desc {
    font-family: 'DM Mono', monospace;
    font-size: 0.80rem;
    color: var(--text-muted);
    line-height: 1.6;
    letter-spacing: 0.03em;
  }
  .card-arrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: var(--teal-glow);
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    text-transform: uppercase;
  }
  .action-card:hover .card-arrow {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Bottom bar ───────────────────────────────────────── */
  .bottom-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      transparent 0%,
      oklch(60.59% 0.10198 199.112) 25%,
      var(--teal-glow) 50%,
      oklch(60.59% 0.10198 199.112) 75%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  /* ── EKG line decoration ──────────────────────────────── */
  .ekg-line {
    position: absolute;
    bottom: 32px; right: 32px;
    opacity: 0.18;
    pointer-events: none;
  }

  /* ── Tap hint ─────────────────────────────────────────── */
  .tap-hint {
    font-family: 'DM Mono', monospace;
    font-size: 0.80rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(195, 248, 245, 0.54);
    margin-top: 38px;
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "kiosk-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = GLOBAL_STYLES;
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  return null;
}

// ─── EKG SVG decoration ───────────────────────────────────────────────────────
function EkgLine() {
  return (
    <svg className="ekg-line" width="180" height="40" viewBox="0 0 180 40">
      <polyline
        points="0,20 20,20 30,8 40,32 50,8 60,32 70,20 90,20 95,12 100,28 105,20 180,20"
        fill="none"
        stroke="#86fff9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Logo with orbital dots ───────────────────────────────────────────────────
function OrbitalLogo() {
  return (
    <div className="logo-wrap">
      <div className="orbit-ring orbit-ring-1" />
      <div className="orbit-ring orbit-ring-2" />
      <div className="orbit-ring orbit-ring-3" />
      <div className="orbit-dot orbit-dot-1" />
      <div className="orbit-dot orbit-dot-2" />
      <div className="orbit-dot orbit-dot-3" />
      <div className="pulse-ring pulse-ring-1" />
      <div className="pulse-ring pulse-ring-2" />
      <div className="pulse-ring pulse-ring-3" />
      <div className="logo-core">
        <img src="/images/logo-white.png" className="logo-emoji" alt="💊"/>
      </div>
    </div>
  );
}

// ─── Action Card ──────────────────────────────────────────────────────────────
function ActionCard({
  icon,
  iconBg,
  title,
  tagalog,
  description,
  onClick,
  animDelay = 0,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  tagalog: string;
  description: string;
  onClick: () => void;
  animDelay?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div className={`action-card${visible ? " visible" : ""}`}
      style={{ animationDelay: `${animDelay}ms` }} onClick={onClick} >
      <div className="card-icon-wrap" style={{ background: iconBg }}>
        {icon}
      </div>
      <div>
        <div className="card-title">{tagalog}</div>
        <div>{title}</div>
        <div className="card-desc" style={{ marginTop: 6 }}>{description}</div>
      </div>
      <div className="card-arrow">Tap to start →</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function KioskLanding({ onEnterBrowse }: KioskLandingProps) {
  const [clock, setClock] = useState(new Date());
  const [showPrescriptionScanner, setShowPrescriptionScanner] = useState(false);
  const [showMedicineScanner, setShowMedicineScanner] = useState(false);
  // const [showCustomerMode, setShowCustomerMode] = useState(false);

  // if (showCustomerMode) {
  //   return <CustomerMode />;
  // }

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = clock.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <StyleInjector />

      <div className="kiosk-root">
        <div className="spotlight" />

        {/* Corner brackets */}
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />

        {/* Status badge — top right */}
        <div className="status-badge">
          <div className="status-dot" />
          System Online
        </div>

        {/* Clock — bottom left */}
        <div className="clock-block">
          <div className="clock-time">
            <span className="clock-dot" />
            {timeStr}
          </div>
          <div className="clock-date">{dateStr}</div>
        </div>

        {/* EKG decoration — bottom right */}
        <EkgLine />

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: 780 }}>
          <OrbitalLogo />

          <h1 className="kiosk-title">
            Welcome to{" "}
            <span className="brand">QiMedSc Kiosk</span>
          </h1>
          <p className="kiosk-sub">Self-Service Pharmacy Assistant</p>

          <div className="cards-row">
            <ActionCard
              icon={<FileText size={26} color="#86fff9" />}
              iconBg="linear-gradient(135deg, oklch(60.59% 0.10198 199.112), #013a37)"
              title="Scan Prescription"
              tagalog="Is-kan ang Reseta"
              description="scan your doctor's prescription"
              onClick={() => setShowPrescriptionScanner(true)}
              animDelay={100}
            />
            <ActionCard
              icon={<Scan size={26} color="#86fff9" />}
              iconBg="linear-gradient(135deg, #0a4f4c, #013a37)"
              title="Scan Medicine"
              tagalog="Is-kan ang Gamot"
              description="Scan a medicine label or packaging"
              onClick={() => setShowMedicineScanner(true)}
              animDelay={220}
            />
            <ActionCard
              icon={<LayoutGrid size={26} color="#86fff9" />}
              iconBg="linear-gradient(135deg, #05302e, #013a37)"
              title="Browse Catalogue"
              tagalog="Maghanap ng Gamot"
              description="Explore our full medicine catalogue"
              onClick={onEnterBrowse}
              animDelay={340}
            />
          </div>

          <p className="tap-hint">— Tap a card to get started —</p>
        </div>

        <div className="bottom-bar" />
      </div>

      <PrescriptionScanner
        open={showPrescriptionScanner}
        onOpenChange={setShowPrescriptionScanner}
        onBrowser={onEnterBrowse}

      />
      <MedicineScannerModal
        open={showMedicineScanner}
        onOpenChange={setShowMedicineScanner}
        onBrowse={onEnterBrowse}
      />
    </>
  );
}