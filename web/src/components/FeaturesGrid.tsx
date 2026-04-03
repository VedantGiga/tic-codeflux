import { Bell, Heart, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Timely alerts via voice, text, or app—never miss a dose.",
  },
  {
    icon: Heart,
    title: "Health Tracking",
    description: "Monitor adherence and spot patterns over time.",
  },
  {
    icon: Users,
    title: "Family Dashboard",
    description: "Caregivers get real-time updates and missed-dose alerts.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Private",
    description: "HIPAA-compliant. Your health data stays yours.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-background">
      <div className="text-center mb-16">
        <div className="section-badge">Why CareDose</div>
        <h2 className="section-heading mt-4">Everything your care needs.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="liquid-glass rounded-2xl p-6">
            <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-lg font-heading italic text-foreground mb-2">
              {title}
            </h3>
            <p className="text-foreground/60 font-body font-light text-sm">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;

