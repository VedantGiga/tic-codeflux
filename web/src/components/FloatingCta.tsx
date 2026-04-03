import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingCta = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (1000px)
      setVisible(window.scrollY > 1000);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/contact"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-foreground flex items-center gap-2 hover:bg-foreground/10 transition-colors shadow-lg"
          >
            Try CareDose Free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCta;

