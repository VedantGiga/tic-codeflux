import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import HlsVideo from "./HlsVideo";
import WaterWaves from "./WaterWaves";

const footerColumns = {
  Solutions: [
    { label: "AI Reminders", to: "/features" },
    { label: "Smart Scheduling", to: "/features" },
    { label: "Family Dashboard", to: "/features" },
    { label: "Voice Alerts", to: "/features" },
  ],
  Resources: [
    { label: "Documentation", to: "#" },
    { label: "API Reference", to: "#" },
    { label: "Case Studies", to: "#" },
    { label: "Blog", to: "#" },
  ],
  Company: [
    { label: "About", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Press", to: "#" },
    { label: "Contact", to: "/contact" },
  ],
  Community: [
    { label: "Discord", to: "#" },
    { label: "GitHub", to: "#" },
    { label: "LinkedIn", to: "#" },
    { label: "X (Twitter)", to: "#" },
  ],
};

const CtaFooter = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const footerInView = useInView(footerRef, { once: true, amount: 0.1 });

  return (
    <>
      {/* ── Grand CTA Section ─────────────────────────── */}
      <section className="relative py-32 md:py-40 px-6 md:px-16 lg:px-24 overflow-hidden">
        <HlsVideo
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="video-fade-top" />
        <div className="video-fade-bottom" />

        <div ref={ctaRef} className="relative z-10 flex flex-col items-center text-center">
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-foreground tracking-tight leading-[0.9] max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Care starts with a single step.
          </motion.h2>
          <motion.p
            className="mt-6 text-foreground/60 font-body font-light text-sm md:text-base max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Try CareDose AI free for 30 days. No credit card required.
          </motion.p>
          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-foreground hover:bg-foreground/5 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="bg-foreground text-background rounded-full px-6 py-3 text-sm font-medium font-body hover:bg-foreground/90 transition-colors"
            >
              View Plans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── New Liquid Glass Footer ──────── */}
      <footer className="w-full footer-glass-wrapper text-foreground min-h-[70vh] flex flex-col justify-between pt-6 relative font-body">
        {/* Animated Liquid Waves at the boundary */}
        <WaterWaves />
        {/* Ambient glow */}
        <div className="footer-ambient-glow" />

        {/* Top Header Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-12 w-full text-[13px] md:text-[15px] font-medium tracking-tight relative z-10">
          <div>CareDose AI®</div>
          <div className="hidden md:block">Smart Health + Care</div>
          <div className="hidden md:block">08:53:25 CA, USA</div>
          <div className="flex justify-between w-full text-right md:text-left">
            <div className="flex flex-col gap-1">
              <Link to="/" className="hover:opacity-60 transition-opacity">Work</Link>
              <Link to="/features" className="hover:opacity-60 transition-opacity">Features</Link>
              <Link to="/pricing" className="hover:opacity-60 transition-opacity">Pricing</Link>
              <Link to="/contact" className="hover:opacity-60 transition-opacity">Info</Link>
            </div>
            <Link to="/contact" className="hover:opacity-60 transition-opacity ml-auto">Contact</Link>
          </div>
        </div>

        {/* Middle Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 px-6 md:px-12 mt-16 md:mt-24 z-10 w-full max-w-none">
          {/* Left: Newsletter */}
          <div className="flex flex-col col-span-1 pl-0 md:pl-24">
            <div className="w-5 h-5 bg-foreground rounded-full mb-6 mx-auto md:mx-0 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
            <h3 className="text-[2rem] md:text-4xl lg:text-[3rem] font-heading leading-[1.0] mb-8 md:mb-10 text-center md:text-left tracking-tight">
              Get updates from<br/>CareDose
            </h3>
            <div className="border-b border-foreground/30 pb-2 flex justify-between items-center group cursor-pointer w-full max-w-[280px] mx-auto md:mx-0">
              <span className="text-[15px] opacity-90">Email address</span>
              <ArrowUpRight className="w-4 h-4 opacity-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          {/* Center: Contact Info */}
          <div className="flex flex-col text-[15px] md:text-base gap-8 md:gap-10 mt-4 md:mt-0 text-center md:text-left md:pl-12 opacity-90 font-medium tracking-tight">
            <div>
              <a href="mailto:contact@curedose.com" className="block hover:opacity-60 transition-opacity">contact@curedose.com</a>
              <a href="tel:+18001234567" className="block mt-1 hover:opacity-60 transition-opacity">+1 800 123 4567</a>
            </div>
            <div>
              <p>123 Health Ave</p>
              <p>San Francisco, CA 94103</p>
              <p>United States</p>
            </div>
          </div>

          {/* Right: Links & Legal */}
          <div className="flex flex-col justify-between mt-4 md:mt-0 gap-10 md:gap-12 text-[15px] md:text-base text-center md:text-left md:pl-4 opacity-90 font-medium tracking-tight">
            <div className="flex flex-col gap-4">
              <a className="underline decoration-1 underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer">Have a project? Let's discuss</a>
              <a className="underline decoration-1 underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer">Join our team</a>
            </div>
            
            <div className="flex flex-col gap-2">
              <a className="flex justify-center md:justify-start items-center gap-1.5 hover:opacity-60 transition-opacity cursor-pointer">
                <ArrowUpRight className="w-4 h-4"/> Instagram
              </a>
              <a className="flex justify-center md:justify-start items-center gap-1.5 hover:opacity-60 transition-opacity cursor-pointer">
                <ArrowUpRight className="w-4 h-4"/> LinkedIn
              </a>
            </div>

            <div className="flex flex-col gap-1 mt-auto text-sm opacity-80">
              <p>Privacy Policy</p>
              <p>©2026 CareDose AI</p>
            </div>
          </div>
        </div>

        {/* Huge Bottom Text */}
        <div className="w-full mt-12 md:mt-auto mb-[-4%] md:mb-[-3%] overflow-hidden flex justify-center z-0 pointer-events-none select-none opacity-20">
          <h1 className="text-[20vw] leading-[0.7] font-heading tracking-[-0.05em] text-foreground whitespace-nowrap blur-[2px]">
            CareDose
          </h1>
        </div>

        {/* Circular Animation Badge */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center z-20 cursor-pointer group">
          <div className="absolute w-full h-full rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite] liquid-glass-strong">
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <path id="badgePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text fontSize="14" fontWeight="600" letterSpacing="4.5" fill="currentColor">
                <textPath href="#badgePath" startOffset="0%">
                  CAREDOSE AI ® EST 2026 
                </textPath>
              </text>
            </svg>
          </div>
          <div className="w-4 h-4 md:w-6 md:h-6 bg-foreground rounded-full group-hover:scale-125 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"></div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;

