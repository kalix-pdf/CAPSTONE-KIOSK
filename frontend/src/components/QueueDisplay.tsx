import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { QueueDisplay } from "../services/Props";
import { Clock, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminSocket } from "../services/streams/socket";
import { fetchAllOrders, fetchOrders } from "../services/fetchData.api";

// Voice assistance function
 const speak = (text: string) => {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.7;
  utterance.pitch = 1;
  utterance.volume = 1;

  const applyVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("zira") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("google us english")
    );

    if (femaleVoice) utterance.voice = femaleVoice;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = applyVoiceAndSpeak;
  } else {
    applyVoiceAndSpeak();
  }
};


const PulsingDot = () => (
  <span style={{ position: "relative", display: "inline-flex", width: 12, height: 12 }}>
    <span style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: "#4ade80", opacity: 0.6,
      animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"
    }} />
    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#4ade80", display: "block" }} />
  </span>
);

export function QueueDisplay() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<QueueDisplay[]>([]);
  const waitingQueue = orders?.filter(ticket => ticket.status === 1).slice(0, 4);
  const currentlyServing = orders?.filter(ticket => ticket.status === 2);
  const recentlyCalled = orders.filter(t => t.status === 3 || t.status === 4).sort((a, b) => b.order_id - a.order_id).slice(0, 3);

    useAdminSocket({
      ORDER_CREATED: (newOrder) => {
        setOrders((prev) => {
          const exists = prev.some((o) => o.order_id === newOrder.order_id);
          if (exists) return prev;
          return [...prev, newOrder];
        });
      },
      ORDER_UPDATED: (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o.order_id === updatedOrder.order_id ? updatedOrder : o))
        );
        // 
      },
    });
  
    useEffect(() => {
      fetchAllOrders().then(res => {
        setOrders(res);
      }).catch(console.error).finally(() => setLoading(false));
    }, []);
  
    if (loading) return <p>Loading...</p>
  
  const getWaitTime = (joinTime: string | Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(joinTime).getTime()) / 1000 / 60);
    return diff;
  };

  return (
   <div style={{minHeight: "100vh", background: "#0b1411",fontFamily: "'Sora', 'DM Sans', sans-serif",
      padding: "32px 24px"}} className=" relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 40px rgba(74, 222, 128, 0.15); } 50% { box-shadow: 0 0 80px rgba(74, 222, 128, 0.3); } }
        @keyframes numberPop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .queue-card { animation: fadeSlideIn 0.4s ease forwards; }
        .serving-number { animation: numberPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .serving-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .glass { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-32">
          <div>
            <p className="uppercase text-sm mb-4" style={{ color: "rgba(255, 255, 255, 0.95)", fontFamily: "'DM Mono', monospace" }}>
              Pharmacy Queue System </p>
            <h1 className="text-2xl font-bold" style={{ color: "#fff", letterSpacing: "-0.02em" }}>
              Queue Display </h1>
          </div>
          <div className="flex items-center gap-8" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "8px 16px" }}>
            <PulsingDot />
            <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>LIVE</span>
          </div>
        </div>

        {/* Now Serving — Hero */}
        <div className="serving-glow relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(16,185,129,0.04) 100%)",
          border: "1px solid #013a37", borderRadius: 24, padding: "48px 40px", marginBottom: 24, position: "relative", overflow: "hidden"}}>
          <div className="absolute top-0 right-0 left-0" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.6), transparent)" }} />

          <div className="flex items-center justify-between flex-wrap" style={{ gap: 24 }}>
            <div>
              <p className="text-sm font-bold uppercase" 
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.25em", marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
                Now Serving </p>
              {currentlyServing.length > 0 ? (
                speak(`Now serving, ticket number ${currentlyServing[0].queue_number}. Please proceed to the counter`),
                <div className="flex gap-4" style={{ alignItems: "baseline" }}>
                  <span className="font-bold text-lg" style={{ color: "rgba(74,222,128,0.5)" }}>#</span>
                  <span className="serving-number" style={{ color: "#4ade80", fontSize: 120, fontWeight: 800, lineHeight: 1,
                    letterSpacing: "-0.04em", background: "linear-gradient(135deg, #4ade80, #34d399)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {currentlyServing[0].queue_number}
                  </span>
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 48, fontWeight: 700 }}>—</p>
              )}
            </div>
            {currentlyServing.length > 0 && (
              <div style={{ textAlign: "right" }}>
                <div style={{
                  background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
                  borderRadius: 100, padding: "10px 20px", display: "inline-block", marginBottom: 12
                }}>
                  <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 600 }}>💊 Prescription Pickup</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                  Window 3 — Counter A
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Recently Called */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, overflow: "hidden"
          }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>History</p>
              <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>Recently Called</h2>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {recentlyCalled.length > 0 ? recentlyCalled.map((ticket, idx) => (
                <div key={idx} className="queue-card" style={{
                  animationDelay: `${idx * 0.08}s`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)", borderRadius: 14,
                  padding: "14px 18px",
                  border: ticket.status === 4
                    ? "1px solid rgba(251,191,36,0.15)"
                    : "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500,
                      color: ticket.status === 4 ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.4)"
                    }}>
                      #{ticket.queue_number}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                      Prescription Pickup
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace",
                    padding: "4px 10px", borderRadius: 100,
                    background: ticket.status === 4 ? "rgba(251,191,36,0.1)" : "rgba(148,163,184,0.1)",
                    color: ticket.status === 4 ? "#fbbf24" : "rgba(148,163,184,0.7)",
                    border: ticket.status === 4 ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(148,163,184,0.1)"
                  }}>
                    {ticket.status === 4 ? "No Show" : "Called"}
                  </span>
                </div>
              )) : (
                <p style={{ color: "rgba(255,255,255,0.15)", textAlign: "center", padding: "32px 0", fontSize: 14 }}>No recent calls</p>
              )}
            </div>
          </div>

          {/* Waiting Queue */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, overflow: "hidden"
          }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>Upcoming</p>
                <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>Waiting Queue</h2>
              </div>
              <div style={{
                background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)",
                borderRadius: 100, padding: "4px 14px"
              }}>
                <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                  {waitingQueue.length}
                </span>
              </div>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
              {waitingQueue.length > 0 ? waitingQueue.map((ticket, index) => (
                <div key={ticket.order_id} className="queue-card" style={{
                  animationDelay: `${index * 0.07}s`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: index === 0 ? "rgba(96,165,250,0.07)" : "rgba(255,255,255,0.02)",
                  borderRadius: 12, padding: "12px 16px",
                  border: index === 0 ? "1px solid rgba(96,165,250,0.2)" : "1px solid rgba(255,255,255,0.04)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: index === 0 ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: index === 0 ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <span style={{ color: index === 0 ? "#60a5fa" : "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700 }}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p style={{ color: index === 0 ? "#e2e8f0" : "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 600, margin: 0, fontFamily: "'DM Mono', monospace" }}>
                        #{ticket.queue_number}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: 0 }}>Prescription Pickup</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                      {getWaitTime(ticket.created_at)}m
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-base"
                style={{ color: "rgba(255,255,255,0.15)", padding: "32px 0" }}>Queue is empty</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-center" 
        style={{ color: "rgba(255,255,255,0.1)", marginTop: 24, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>
          PHARMACY QUEUE MANAGEMENT — AUTO-REFRESHES EVERY 30s
        </p>
      </div>
    </div>
  );
}
