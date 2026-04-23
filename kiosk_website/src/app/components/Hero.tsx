import { useState, useEffect } from "react";

const SCAN_STEPS = [
  { label: "Scanning prescription...", progress: 25, color: "from-cyan-500 to-blue-500" },
  { label: "Running OCR analysis...", progress: 55, color: "from-blue-500 to-violet-500" },
  { label: "Validating dosage...", progress: 80, color: "from-violet-500 to-emerald-400" },
  { label: "Ready to dispense", progress: 100, color: "from-emerald-400 to-cyan-400" },
];

const DRUGS = [
  { name: "Amoxicillin 500mg", qty: "×28 caps", status: "available" },
  { name: "Metformin 850mg", qty: "×60 tabs", status: "available" },
  { name: "Lisinopril 10mg", qty: "×30 tabs", status: "low" },
];

export function Hero() {
  const [scanStep, setScanStep] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (!animating) return;
    const timer = setInterval(() => {
      setScanStep((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [animating]);

  const current = SCAN_STEPS[scanStep];

  return (
    <section className="relative min-h-screen flex items-center bg-[#080C14] text-white overflow-hidden pt-24">
      {/* Background mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-violet-600/8 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center px-6 relative z-10 py-16">
        {/* LEFT */}
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Next-Gen Pharmacy Automation
          </div>

          <h1
            className="text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            Smart{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #22d3ee, #818cf8, #34d399)" }}
            >
              Prescription
            </span>
            <br />
            Processing
            <br />
            <span className="text-slate-300">at Scale</span>
          </h1>

          <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
            AI-powered kiosk that scans, validates, and dispenses prescriptions with
            near-perfect accuracy — eliminating wait times and human error across your pharmacy.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#contact"
              className="relative inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white flex items-center gap-2">
                Start Now
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Explore Features
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6">
            {["HIPAA Compliant", "FDA Registered", "ISO 27001"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – Kiosk Mockup */}
        <div className="relative flex justify-center">
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative w-full max-w-sm">
            {/* Device shell */}
            <div className="relative bg-gradient-to-b from-[#141c2e] to-[#0d1223] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-300">PharmaScan Kiosk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                </div>
              </div>

              {/* Scan zone */}
              <div className="relative mx-4 mt-4 h-44 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f1e] flex flex-col items-center justify-center cursor-pointer group">
                {/* Corner accents */}
                {[
                  "top-2 left-2 border-t-2 border-l-2 rounded-tl",
                  "top-2 right-2 border-t-2 border-r-2 rounded-tr",
                  "bottom-2 left-2 border-b-2 border-l-2 rounded-bl",
                  "bottom-2 right-2 border-b-2 border-r-2 rounded-br",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 border-cyan-400 ${cls}`} />
                ))}

                {/* Scan line animation */}
                <div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"
                  style={{
                    animation: "scanLine 2s ease-in-out infinite",
                    top: "0%",
                  }}
                />

                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-xs font-medium">Place Prescription</span>
                  <span className="text-slate-600 text-[10px]">or tap to upload</span>
                </div>

                <style>{`
                  @keyframes scanLine {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                  }
                `}</style>
              </div>

              {/* Progress */}
              <div className="px-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-400 font-medium">{current.label}</span>
                  <span className="text-[10px] text-cyan-400 font-semibold">{current.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${current.color} transition-all duration-700`}
                    style={{ width: `${current.progress}%` }}
                  />
                </div>
              </div>

              {/* Drug list */}
              <div className="px-4 py-4 space-y-2 mt-1">
                {DRUGS.map((drug) => (
                  <div
                    key={drug.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-1.5 h-5 rounded-full ${
                          drug.status === "available" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[11px] text-slate-300 font-medium">{drug.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{drug.qty}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          drug.status === "available"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {drug.status === "available" ? "IN STOCK" : "LOW"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dispense button */}
              <div className="px-4 pb-5">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
                  Dispense Medications
                </button>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -left-12 top-16 bg-[#141c2e]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl hidden lg:block">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                0.5<span className="text-sm text-cyan-400">s</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Processing Time</div>
            </div>

            <div className="absolute -right-10 bottom-24 bg-[#141c2e]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl hidden lg:block">
              <div className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                99.9<span className="text-sm text-emerald-400">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080C14] to-transparent pointer-events-none" />
    </section>
  );
}
