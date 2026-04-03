import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const steps = [
  { year: "Phase 1", title: "Smart Reminders", description: "Automated SMS and voice calls for medication schedules." },
  { year: "Phase 2", title: "Family Dashboard", description: "Real-time updates and adherence tracking for caregivers." },
  { year: "Phase 3", title: "AI Prescriptions", description: "Seamless scanning and data extraction from doctors' notes." },
];

const Timeline = () => {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-background text-center">
      <div className="section-badge mb-4">The Process</div>
      <h2 className="section-heading mb-16">How it evolves</h2>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 justify-center">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx} 
            className="liquid-glass p-8 rounded-3xl flex-1 text-left relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
          >
            <div className="liquid-glass-strong w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-2xl font-heading italic text-foreground mb-2">{step.year}</h3>
            <h4 className="text-lg font-medium text-foreground mb-3">{step.title}</h4>
            <p className="text-sm text-foreground/60 leading-relaxed font-body">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
