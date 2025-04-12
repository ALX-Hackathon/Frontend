// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Example social/contact icons

// Example data - Replace with actual hotel info
const contactInfo = {
  address: '123 Hospitality Lane, Addis Ababa, Ethiopia',
  phone: '+251 11 123 4567',
  email: 'info@habeshahubhotel.com',
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: FaFacebookF }, // Replace '#' with actual links
  { name: 'Twitter', href: '#', icon: FaTwitter },
  { name: 'Instagram', href: '#', icon: FaInstagram },
  { name: 'LinkedIn', href: '#', icon: FaLinkedinIn }, // Maybe relevant for corporate bookings
];

const footerNavLinks = [
    { name: 'About Us', href: '/about' },       // Example internal links
    { name: 'Rooms', href: '/rooms' },         // Needs corresponding pages/sections
    { name: 'Dining', href: '/dining' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    // Add link to the feedback system maybe?
    { name: 'Give Feedback', href: '/feedback' }
];


const LandingFooter = () => {
  return (
    <footer className="bg-neutral-darkest text-neutral-light pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout for different sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

           {/* Column 1: Branding/About */}
          <div className="md:col-span-1 space-y-4">
             <Link to="/" className="inline-block">
                {/* Use a logo image or text */}
                <span className="text-2xl font-bold text-white">Habesha Hub Hotel</span>
             </Link>
            <p className="text-sm text-neutral leading-relaxed">
              Experience unparalleled comfort and authentic Ethiopian hospitality at the heart of the city. Your premium destination awaits.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-1">
             <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerNavLinks.slice(0, 4).map((item) => ( // Example: Show first 4 links
                 <li key={item.name}>
                   <Link to={item.href} className="text-sm text-neutral hover:text-white transition-colors duration-150">
                     {item.name}
                   </Link>
                </li>
               ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
           <div className="md:col-span-1">
             <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral mb-4">Contact Us</h3>
             <address className="not-italic space-y-3 text-sm">
               <p className="flex items-start">
                 <FaMapMarkerAlt className="flex-shrink-0 h-4 w-4 text-primary mt-0.5 mr-2" aria-hidden="true" />
                  <span>{contactInfo.address}</span>
                </p>
                <p className="flex items-center">
                  <FaPhoneAlt className="flex-shrink-0 h-4 w-4 text-primary mr-2" aria-hidden="true" />
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-neutral hover:text-white">{contactInfo.phone}</a>
               </p>
               <p className="flex items-center">
                  <FaEnvelope className="flex-shrink-0 h-4 w-4 text-primary mr-2" aria-hidden="true" />
                  <a href={`mailto:${contactInfo.email}`} className="text-neutral hover:text-white truncate">{contactInfo.email}</a>
                </p>
            </address>
          </div>

          {/* Column 4: Social Media & Legal Links */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                 {socialLinks.map((item) => (
                    <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-neutral hover:text-white transition-colors duration-150">
                     <span className="sr-only">{item.name}</span>
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                ))}
              </div>
            </div>
            {/* Legal links here maybe, or combine with Quick Links */}
             <div className="pt-4 border-t border-neutral-darker border-opacity-20 md:hidden"> {/* Show on mobile */}
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral mb-2">Legal</h3>
                 <ul className="space-y-1">
                 {footerNavLinks.slice(4).map((item) => ( // Example: Show rest of links
                    <li key={item.name}> <Link to={item.href} className="text-xs text-neutral hover:text-white">{item.name}</Link></li>
                 ))}
                 </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright and possibly main legal links */}
        <div className="mt-8 pt-8 border-t border-neutral-darker border-opacity-20 text-center text-xs text-neutral">
          <p className="mb-2">© {new Date().getFullYear()} Habesha Hospitality Hub Hotel. All rights reserved.</p>
           <div className="hidden md:flex justify-center space-x-4"> {/* Show legal links here on desktop */}
              {footerNavLinks.slice(4).map((item) => (
                <Link key={item.name} to={item.href} className="text-xs text-neutral hover:text-white transition-colors">
                   {item.name}
                 </Link>
               ))}
          </div>
        </div>

      </div> {/* End Container */}
    </footer>
  );
};

export default LandingFooter;