const testimonials = [
  {
    quote:
      "Mom hasn't missed a single dose in three months. CareDose gave our whole family peace of mind we never thought possible.",
    name: "Linda Park",
    role: "Daughter & Caregiver",
  },
  {
    quote:
      "Setting it up took five minutes. Now Dad gets gentle reminders and I get notified if he skips. It's a lifesaver—literally.",
    name: "James Holden",
    role: "Son & Remote Caregiver",
  },
  {
    quote:
      "As a home nurse, I manage medications for multiple patients. CareDose keeps everything organized and on schedule effortlessly.",
    name: "Rosa Martinez",
    role: "Home Health Nurse",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-16 lg:px-24 bg-background">
      <div className="text-center mb-16">
        <div className="section-badge">What Families Say</div>
        <h2 className="section-heading mt-4">Trusted by those who care most.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map(({ quote, name, role }) => (
          <div key={name} className="liquid-glass rounded-2xl p-8">
            <p className="text-foreground/80 font-body font-light text-sm italic mb-6">
              "{quote}"
            </p>
            <div>
              <div className="text-foreground font-body font-medium text-sm">
                {name}
              </div>
              <div className="text-foreground/50 font-body font-light text-xs">
                {role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

