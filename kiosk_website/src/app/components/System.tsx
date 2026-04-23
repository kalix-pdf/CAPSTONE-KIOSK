const pharmacyImg = "https://images.unsplash.com/photo-1576602976047-174e57a47881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaGFybWFjeSUyMGludGVyaW9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Njk1MDI4Mnww&ixlib=rb-4.1.0&q=80&w=1080";
const techImg = "https://images.unsplash.com/photo-1758691463203-cce9d415b2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGRpZ2l0YWwlMjBoZWFsdGh8ZW58MXx8fHwxNzc2OTUwMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const PILLARS = [
  {
    title: "Enterprise-Grade AI",
    desc: "Built on transformer-based models trained on 40M+ prescriptions across 120 languages.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Real-Time Tracking",
    desc: "Live prescription status, queue position, and dispensing alerts sent directly to patients.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Regulatory Compliance",
    desc: "Automatic adherence to HIPAA, DEA, FDA, and international pharmaceutical standards.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export function System() {
  return (
    <section id="system" className="bg-[#080C14] text-white px-6 py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-600/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* TOP: Image pair */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24 items-end">
          {/* Large image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={pharmacyImg}
              alt="Modern pharmacy interior"
              className="w-full h-80 object-cover rounded-3xl border border-white/5 group-hover:border-cyan-500/20 transition-colors duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080C14]/60 to-transparent rounded-3xl" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PharmaScan deployed at MedCity General Hospital, 2025
              </div>
            </div>
          </div>

          {/* Side content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-400 text-xs font-semibold uppercase tracking-widest w-fit">
              Platform
            </div>
            <h2
              className="text-4xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Built for Absolute <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #22d3ee, #818cf8)" }}>Accuracy</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              PharmaScan seamlessly integrates enterprise-grade AI recognition, real-time prescription tracking,
              and robust validation mechanisms — preventing human error and ensuring regulatory compliance at every step.
            </p>

            <div className="relative">
              <img
                src={techImg}
                alt="Medical technology"
                className="w-full h-44 object-cover rounded-2xl border border-white/5 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080C14]/80 via-transparent to-transparent rounded-2xl" />
              <div className="absolute inset-0 flex items-center px-6">
                <div>
                  <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    78% faster
                  </div>
                  <div className="text-sm text-slate-400">than traditional pharmacy workflows</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="p-7 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/5 hover:border-white/12 transition-all duration-300 group">
              <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <svg className={`w-5 h-5 ${p.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
                </svg>
              </div>
              <h3
                className="text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.05rem" }}
              >
                {p.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
