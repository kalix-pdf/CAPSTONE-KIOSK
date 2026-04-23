const LINKS = {
  Product: ["Features", "How It Works", "Pricing", "Changelog", "Roadmap"],
  Company: ["About Us", "Careers", "Press", "Blog", "Partners"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Policy"],
  Support: ["Documentation", "API Reference", "Status Page", "Contact Support"],
};

const SOCIALS = [
  {
    name: "Twitter",
    icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  },
  {
    name: "LinkedIn",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    name: "GitHub",
    icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#060A12] border-t border-white/5 text-slate-400">
      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Ready to modernize your pharmacy?
            </h3>
            <p className="text-slate-500 text-sm">Join 500+ pharmacies already using PharmaScan.</p>
          </div>
          <a
            href="#contact"
            className="relative inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full overflow-hidden group flex-shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white">Book a Free Demo</span>
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Pharma<span className="text-cyan-400">Scan</span>
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              AI-powered prescription processing for modern pharmacies. Precise, fast, and fully compliant.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 hover:border-white/15 transition-all"
                  aria-label={s.name}
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>© {new Date().getFullYear()} PharmaScan Systems Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
            <span>HIPAA Compliant</span>
            <span>SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
