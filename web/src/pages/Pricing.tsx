import React from 'react';
import Navbar from "@/components/Navbar";


const Pricing = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto py-32 text-center">
        <h1 className="section-heading mb-4">Pricing</h1>
        <p className="text-xl text-muted-foreground font-body max-w-lg mx-auto">
          Simple, transparent pricing for peace of mind.
        </p>
      </div>
    </div>

  );
};

export default Pricing;
