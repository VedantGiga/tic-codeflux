import { motion } from "motion/react";
import {
  Phone, MessageSquare, FileText, Brain, Bell, Users,
  Heart, ShieldCheck, Mic, Globe, BarChart3, Clock,
} from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const heroFeatures = [
  {
    icon: Phone,
    title: "Voice Call Reminders",
    description:
      "Automated phone calls in simple, local language remind your loved ones to take their medicine—no smartphone needed.",
  },
  {
    icon: MessageSquare,
    title: "SMS Notifications",
    description:
      "Text-based reminders sent at the right time, with easy reply options to confirm doses were taken.",
  },
  {
    icon: FileText,
    title: "AI Prescription Scanning",
    description:
      "Upload a prescription photo and our AI extracts medicine names, dosages, and schedules automatically.",
  },
  {
    icon: Brain,
    title: "Smart Dose Tracking",
    description:
      "The system asks for confirmation after each reminder and logs responses to track adherence over time.",
  },
  {
    icon: Users,
    title: "Family & Caregiver Alerts",
    description:
      "If a dose is missed or there's no response, family members are instantly notified via call, SMS, or app.",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA-Compliant Security",
    description:
      "All health data is encrypted end-to-end. Your family's medical information stays private and secure.",
  },
];

const additionalFeatures = [
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Elderly users can confirm doses by simply speaking—no typing or tapping required.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Reminders in Hindi, English, Tamil, Bengali, and more regional languages.",
  },
  {
    icon: Bell,
    title: "Intelligent Escalation",
    description: "Missed dose? The system retries, then alerts caregivers in a smart priority chain.",
  },
  {
    icon: Heart,
    title: "Health Reports",
    description: "Weekly and monthly adherence reports sent to family members for complete visibility.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Caregivers get a real-time dashboard showing dose history, patterns, and trends.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Set reminders for any schedule—daily, twice a day, weekly, or custom intervals.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Features = () => {
  return (
    <div className="bg-background min-h-screen">
      <PageNavbar />

      {/* Hero */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-6 md:px-16 lg:px-24 text-center">
        <div className="section-badge">Features</div>
        <h1 className="section-heading mt-4 max-w-4xl mx-auto text-3xl md:text-5xl lg:text-6xl">
          Everything your care needs. Nothing it doesn't.
        </h1>
        <p className="mt-4 md:mt-6 text-foreground/60 font-body font-light text-base md:text-lg max-w-2xl mx-auto">
          CareDose AI combines voice calls, SMS, prescription scanning, and family alerts
          into one simple system—designed for elderly users who don't need complex apps.
        </p>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {heroFeatures.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              className="liquid-glass rounded-2xl p-8"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-heading italic text-foreground mb-3">{title}</h3>
              <p className="text-foreground/60 font-body font-light text-sm leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it helps section */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge">Designed for Simplicity</div>
            <h2 className="section-heading mt-4">No app needed. Just a phone.</h2>
            <p className="mt-6 text-foreground/60 font-body font-light text-sm max-w-lg mx-auto">
              Your loved ones don't need to install anything, learn any app, or even own a smartphone.
              CareDose works through regular phone calls and SMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                className="liquid-glass rounded-2xl p-6"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-heading italic text-foreground mb-2">{title}</h3>
                <p className="text-foreground/60 font-body font-light text-sm">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
