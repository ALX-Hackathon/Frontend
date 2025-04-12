// src/components/landing/FeaturesSection.jsx
import React from 'react';
import { FaWifi, FaSwimmingPool, FaSpa, FaConciergeBell, FaUtensils } from 'react-icons/fa';

const features = [
  { name: 'High-Speed Wi-Fi', description: 'Stay connected with complimentary access throughout the hotel.', icon: FaWifi },
  { name: 'Relaxing Pool Area', description: 'Unwind by our pristine swimming pool, perfect for leisure.', icon: FaSwimmingPool },
  { name: 'Wellness Spa', description: 'Rejuvenate your senses with our range of spa treatments.', icon: FaSpa },
  { name: 'Gourmet Dining', description: 'Savor exquisite local and international cuisine at our restaurant.', icon: FaUtensils },
  { name: 'Concierge Service', description: 'Our dedicated team is here to assist with all your needs.', icon: FaConciergeBell },
];

const FeaturesSection = () => {
  return (
    <div className="bg-neutral-lightest py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Our Amenities</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-darkest sm:text-4xl">
            Everything You Need for a Perfect Stay
          </p>
        </div>
         {/* Responsive Grid */}
         <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
           {features.map((feature) => (
            <div key={feature.name} className="text-center flex flex-col items-center">
              <div className="flex-shrink-0 mb-4">
                 {/* Icon Styling */}
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-light text-primary-dark">
                   <feature.icon className="h-6 w-6" aria-hidden="true" />
                 </div>
              </div>
              <h3 className="text-lg font-medium leading-6 text-neutral-darkest">{feature.name}</h3>
              <p className="mt-2 text-base text-neutral-dark">{feature.description}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;