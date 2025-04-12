// src/chatbot/MessageParser.js
// SIMPLIFIED: Just send the message to the ActionProvider to handle
class MessageParser {
  constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
  }

  parse(message) {
       const sanitizedMessage = message.trim(); // Basic trim
       if (sanitizedMessage) {
         // Let the ActionProvider handle sending the message to the backend AI
          this.actionProvider.handleUserMessage(sanitizedMessage);
      }
  }
}
export default MessageParser;