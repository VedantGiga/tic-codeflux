import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="section-heading mb-4">404 - Not Found</h1>
      <p className="text-xl mb-8 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link to="/" className="text-primary hover:underline">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
