const STEPS = [
  {
    num: "01",
    title: "Insert Prescription",
    desc: "Patient feeds the physical prescription or uploads a digital image. The kiosk camera captures a high-resolution scan.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    line: "from-cyan-500/40",
  },
  {
    num: "02",
    title: "AI Scans & Validates",
    desc: "OCR engine extracts prescription data. AI validates dosages, checks interactions, and cross-references patient records.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    line: "from-violet-500/40",
  },
  {
    num: "03",
    title: "Inventory Match",
    desc: "System queries real-time inventory. Flags unavailable items and suggests approved generics or substitutes automatically.",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    line: "from-emerald-500/40",
  },
  {
    num: "04",
    title: "Dispense & Record",
    desc: "Automated dispensing unit releases the medications. Every transaction is logged, timestamped, and encrypted securely.",
    icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    line: "from-amber-500/40",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0a0f1e] text-white px-6 py-28 relative">
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Workflow
          </div>
          <h2
            className="text-4xl md:text-5xl text-white mb-5 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            How It Works
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From prescription to dispense in under 30 seconds — a seamless, automated experience.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-amber-500/30" />

          {STEPS.map((step, i) => (
            <div key={step.num} className="relative group">
              <div className="flex flex-col items-center text-center p-7 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/5 hover:border-white/15 transition-all duration-300">
                {/* Icon with number */}
                <div className="relative mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <svg className={`w-6 h-6 ${step.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                    </svg>
                  </div>
                  {/* Step number */}
                  <span
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${step.bg} border ${step.border} ${step.color} text-[9px] font-black flex items-center justify-center`}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Label */}
                <div className={`text-[10px] font-black uppercase tracking-widest ${step.color} mb-3`}>
                  Step {step.num}
                </div>
                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem" }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Mobile connector */}
              {i < STEPS.length - 1 && (
                <div className="lg:hidden flex justify-center my-3">
                  <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
