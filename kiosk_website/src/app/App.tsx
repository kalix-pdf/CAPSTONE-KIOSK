import "../styles/fonts.css";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsBar } from "./components/StatsBar";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { System } from "./components/System";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div
      className="antialiased selection:bg-cyan-400/20 selection:text-cyan-300"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#080C14", color: "#f8fafc" }}
    >
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <System />
      <Contact />
      <Footer />
    </div>
  );
}
