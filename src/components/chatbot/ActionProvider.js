// src/chatbot/ActionProvider.js
import axios from 'axios'; // Need axios for API calls
import { API_BASE_URL } from '../../config/api'; // Adjust path as needed

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
        // Internal loading state
        this.setChatbotLoading = (loading) => {
            this.setState(prevState => ({
                ...prevState,
                loading: loading, // Assumes 'loading' state exists in react-chatbot-kit state
            }));
        };
    }

     // Sends user message to backend proxy, receives AI response
     handleUserMessage = async (userMessage) => {
        // Optional: Show user message immediately while waiting for backend
        // const clientMsg = this.createClientMessage(userMessage);
        // this._updateChatbotState(clientMsg); // Commented out: react-chatbot-kit adds user message automatically

        this.setChatbotLoading(true); // Indicate bot is "thinking"

         try {
            const response = await axios.post(`${API_BASE_URL}/chat/message`, {
                message: userMessage,
             });

            if (response.data && response.data.reply) {
                this.sendMessage(response.data.reply); // Send AI reply
             } else {
                // Handle cases where backend might succeed but send no reply (shouldn't happen)
                this.handleErrorResponse("Sorry, I received an empty response.");
            }

        } catch (error) {
             console.error("Error communicating with chat backend:", error);
            const errorMessage = error.response?.data?.error || "Sorry, I couldn't connect to the chat service right now.";
             this.handleErrorResponse(errorMessage);
        } finally {
             this.setChatbotLoading(false); // Stop loading indicator
         }
    };

    // Helper to send a standard bot message
    sendMessage = (text) => {
         const message = this.createChatBotMessage(text);
        this._updateChatbotState(message);
    };

    // Helper to send an error message formatted as a bot message
    handleErrorResponse = (errorText) => {
         const message = this.createChatBotMessage(`Error: ${errorText}`, {
             widget: 'errorWidget', // You could potentially add a specific error widget/style
             payload: { error: true }, // Add metadata if needed
             type: 'error', // Set message type if supported/useful
         });
        this._updateChatbotState(message);
    };


     _updateChatbotState = (message) => {
        this.setState(prevState => ({
          ...prevState,
          messages: [...prevState.messages, message],
        }));
      };


    // --- REMOVE all the previous keyword handler methods ---
    // greet = () => { ... };             <== DELETE
    // handleWifiInquiry = () => { ... }; <== DELETE
    // handleBreakfastInquiry = () => { ... }; <== DELETE
    // ... etc ...
    // handleUnknown = () => { ... };      <== DELETE
}

export default ActionProvider;