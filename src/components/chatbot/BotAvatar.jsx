// src/chatbot/BotAvatar.jsx
import React from 'react';
// You could use an SVG, an image, or even react-icons
import { FaRobot } from 'react-icons/fa';

const BotAvatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-2">
        <FaRobot className="w-5 h-5"/> {/* Example Icon */}
    </div>
  );
};

export default BotAvatar;