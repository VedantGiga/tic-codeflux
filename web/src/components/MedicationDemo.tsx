import { motion, useInView } from "motion/react";
import { useRef } from "react";
import PhoneCallAnimation from "./PhoneCallAnimation";

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

        {/* Phone mockup with Vibration Animation */}
        <div ref={ref} className="flex-1 flex justify-center w-full">
          {isInView && <PhoneCallAnimation />}
        </div>
      </div>
    </section>
  );
};

export default MedicationDemo;

