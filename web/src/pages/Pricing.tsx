import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals managing basic daily medications.",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      "Up to 3 medications",
      "Standard AI voice alerts",
      "Weekly adherence reports",
      "Mobile app access",
      "Basic dose history",
    ],
    cta: "Start for Free",
    to: "/dashboard",
    popular: false,
  },
  {
    name: "Family Plus",
    description: "Advanced care for households and complex treatment plans.",
    priceMonthly: 19,
    priceAnnual: 15,
    features: [
      "Unlimited medications",
      "Real-time family dashboard",
      "Proactive caregiver alerts",
      "Smart pill-bottle sync (Virtual)",
      "Monthly clinician insights",
      "Priority 24/7 support",
    ],
    cta: "Start 30-Day Trial",
    to: "/contact",
    popular: true,
  },
  {
    name: "Care Center",
    description: "Professional infrastructure for high-volume care facilities.",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    features: [
      "Multi-patient management",
      "Administrative hierarchy",
      "White-labeling support",
      "HIPAA Compliant storage",
      "Dedicated account manager",
      "Custom API integrations",
    ],
    cta: "Talk to Sales",
    to: "/contact",
    popular: false,
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
  };

  return (
    <div className="bg-background min-h-screen relative overflow-hidden font-body">
      <Navbar />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-foreground/10 px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
              Predictable Pricing
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="section-heading mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Simple plans for <br />
            <span className="text-foreground/80 italic">absolute peace of mind.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground font-light max-w-lg mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose the level of care that fits your family. Each plan includes our core AI-powered engine.
          </motion.p>

          {/* Billing Switch */}
          <motion.div 
            className="flex items-center justify-center gap-4 bg-foreground/5 p-1 rounded-full w-fit mx-auto border border-foreground/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                billingCycle === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground/60'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 relative ${
                billingCycle === 'annual' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground/60'
              }`}
            >
              Annual
              <span className="absolute -top-3 -right-6 bg-accent text-accent-foreground text-[8px] font-bold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 overflow-hidden ${
                plan.popular 
                  ? 'liquid-glass-strong border-foreground/20 ring-1 ring-foreground/10' 
                  : 'liquid-glass border-foreground/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-1 rounded-bl-xl">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-heading italic mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/50 font-light leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-heading tracking-tighter">
                  {typeof plan.priceMonthly === 'number' ? '$' : ''}
                  {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                </span>
                {typeof plan.priceMonthly === 'number' && (
                  <span className="text-sm text-foreground/40 font-medium">/mo</span>
                )}
              </div>

              <div className="flex-grow space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-foreground" />
                    </div>
                    <span className="text-sm text-foreground/70 font-light">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={plan.to} className="w-full">
                <Button 
                  className={`w-full rounded-full h-12 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                    plan.popular
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>

              {/* Subtle background glow for popular card */}
              {plan.popular && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[60px] -z-10" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section Hint */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-sm text-foreground/30 font-light">
            Have more questions? Check our <Link to="/how-it-works" className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-4">How it works</Link> page <br />
            or <Link to="/contact" className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-4">contact our team</Link> for custom quotes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
