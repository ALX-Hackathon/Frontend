// src/components/landing/TestimonialsSection.jsx
import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  { quote: "An absolutely wonderful stay! The service was impeccable, and the room was perfect. Highly recommended.", author: "A. Tsegaye", city: "Addis Ababa" },
  { quote: "From check-in to check-out, everything was smooth. The staff went above and beyond. The breakfast buffet is amazing!", author: "S. Miller", city: "London" },
  { quote: "Great location and fantastic amenities. The spa experience was the highlight of my trip.", author: "F. Dubois", city: "Paris" },
];

const TestimonialsSection = () => {
  return (
    <div className="bg-neutral-lightest py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-darkest sm:text-4xl">
            What Our Guests Say
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-neutral flex flex-col">
              <FaQuoteLeft className="text-primary text-2xl mb-4 flex-shrink-0" aria-hidden="true" />
               <blockquote className="flex-grow">
                 <p className="text-base text-neutral-dark italic mb-4">"{testimonial.quote}"</p>
               </blockquote>
               <footer className="mt-4">
                 <p className="text-sm font-semibold text-neutral-darkest">{testimonial.author}</p>
                <p className="text-xs text-neutral-dark">{testimonial.city}</p>
              </footer>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;