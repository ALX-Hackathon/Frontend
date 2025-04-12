// src/pages/HomePage.jsx
import React from 'react';

// Import SPECIFIC landing page layout components
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

// Import Landing Page Sections
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FeedbackCTASection from '../components/landing/FeedbackCTASection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
// ... other landing section imports

const HomePage = () => {
    return (
        // Use flex structure because it's rendered outside AppLayout
        <div className="flex flex-col min-h-screen bg-white"> {/* Optional bg if needed */}
            {/* Use the landing page navbar, specify transparent variant */}
            <LandingNavbar initialVariant="transparent" />

             <main className="flex-grow">
                 <HeroSection />
                <FeaturesSection />
                 {/* ... other sections ... */}
                <FeedbackCTASection />
                 <TestimonialsSection />
            </main>

             {/* Use the detailed landing page footer */}
             <LandingFooter />
         </div>
    );
};

export default HomePage;