import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 mt-16 lg:mt-0">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-10">
          <span className="section-badge mb-4 inline-block">Get in touch</span>
          <h1 className="section-heading mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground font-body max-w-lg mx-auto">
            We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="liquid-glass-strong p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
          <form className="space-y-6 flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80 ml-1">First Name</label>
                <Input 
                  placeholder="John" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:ring-accent"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80 ml-1">Last Name</label>
                <Input 
                  placeholder="Doe" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:ring-accent"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-white/80 ml-1">Message</label>
              <Textarea 
                placeholder="How can we help you?" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[150px] rounded-xl focus:ring-accent resize-none"
              />
            </div>

            <Button 
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-medium tracking-wide transition-all duration-300"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
