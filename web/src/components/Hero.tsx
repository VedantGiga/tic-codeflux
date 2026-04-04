import { useRef } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { motion } from "motion/react";
import BlurText from "./BlurText";
import MedicineModel from "./MedicineModel";
import ScrollFrames from "./ScrollFrames";

const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null!);

  return (
    <div ref={scrollContainerRef} className="hero-scroll-container">
      {/* Sticky viewport — stays on screen over the 250vh scroll range */}
      <div className="hero-sticky-viewport">
        {/* Background: Scroll-driven frames */}
        <div className="hero-frames-bg absolute inset-0 opacity-20 dark:opacity-100 transition-opacity duration-700">
          <ScrollFrames sectionRef={scrollContainerRef} />
          {/* Top gradient for Navbar blending */}
          <div className="hero-gradient-top" />
          {/* Light-mode specific gradient for text readability (White from left) */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent dark:from-transparent dark:via-transparent z-[1] transition-all duration-700" />
          {/* Bottom gradient for section transition */}
          <div className="hero-gradient-bottom" />
        </div>

        {/* Foreground: Content Layer */}
        <section id="hero" className="hero-content-layer relative z-10 w-full h-full pointer-events-none">
          {/* MOBILE VIEW */}
          <div className="flex lg:hidden flex-col items-center text-center w-full px-6 pt-[120px] pb-10 pointer-events-auto">
            {/* Badge */}
            <div className="liquid-glass rounded-full flex items-center gap-2 px-1.5 py-1 mb-6">
              <span className="bg-foreground text-background rounded-full px-2 py-0.5 text-[10px] font-medium font-body uppercase tracking-wide">
                New
              </span>
              <span className="text-foreground/80 text-xs font-body pr-2">
                AI-powered medication care.
              </span>
            </div>

            {/* Heading */}
            <BlurText
              text="Never Miss a Dose Again"
              className="text-4xl font-heading italic text-foreground leading-[0.9] tracking-[-2px]"
            />

            {/* Subtext */}
            <motion.p
              className="mt-5 text-foreground/80 dark:text-foreground/60 font-body font-light text-sm max-w-[85%]"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Smart reminders. Gentle nudges. Peace of mind for families.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col w-full gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <button className="liquid-glass-strong w-full rounded-2xl px-6 py-4 text-sm font-medium font-body text-foreground flex items-center justify-center gap-2">
                Try CareDose Free
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="liquid-glass w-full rounded-2xl px-6 py-4 text-sm font-medium font-body text-foreground/80 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                See How It Works
              </button>
            </motion.div>
          </div>


          {/* 
            =========================================
            DESKTOP VIEW (Original Unchanged Design) 
            =========================================
          */}
          <div className="hidden lg:flex flex-row items-start justify-between pt-[150px] px-16 xl:px-24 h-full pointer-events-auto">
            {/* Left: Text + CTAs */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              {/* Badge */}
              <div className="liquid-glass rounded-full flex items-center gap-2 px-1.5 py-1 mb-8">
                <span className="bg-foreground text-background rounded-full px-2.5 py-0.5 text-xs font-medium font-body">
                  New
                </span>
                <span className="text-foreground/80 text-sm font-body pr-3">
                  AI-powered medication care for loved ones.
                </span>
              </div>

              {/* Heading */}
              <BlurText
                text="Never Miss a Dose Again"
                className="text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] tracking-[-4px] max-w-4xl"
              />

              {/* Subtext */}
              <motion.p
                className="mt-8 text-foreground/80 dark:text-foreground/60 font-body font-light text-lg max-w-xl"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Smart reminders. Gentle nudges. Peace of mind for families.
                CareDose AI keeps your loved ones safe at home.
              </motion.p>

              {/* CTA */}
              <motion.div
                className="flex items-center gap-4 mt-10"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <button className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-foreground flex items-center gap-2 hover:bg-foreground/5 transition-colors">
                  Try CareDose Free
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="rounded-full px-6 py-3 text-sm font-medium font-body text-foreground/80 flex items-center gap-2 hover:text-foreground transition-colors">
                  <Play className="w-4 h-4" />
                  See How It Works
                </button>
              </motion.div>
            </div>

            {/* Right: 3D Medicine Model — above everything */}
            <motion.div
              className="absolute w-[45%] xl:w-[40%] aspect-square pointer-events-auto"
              style={{ right: "-100px", bottom: "-90px", zIndex: 20, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <MedicineModel />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;

