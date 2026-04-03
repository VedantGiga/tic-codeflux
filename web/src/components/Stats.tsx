import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import HlsVideo from "./HlsVideo";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part and suffix/prefix
    const match = value.match(/^([^\d]*)(\d[\d,.]*)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, "");
    const suffix = match[3];
    const target = parseFloat(numStr);
    const hasDecimal = numStr.includes(".");
    const decimalPlaces = hasDecimal ? numStr.split(".")[1].length : 0;
    const hasCommas = match[2].includes(",");

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted: string;
      if (hasDecimal) {
        formatted = current.toFixed(decimalPlaces);
      } else {
        const rounded = Math.round(current);
        formatted = hasCommas ? rounded.toLocaleString() : rounded.toString();
      }

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-foreground">
      {display}
    </div>
  );
};

const stats = [
  { value: "50K+", label: "Seniors helped" },
  { value: "99.2%", label: "Dose adherence" },
  { value: "4.9★", label: "App Store rating" },
  { value: "24/7", label: "Smart monitoring" },
];

const Stats = () => {
  return (
    <section id="stats" className="relative py-16 md:py-32 px-6 md:px-16 lg:px-24 overflow-hidden">
      <HlsVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "saturate(0)" }}
      />
      <div className="video-fade-top" />
      <div className="video-fade-bottom" />

      <div className="relative z-10 flex justify-center">
        <div className="liquid-glass rounded-3xl p-8 md:p-16 w-full max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <AnimatedCounter value={value} />
                <div className="text-foreground/60 font-body font-light text-xs md:text-sm mt-2">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;

