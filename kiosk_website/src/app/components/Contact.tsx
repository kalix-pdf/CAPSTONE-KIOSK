import { useState } from "react";

const ROLES = [
  "Pharmacist / Pharmacy Manager",
  "Hospital Administrator",
  "Healthcare IT Director",
  "Procurement Officer",
  "Other",
];

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    pharmacy: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-[#0a0f1e] text-white px-6 py-28 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 blur-3xl rounded-full" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-8">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get In Touch
            </div>

            <h2
              className="text-4xl md:text-5xl text-white mb-6 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Request a{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #22d3ee, #818cf8)" }}>
                Live Demo
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              See how PharmaScan transforms your pharmacy's workflow with a personalized walkthrough
              tailored to your facility's needs.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                "Free 30-minute live demo with a pharmacy specialist",
                "Custom ROI analysis for your facility",
                "Full technical integration assessment",
                "No commitment required",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-400 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-3">
              {[
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "Algo.Sales@inquiry.com" },
                { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: "+639298690062" },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-3 text-slate-500 text-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                  </svg>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – Form */}
          <div className="bg-white/3 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                    Request Received!
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Our pharmacy specialist will reach out within 1 business day to schedule your personalized demo.
                  </p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", role: "", pharmacy: "", message: "" }); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Jane Doe"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      Work Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@hospital.com"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Your Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all appearance-none"
                    style={{ color: form.role ? "white" : "#4b5563" }}
                  >
                    <option value="" style={{ background: "#0d1629" }}>Select your role...</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r} style={{ background: "#0d1629" }}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Pharmacy / Institution
                  </label>
                  <input
                    name="pharmacy"
                    value={form.pharmacy}
                    onChange={handleChange}
                    placeholder="MedCity General Hospital"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    How can we help?
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your current prescription volume and challenges..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full relative py-4 rounded-xl overflow-hidden group font-semibold text-sm text-white"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    Submit Demo Request
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>

                <p className="text-center text-xs text-slate-600">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-slate-500 hover:text-slate-400 underline">Privacy Policy</a>.
                  We never share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
