import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const BlurText = ({ text, className = "", delay = 0 }: BlurTextProps) => {
  const words = text.split(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isInView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : {}
          }
          transition={{
            duration: 0.35,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};

export default BlurText;

