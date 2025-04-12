// src/components/landing/HeroSection.jsx
import React from 'react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom'; // If CTA links elsewhere

// Placeholder background image URL (Replace with a high-quality hotel image)
const heroImageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjUyOXwwfDF8c2VhcmNofDR8fGhvdGVsfGVufDB8fHx8MTY4OTgzNTkxN3ww&ixlib=rb-4.0.3&q=80&w=1600';

const HeroSection = () => {
  return (
    <div
      className="relative bg-neutral-darkest text-white overflow-hidden min-h-[60vh] md:min-h-[75vh] flex items-center justify-center"
      // Basic parallax-like effect, or just cover
      style={{
        backgroundImage: `url(${heroImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed', // Optional parallax effect
      }}
    >
      {/* Dark Overlay for text contrast */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold !text-white tracking-tight mb-4 leading-tight animate-fade-in-down"> {/* Added basic animation class */}
          Experience Unforgettable Hospitality
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl !text-neutral-light mb-8 max-w-3xl mx-auto animate-fade-in-up">
          Discover comfort, luxury, and exceptional service at the heart of the city. Your perfect stay awaits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay">
           {/* Example primary CTA - Link to booking or explore rooms (non-functional for now) */}
          <Button variant="primary" size="lg" className="bg-primary hover:bg-primary-dark" onClick={() => alert('Booking Feature Coming Soon!')}>
             Book Your Stay
           </Button>
           {/* Example secondary CTA */}
          <Button variant="outline" size="lg" className="border-white !text-white hover:bg-white hover:!text-primary-dark">
            Explore Rooms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;