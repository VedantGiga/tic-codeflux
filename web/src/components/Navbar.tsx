import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/features" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Pricing", to: "/pricing" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center px-4 lg:px-6">
        <div className="flex items-center w-full max-w-6xl">
          {/* Logo */}
          <Link to="/" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-foreground/10 flex items-center justify-center font-heading italic text-foreground text-xl flex-shrink-0">
            C
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="liquid-glass rounded-full flex items-center gap-1 px-2 py-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-medium font-body px-4 py-2 rounded-full transition-colors ${
                    location.pathname === link.to
                      ? "bg-foreground/10 text-foreground"
                      : "text-foreground/90 hover:bg-foreground/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-border mx-2"></div>
              <Link
                to="/contact"
                className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-foreground/90 transition-colors ml-2 shadow-sm"
              >
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-12" />

          {/* Mobile right side */}
          <div className="flex lg:hidden flex-1 justify-end items-center gap-2">
            <Link
              to="/contact"
              className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-medium font-body flex items-center gap-1 hover:bg-foreground/90 transition-colors"
            >
              Get Started
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-foreground"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-[72px] left-4 right-4 z-40 lg:hidden liquid-glass rounded-2xl p-4 flex flex-col gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium font-body px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === link.to
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/90 hover:bg-foreground/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-border my-2 mx-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;


