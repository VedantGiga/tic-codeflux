import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Phone, Check, Bell } from "lucide-react";

const MedicationDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="demo" className="py-32 px-6 md:px-16 lg:px-24 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="section-badge">See It In Action</div>
          <h2 className="section-heading mt-4 max-w-lg">
            A gentle call. A simple confirmation.
          </h2>
          <p className="mt-6 text-foreground/60 font-body font-light text-sm max-w-md">
            CareDose calls your loved ones in their language at the right time. 
            They just press a button to confirm. If they don't respond, you're alerted instantly.
          </p>
        </div>

        {/* Phone mockup */}
        <div ref={ref} className="flex-1 flex justify-center">
          <div className="relative w-[280px] h-[560px]">
            {/* Phone frame */}
            <div className="absolute inset-0 liquid-glass-strong rounded-[3rem] border border-foreground/10 overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center justify-between px-8 pt-4 text-foreground/40 text-xs font-body">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 rounded-sm bg-foreground/30" />
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-background rounded-b-2xl" />

              {/* Content */}
              <div className="flex flex-col items-center justify-center h-full px-6 -mt-4">
                {/* Incoming call animation */}
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {/* Pulse rings */}
                  <div className="relative mb-6">
                    <motion.div
                      className="absolute inset-0 w-20 h-20 rounded-full border border-accent/30"
                      animate={isInView ? { scale: [1, 2], opacity: [0.5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute inset-0 w-20 h-20 rounded-full border border-accent/20"
                      animate={isInView ? { scale: [1, 2.5], opacity: [0.3, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                  </div>

                  <motion.p
                    className="text-foreground font-body font-medium text-base mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                  >
                    CareDose AI
                  </motion.p>
                  <motion.p
                    className="text-foreground/50 font-body font-light text-xs mb-8"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                  >
                    Incoming reminder call...
                  </motion.p>

                  {/* Message bubble */}
                  <motion.div
                    className="liquid-glass rounded-2xl p-4 w-full mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-foreground/80 font-body font-light text-xs leading-relaxed">
                        "Namaste! It's time for your blood pressure medicine. Have you taken it?"
                      </p>
                    </div>
                  </motion.div>

                  {/* Confirm buttons */}
                  <motion.div
                    className="flex gap-3 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 2.2, duration: 0.5 }}
                  >
                    <motion.button
                      className="flex-1 bg-accent/20 rounded-full py-3 text-accent font-body font-medium text-xs flex items-center justify-center gap-2"
                      animate={isInView ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ delay: 3, duration: 0.6 }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Yes, taken
                    </motion.button>
                    <button className="flex-1 liquid-glass rounded-full py-3 text-foreground/60 font-body font-light text-xs">
                      Remind later
                    </button>
                  </motion.div>

                  {/* Confirmed state */}
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-accent/80 font-body text-xs"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 3.5 }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Dose logged • Family notified
                  </motion.div>
                </motion.div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-1 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicationDemo;

