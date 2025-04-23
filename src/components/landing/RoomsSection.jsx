// src/components/landing/RoomsSection.jsx
import React from 'react';
import Card from '../ui/Card'; // Reuse Card component
import Button from '../ui/Button';

// Replace with actual room images and details
const roomTypes = [
  { name: 'Standard Room', description: 'Comfortable and well-equipped for a relaxing stay.', img: 'https://via.placeholder.com/400x300/dde?text=Standard+Room' },
  { name: 'Deluxe Suite', description: 'Spacious suite offering premium amenities and city views.', img: 'https://via.placeholder.com/400x300/eee?text=Deluxe+Suite' },
  { name: 'Executive Room', description: 'Designed for business travelers with extra workspace.', img: 'https://via.placeholder.com/400x300/ddd?text=Executive+Room' },
];

const RoomsSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h2 className="text-base font-semibold text-secondary uppercase tracking-wide">Accommodations</h2>
           <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-darkest sm:text-4xl">
             Comfort Tailored to You
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
           {roomTypes.map((room) => (
            // Reusing Card component for styling consistency
             <Card key={room.name} className="flex flex-col overflow-hidden"> {/* Ensure images dont overflow */}
              <img className="h-48 w-full object-cover" src={room.img} alt={room.name} />
              {/* Remove internal padding added by card for image case */}
               <div className="flex flex-1 flex-col justify-between p-6">
                 <div>
                     <h3 className="text-lg font-semibold text-neutral-darkest">{room.name}</h3>
                    <p className="mt-3 text-sm text-neutral-dark">{room.description}</p>
                  </div>
                  <div className="mt-6">
                     {/* Button might link to room details page */}
                     <Button variant="outline" size="sm" onClick={() => alert('View Details Coming Soon!')}> View Details </Button>
                   </div>
               </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomsSection;