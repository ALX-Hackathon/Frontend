// src/chatbot/config.js
import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import BotAvatar from './BotAvatar'; // Optional: Custom avatar component


const botName = 'HahuBot'; // Our bot's name! (Hahu = Habesha Hub)

const config = {
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}. How can I help you today? Ask about Wi-Fi, breakfast, check-out, or attractions.`)
  ],
  botName: botName,
  customComponents: {
     // Optional: Replace the default bot avatar
     botAvatar: () => React.createElement(BotAvatar),
  },
  // customStyles: { // Optional: Style overrides
  //   botMessageBox: { backgroundColor: '#3b82f6' }, // Example: primary color
  //   chatButton: { backgroundColor: '#2563eb' },
  // },
  // state: { // Optional: Pass initial state if needed
  //   checkedIn: true,
  // },
  // widgets: [ // Optional: Add custom interactive widgets if needed later
  //   { widgetName: 'feedbackOptions', widgetFunc: (props) => <FeedbackOptions {...props} /> }
  // ],
};

export default config;