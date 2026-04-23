import { useState } from "react";
import "./App.css";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "System", href: "#system" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-slate-900 font-bold text-xl tracking-tight">
          Pharma<span className="text-blue-600">Scan</span>
        </h1>

        <ul className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="hover:text-blue-600 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Request Demo
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 text-slate-900 overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-100 blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6 relative z-10">
        {/* LEFT - Copy */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Next-Gen Pharmacy Automation
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
            Smart Prescription <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Processing System
            </span>
          </h1>

          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            AI-powered kiosk for fast prescription scanning, dosage validation,
            and precise medicine dispensing. Designed for zero errors and zero wait time.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              Start Now
            </a>
            <a href="#features" className="bg-white text-slate-700 px-8 py-3.5 rounded-full font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Explore Features
            </a>
          </div>
        </div>

        {/* RIGHT - UI Device Mockup */}
        <div className="relative mx-auto w-full max-w-md">
          {/* Decorative ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-teal-100 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50"></div>
          
          <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-blue-900/10">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <span className="text-sm font-semibold text-slate-800">Scanner Status</span>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Active
              </div>
            </div>

            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl text-blue-600 transition-colors hover:bg-blue-50 cursor-pointer">
              <svg className="w-12 h-12 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="font-medium">Insert Prescription</span>
              <span className="text-xs text-blue-400 mt-1">or tap to upload image</span>
            </div>

            <div className="mt-6 flex justify-around text-xs font-medium text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                OCR AI
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Validation
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Inventory
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Optical Character Recognition",
      desc: "Instantly digitizes handwritten and printed prescriptions with 99.9% accuracy.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    {
      title: "Clinical Dosage Validation",
      desc: "Cross-references patient data to ensure prescriptions fall within safe dosage parameters.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    },
    {
      title: "Smart Drug Matching",
      desc: "Automatically maps prescribed items to available pharmacy inventory in real-time.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    },
    {
      title: "Queue Optimization",
      desc: "Reduces patient waiting times by automating backend pharmacist workflows.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
  ];

  return (
    <section id="features" className="bg-white text-slate-900 px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Capabilities</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Intelligent System Features</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold mb-3 text-lg">
                {f.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function System() {
  return (
    <section id="system" className="relative bg-blue-600 text-white px-6 py-32 overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
          Built for Absolute Accuracy
        </h2>

        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          PharmaScan seamlessly integrates enterprise-grade AI recognition, real-time prescription tracking,
          and robust validation mechanisms. Prevent human error, ensure regulatory compliance,
          and radically improve your pharmacy's operational efficiency.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-blue-500 pt-10">
           <div className="text-center">
             <div className="text-3xl font-black mb-1">99.9%</div>
             <div className="text-blue-200 text-sm">Scan Accuracy</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black mb-1">0.5s</div>
             <div className="text-blue-200 text-sm">Processing Time</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black mb-1">HIPAA</div>
             <div className="text-blue-200 text-sm">Fully Compliant</div>
           </div>
           <div className="text-center">
             <div className="text-3xl font-black mb-1">24/7</div>
             <div className="text-blue-200 text-sm">Uptime</div>
           </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  return (
    <section id="contact" className="bg-slate-50 text-slate-900 px-6 py-24">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-slate-900">
            Request a Demo
          </h2>
          <p className="text-slate-500 text-sm">
            See how PharmaScan can transform your pharmacy workflow.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              placeholder="Dr. Jane Doe"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
            <input
              type="email"
              placeholder="jane@pharmacy.com"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1.5">How can we help?</label>
            <textarea
              placeholder="Tell us about your current prescription volume..."
              rows={4}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm resize-none"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-2">
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-white font-bold text-xl tracking-tight">
          Pharma<span className="text-blue-500">Scan</span>
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} PharmaScan Systems Inc. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="font-sans antialiased text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <Features />
      <System />
      <Contact />
      <Footer />
    </div>
  );
}