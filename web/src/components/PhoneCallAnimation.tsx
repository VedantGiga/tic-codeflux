import { motion } from "motion/react";
import { Phone, User } from "lucide-react";

const PhoneCallAnimation = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[400px]">
      
      {/* Persistent Ambient Neon Glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-purple-600/10 blur-[60px]"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Circular Ringing Waves (Ripples) strictly synced with double-vibration */}
      {[0, 0.4].map((delayStart, i) => (
        <motion.div
          key={i}
          className="absolute w-80 h-80 rounded-full border-[2px] border-blue-400/40"
          style={{
            boxShadow: "0 0 25px rgba(168, 85, 247, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.3)",
          }}
          animate={{
            scale: [1, 2.5, 2.5],
            opacity: [0.8, 0, 0],
          }}
          transition={{
            duration: 2.5, // Matches the 2.5s loop
            ease: "easeOut",
            times: [0, 0.6, 1], // Ripple grows and fades over 1.5s
            repeat: Infinity,
            delay: delayStart, // Synced to the two buzzes at t=0 and t=0.4
          }}
        />
      ))}

      {/* The Smartphone */}
      <motion.div
        className="relative z-10 w-[280px] h-[560px] rounded-[3rem] border-[6px] border-zinc-800 bg-black shadow-2xl overflow-hidden flex flex-col items-center justify-between py-12"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255,255,255,0.05)",
        }}
        // Double Vibration Animation (bzzt-bzzt)
        animate={{
          x: [0, -3, 3, -3, 0, 0, -3, 3, -3, 0, 0],
          rotate: [0, -1, 1, -1, 0, 0, -1, 1, -1, 0, 0],
        }}
        transition={{
          duration: 2.5, // Total loop is 2.5s
          ease: "easeInOut",
          // Buzz 1: 0 to 0.2 | Pause: 0.2 to 0.4 | Buzz 2: 0.4 to 0.6 | Rest: 0.6 to 2.5
          times: [0, 0.05, 0.1, 0.15, 0.2, 0.4, 0.45, 0.5, 0.55, 0.6, 1],
          repeat: Infinity,
        }}
      >
        {/* Dynamic Island / Top Notch */}
        <div className="absolute top-0 w-full flex justify-center mt-2">
          <div className="w-[80px] h-[24px] bg-zinc-900 rounded-full flex items-center justify-end px-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Caller Info */}
        <div className="flex flex-col items-center mt-12 gap-4">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center shadow-lg border border-zinc-700/50">
            <User className="w-10 h-10 text-zinc-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-heading text-white mb-1">CareDose AI</h3>
            <p className="text-zinc-400 font-body text-sm font-light">Incoming Call...</p>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex w-full justify-between px-10 mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center backdrop-blur-md border border-red-500/30 cursor-pointer hover:bg-red-500/30 transition-colors">
              <Phone className="w-6 h-6 text-red-500 rotate-[135deg]" />
            </div>
            <span className="text-xs text-zinc-400 font-body">Decline</span>
          </div>

          <motion.div className="flex flex-col items-center gap-2"
            animate={{
              y: [0, -5, 0, 0]
            }}
            transition={{
              duration: 3,
              times: [0, 0.1, 0.2, 1],
              repeat: Infinity
            }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-105 transition-transform">
              <Phone className="w-6 h-6 text-black animate-pulse" />
            </div>
            <span className="text-xs text-white font-body font-medium drop-shadow-md">Accept</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneCallAnimation;
