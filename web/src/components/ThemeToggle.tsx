import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative liquid-glass w-10 h-10 rounded-full flex items-center justify-center border border-border/50 hover:bg-foreground/5 transition-colors overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 90,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Moon className="w-4 h-4 text-foreground" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: theme === "light" ? 1 : 0,
          opacity: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : -90,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Sun className="w-4 h-4 text-foreground" />
      </motion.div>
    </button>
  );
}
