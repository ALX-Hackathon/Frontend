import React, { useState } from "react"; // Import useState for managing state
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar"; // Import Navbar
import Footer from "./Footer"; // Import Footer
import Chatbot from "../chatbot/Chatbot"; // Import Chatbot component
import { FaTimes, FaCommentDots } from "react-icons/fa"; // Import icons
import "react-chatbot-kit/build/main.css"; // Import default styles
import "../../chatbot-tailwind.css"; // Import custom styles for chatbot

const AppLayout = () => {
  const [showChatbot, setShowChatbot] = useState(false); // State to toggle chatbot

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {showChatbot && (
          <div className="chatbot-container mb-2 shadow-none rounded-lg overflow-hidden border border-neutral p-8 items-bottom bg-white dark:bg-neutral-darkest dark:border-neutral-dark">
            <Chatbot />
          </div>
        )}
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
