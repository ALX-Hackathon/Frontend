// src/chatbot/ActionProvider.js
// This class defines the actions the bot can take (i.e., sending messages back).
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage; // Useful for adding messages programmatically
  }

  // Function to send a simple text message from the bot
  sendMessage = (text, options = {}) => {
    const message = this.createChatBotMessage(text, options);
    this._updateChatbotState(message);
  };

  greet = () => {
    this.sendMessage("Hello there! Nice to chat with you.");
  };

  handleWifiInquiry = () => {
     // Replace with actual info or logic to fetch it
     const wifiInfo = "The Wi-Fi network is 'HabeshaHub_Guest' and the password is 'Hospitality2025'. Enjoy your stay!";
     this.sendMessage(wifiInfo);
  };

   handleBreakfastInquiry = () => {
     const breakfastInfo = "Breakfast is served daily from 7:00 AM to 10:00 AM in the main dining hall on the ground floor.";
      this.sendMessage(breakfastInfo);
  };

  handleCheckoutInquiry = () => {
     const checkoutInfo = "Standard check-out time is 11:00 AM. If you need a later check-out, please contact the front desk.";
      this.sendMessage(checkoutInfo);
  };

  handleAttractionsInquiry = () => {
     const attractionsInfo = "Near the hotel, you can visit the National Museum, Holy Trinity Cathedral, and Merkato market. Ask the concierge for maps and tours!";
      this.sendMessage(attractionsInfo);
  };

  // --- Placeholder for Conversational Feedback (Future) ---
   handleGeneralFeedback = () => {
       // In a real app, this might trigger a more complex flow asking for details
       // or just direct the user to the feedback form.
        const feedbackResponse = "Thanks for wanting to share feedback! For detailed comments, please use our dedicated Feedback form found in the navigation menu. Is there anything else I can help you find?";
       this.sendMessage(feedbackResponse);
    };
   // --- End Placeholder ---


   handleUnknown = () => {
      const unknownResponse = "Sorry, I didn't quite understand that. I can help with questions about Wi-Fi, breakfast times, check-out, and local attractions. Could you please rephrase?";
      this.sendMessage(unknownResponse);
  };


  // Helper function to add new messages to the chatbot state
  _updateChatbotState = (message) => {
    // NOTE: This function updates the state array. Ensure it doesn't mutate directly.
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;