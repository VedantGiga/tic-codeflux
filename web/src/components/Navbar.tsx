import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);

  const pageLinks = [
    { label: "Features", to: "/features" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Pricing", to: "/pricing" },
    { label: "Contact", to: "/contact" },
  ];

  const sectionLinks = [
    { label: "Home", section: "hero" },
    { label: "Features", section: "features" },
    { label: "How It Works", section: "how-it-works" },
    { label: "Stats", section: "stats" },
    { label: "Testimonials", section: "testimonials" },
  ];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

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
              {isHome
                ? sectionLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => scrollToSection(link.section)}
                      className="text-sm font-medium text-foreground/90 font-body px-4 py-2 rounded-full hover:bg-foreground/5 transition-colors"
                    >
                      {link.label}
                    </button>
                  ))
                : pageLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="text-sm font-medium text-foreground/90 font-body px-4 py-2 rounded-full hover:bg-foreground/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
              <Link
                to="/contact"
                className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-foreground/90 transition-colors"
              >
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-12" />

          {/* Mobile right side */}
          <div className="flex lg:hidden flex-1 justify-end items-center gap-3">
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
            {isHome
              ? sectionLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.section)}
                    className="text-sm font-medium text-foreground/90 font-body px-4 py-3 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))
              : pageLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-foreground/90 font-body px-4 py-3 rounded-xl hover:bg-foreground/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

