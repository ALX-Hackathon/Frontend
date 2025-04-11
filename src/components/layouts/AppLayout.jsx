// src/layouts/AppLayout.jsx
import React from 'react';
import { useState } from 'react'; // Import useState for managing state
import { FaCommentDots, FaTimes } from 'react-icons/fa'; // Import icons for chat button
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar'; // Import Navbar
import Footer from './Footer'; // Import Footer
import Chatbot from 'react-chatbot-kit'; // Import Chatbot
import 'react-chatbot-kit/build/main.css'; // Import default styles
import config from '../chatbot/config.js'; // Import your config
import MessageParser from '../chatbot/MessageParser.js'; // Import your parser
import ActionProvider from '../chatbot/ActionProvider.js'; // Import your action provider

import '../../chatbot-tailwind.css'; // Import custom styles for chatbot
const AppLayout = () => {
  const [showChatbot, setShowChatbot] = useState(false); // State to toggle chatbot

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };


  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
       {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 5000 }} />

       {/* Navbar */}
      <Navbar />

       {/* Main Content Area */}
       <main className="flex-grow container mx-auto px-4 py-6 md:py-8"> {/* Adjusted padding */}
        <Outlet /> {/* Child routes render here */}
       </main>

       {/* Footer */}
      <Footer />{/* Chatbot Container & Trigger */}
            <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
               {/* Chatbot Window */}
               {showChatbot && (
                 <div className="chatbot-container mb-2 shadow-xl rounded-lg overflow-hidden border border-neutral"> {/* Custom class */}
                   <Chatbot
                      config={config}
                      messageParser={MessageParser}
                      actionProvider={ActionProvider}
                     // headerText='Chat with HahuBot' // Optional header override
                   />
                 </div>
               )}
      
              {/* Chatbot Trigger Button (FAB) */}
               <button
                   onClick={toggleChatbot}
                   className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                   aria-label={showChatbot ? "Close Chatbot" : "Open Chatbot"}
               >
                   {showChatbot ? (
                      <FaTimes className="w-6 h-6" /> // Close icon when open
                    ) : (
                      <FaCommentDots className="w-6 h-6" /> // Chat icon when closed
                    )}
                </button>
              </div>
            </div>
  );
};

export default AppLayout;