// src/chatbot/MessageParser.js
// This class decides what action to take based on the user's message.
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state; // Can access chatbot state if needed
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    console.log("User message:", lowerCaseMessage); // Debugging

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      this.actionProvider.greet();
    }
    else if (lowerCaseMessage.includes('wifi') || lowerCaseMessage.includes('wi-fi') || lowerCaseMessage.includes('internet')) {
      this.actionProvider.handleWifiInquiry();
    }
    else if (lowerCaseMessage.includes('breakfast')) {
      this.actionProvider.handleBreakfastInquiry();
    }
    else if (lowerCaseMessage.includes('check-out') || lowerCaseMessage.includes('checkout')) {
       this.actionProvider.handleCheckoutInquiry();
    }
    else if (lowerCaseMessage.includes('attractions') || lowerCaseMessage.includes('places') || lowerCaseMessage.includes('visit')) {
      this.actionProvider.handleAttractionsInquiry();
    }
    // Add more keyword checks for common questions here
    // else if (lowerCaseMessage.includes('pool'))...
    // else if (lowerCaseMessage.includes('gym'))...

    // --- Placeholder for Conversational Feedback (Future) ---
    else if (lowerCaseMessage.includes('feedback') || lowerCaseMessage.includes('complaint') || lowerCaseMessage.includes('suggestion') || lowerCaseMessage.includes('happy') || lowerCaseMessage.includes('unhappy')) {
        this.actionProvider.handleGeneralFeedback();
    }
    // --- End Placeholder ---

    else {
      this.actionProvider.handleUnknown(); // Default handler for unrecognized messages
    }
  }
}

export default MessageParser;