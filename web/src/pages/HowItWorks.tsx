import { motion } from "motion/react";
import { Upload, Brain, Phone, AlertTriangle, BarChart3, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";


const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Prescription",
    description:
      "A family member or caregiver simply takes a photo of the prescription and uploads it. No manual data entry needed.",
    detail: "Our system accepts photos from any phone camera—even low quality images are processed accurately.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Extracts Details",
    description:
      "Our AI reads the prescription and automatically identifies medicine names, dosages, frequency, and timing.",
    detail: "Supports handwritten and printed prescriptions in multiple languages including regional scripts.",
  },
  {
    number: "03",
    icon: Phone,
    title: "Automated Reminders",
    description:
      "At the scheduled time, CareDose calls or texts the elderly user in their local language with a simple, friendly reminder.",
    detail: "\"Namaste! It's time for your blood pressure medicine. Have you taken it? Press 1 for yes, 2 for no.\"",
  },
  {
    number: "04",
    icon: AlertTriangle,
    title: "Confirmation & Alerts",
    description:
      "The user confirms by pressing a key or replying. If no response or dose is missed, family members are alert immediately.",
    detail: "Smart escalation: retries twice, then alerts the primary caregiver, then the backup contact.",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Track & Report",
    description:
      "Every dose is logged. Caregivers see real-time dashboards and receive weekly adherence reports via email.",
    detail: "Identify patterns—like consistently missed evening doses—so you can adjust routines proactively.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
};

const HowItWorksPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />


      {/* Hero */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-6 md:px-16 lg:px-24 text-center">
        <div className="section-badge">How It Works</div>
        <h1 className="section-heading mt-4 max-w-4xl mx-auto text-3xl md:text-5xl lg:text-6xl">
          From prescription to peace of mind. In five simple steps.
        </h1>
        <p className="mt-4 md:mt-6 text-foreground/60 font-body font-light text-base md:text-lg max-w-2xl mx-auto">
          No apps to install. No tech skills needed. Just upload a prescription and CareDose handles everything—reminders, tracking, and family alerts.
        </p>
      </section>

      {/* Steps */}
      <section className="py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map(({ number, icon: Icon, title, description, detail }, i) => (
            <motion.div
              key={number}
              className="liquid-glass rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="text-5xl font-heading italic text-foreground/20">{number}</div>
                <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mt-4">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-heading italic text-foreground mb-3">{title}</h3>
                <p className="text-foreground/60 font-body font-light text-sm leading-relaxed mb-3">
                  {description}
                </p>
                <p className="text-foreground/40 font-body font-light text-xs italic">
                  {detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading italic text-foreground mb-6">
          Ready to protect your loved ones?
        </h2>
        <Link
          to="/contact"
          className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-medium font-body text-foreground inline-flex items-center gap-2 hover:bg-foreground/5 transition-colors"
        >
          Get Started Free
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default HowItWorksPage;
