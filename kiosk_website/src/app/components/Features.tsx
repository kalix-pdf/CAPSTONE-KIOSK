const FEATURES = [
  {
    title: "Optical Character Recognition",
    desc: "Instantly digitizes handwritten and printed prescriptions with 99.9% accuracy using advanced deep learning models.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    tag: "AI-Powered",
  },
  {
    title: "Clinical Dosage Validation",
    desc: "Cross-references patient data against WHO guidelines to ensure every prescription falls within safe dosage parameters.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    tag: "Safety-First",
  },
  {
    title: "Smart Drug Matching",
    desc: "Automatically maps prescribed items to real-time pharmacy inventory with intelligent substitution suggestions.",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    tag: "Real-Time",
  },
  {
    title: "Queue Optimization",
    desc: "ML-driven workflow scheduling reduces patient wait times by up to 78% and automates backend pharmacist tasks.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    tag: "Efficient",
  },
  {
    title: "Drug Interaction Alerts",
    desc: "Instantly flags potentially harmful drug combinations and alerts pharmacists before dispensing occurs.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    gradient: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    tag: "Alert System",
  },
  {
    title: "Secure Patient Records",
    desc: "End-to-end encrypted, HIPAA-compliant patient data management with audit trails and role-based access control.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    tag: "HIPAA",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-[#080C14] text-white px-6 py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-white/10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
            Capabilities
          </div>
          <h2
            className="text-4xl md:text-5xl text-white mb-5 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            Intelligent System Features
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every feature is engineered for clinical precision, regulatory compliance,
            and seamless integration into your existing pharmacy workflow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`relative group p-7 rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-default`}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${f.iconBg} blur-2xl`} />

              <div className="relative z-10">
                {/* Tag */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 ${f.iconBg} border ${f.border} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${f.iconBg} ${f.iconColor} border ${f.border}`}>
                    {f.tag}
                  </span>
                </div>

                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.05rem" }}
                >
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>

                {/* Arrow */}
                <div className={`mt-5 flex items-center gap-1.5 text-xs font-semibold ${f.iconColor} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0`}>
                  <span>Learn more</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
