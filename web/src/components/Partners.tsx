import { Heart, ShieldCheck, Stethoscope, Building2, Pill } from "lucide-react";

const partners = [
  { name: "Mayo Clinic", icon: Stethoscope },
  { name: "CVS Health", icon: Heart },
  { name: "Walgreens", icon: Pill },
  { name: "AARP", icon: Building2 },
  { name: "Philips", icon: ShieldCheck },
];

const Partners = () => {
  return (
    <section className="relative z-10 flex flex-col items-center py-16 px-6 bg-background">
      <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-foreground font-body inline-block mb-8">
        Trusted by caregivers & health partners
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {partners.map(({ name, icon: Icon }) => (
          <div key={name} className="flex items-center gap-2 md:gap-3 group">
            <div className="liquid-glass-strong rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group-hover:bg-foreground/5 transition-colors">
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-foreground/70" />
            </div>
            <span className="text-lg md:text-3xl font-heading italic text-foreground">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;

