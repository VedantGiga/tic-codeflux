const FeaturesChess = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-16 lg:px-24 bg-background">
      <div className="text-center mb-16">
        <div className="section-badge">Capabilities</div>
        <h2 className="section-heading mt-4">Care made simple.</h2>
      </div>

      {/* Row 1: text left, image right */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading italic text-foreground tracking-tight">
            Smart reminders that adapt to routines.
          </h3>
          <p className="text-foreground/60 font-body font-light text-sm max-w-md">
            CareDose AI learns daily habits and sends gentle, timely reminders
            through voice, text, or app notifications—so no dose is ever missed.
          </p>
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-foreground hover:bg-foreground/5 transition-colors">
            Learn more
          </button>
        </div>
        <div className="flex-1 liquid-glass rounded-2xl overflow-hidden aspect-video bg-foreground/5 flex items-center justify-center">
          <span className="text-foreground/20 font-body text-sm">Preview</span>
        </div>
      </div>

      {/* Row 2: image left, text right */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading italic text-foreground tracking-tight">
            Family stays connected. Always.
          </h3>
          <p className="text-foreground/60 font-body font-light text-sm max-w-md">
            Caregivers and family members get real-time updates when medications
            are taken—or missed. Peace of mind, no matter the distance.
          </p>
          <button className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-foreground hover:bg-foreground/5 transition-colors">
            See how it works
          </button>
        </div>
        <div className="flex-1 liquid-glass rounded-2xl overflow-hidden aspect-video bg-foreground/5 flex items-center justify-center">
          <span className="text-foreground/20 font-body text-sm">Preview</span>
        </div>
      </div>
    </section>
  );
};

export default FeaturesChess;

