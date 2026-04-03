import { ArrowUpRight } from "lucide-react";
import HlsVideo from "./HlsVideo";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative min-h-[700px] py-32 px-6 md:px-16 lg:px-24 overflow-hidden">
      <HlsVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="video-fade-top" />
      <div className="video-fade-bottom" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[500px]">
        <div className="section-badge">How It Works</div>
        <h2 className="section-heading mt-4 max-w-3xl">
          Set it once. Never worry again.
        </h2>
        <p className="mt-6 text-foreground/60 font-body font-light text-sm max-w-lg">
          Add medications, set schedules, and let CareDose AI handle the rest—timely
          reminders, refill alerts, and family notifications. All automatic.
        </p>
        <button className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-foreground flex items-center gap-2 mt-10 hover:bg-foreground/5 transition-colors">
          Get Started
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;

