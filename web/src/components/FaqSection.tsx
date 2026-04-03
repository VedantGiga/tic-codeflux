import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What if my parent doesn't pick up the phone?",
    a: "CareDose will automatically retry the call up to two times. If they still don't answer, our smart escalation system will immediately send a WhatsApp message and a push notification to you and any secondary caregivers, ensuring someone is always in the loop.",
  },
  {
    q: "Does it work with feature phones without internet?",
    a: "Yes! That's the beauty of CareDose. Your elderly loved ones only need a basic phone that can receive standard voice calls and SMS. No smartphone, internet connection, or app installation is required for them.",
  },
  {
    q: "Can multiple family members get alerts?",
    a: "Absolutely. You can add secondary caregivers (like a sibling or a nurse) to your dashboard. You can configure it so that everyone gets notified simultaneously, or set up a priority chain where the backup is only alerted if the primary caregiver is unavailable.",
  },
  {
    q: "What languages do the voice calls support?",
    a: "We currently support Hindi, English, Tamil, Bengali, Telugu, Marathi, Gujarati, and Kannada natively. The AI uses natural-sounding regional voices to ensure maximum comfort and comprehension for elderly users.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6 },
  },
};

const FaqSection = () => {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge">FAQ</div>
          <h2 className="section-heading mt-4 text-3xl md:text-5xl lg:text-5xl">
            Answers for your peace of mind.
          </h2>
          <p className="mt-4 md:mt-6 text-foreground/60 font-body font-light text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about how CareDose keeps your loved ones safe.
          </p>
        </div>

        {/* Accordion Container */}
        <motion.div
          className="w-full liquid-glass rounded-3xl p-6 md:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-foreground/10 py-2"
              >
                <AccordionTrigger className="text-left text-lg md:text-xl font-heading italic text-foreground hover:no-underline hover:text-foreground/80">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 font-body font-light text-base leading-relaxed md:pr-12">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
