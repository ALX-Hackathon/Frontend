// src/components/chatbot/AiChatbot.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import axios from 'axios'; // To call our backend proxy
import { API_BASE_URL } from '../../config/api'; // Use our configured API base
import Button from '../ui/Button'; // Assuming you have a Button component


// Remove direct GEMINI_API_KEY constant - it's now handled by the backend
// const GEMINI_API_KEY = "AIzaSyDiyylGDcfvF2-k8wGSyxHhpirUcSGnm5o"; // <-- DELETE THIS

const AiChatbot = () => {
  // --- State Management ---
  const [messages, setMessages] = useState([]); // Format: { sender: 'user' | 'bot' | 'error', text: string }
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Loading state for AI reply
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(false); // Check on mount
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // Stores ongoing speech transcript
  const messagesEndRef = useRef(null); // For scrolling

  // --- Effects ---
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    // Feature detection
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        setIsSpeechApiSupported(true);
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false; // Stop after first pause
        recognitionInstance.interimResults = true; // Get results as user speaks
        recognitionInstance.lang = "en-US"; // Adjust language if needed

        // Handle receiving speech results
        recognitionInstance.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            // Update transcript ref and input field with interim results
            transcriptRef.current = transcript;
            setInput(transcript); // Show live transcript in input
        };

        // Handle errors
        recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            let errorMsg = "Speech recognition error.";
            if(event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMsg = "Microphone permission denied. Please allow access in browser settings.";
            } else if (event.error === 'no-speech') {
                 errorMsg = "No speech detected. Please try again.";
            }
            setMessages(prev => [...prev, { sender: 'error', text: errorMsg }]);
            setIsListening(false);
            transcriptRef.current = ''; // Clear any partial transcript
        };

        // Handle end of speech recognition session
        recognitionInstance.onend = () => {
             setIsListening(false);
            const spokenText = transcriptRef.current.trim();
            // Only send if actual speech was captured and not just interim silence
            if (spokenText) {
               // Send the final transcript
                handleSend(spokenText); // Use handleSend to process final spoken text
                transcriptRef.current = ""; // Clear ref after processing
                // setInput(""); // Clear input AFTER sending is initiated by handleSend
            } else {
                // If ended without substantial speech after being triggered
                console.log("Speech recognition ended without final result.");
                // Optionally reset input if it only contains interim noise
                 if (!input.trim() || input === transcriptRef.current) { // Avoid clearing if user typed meanwhile
                    setInput("");
                 }
            }
        };

        recognitionRef.current = recognitionInstance;

    } else {
        console.warn("Web Speech API not supported by this browser.");
        setIsSpeechApiSupported(false);
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Ensure it stops if component unmounts while listening
      }
    };
    // Empty dependency array: Initialize speech recognition only once on mount
  }, []); // Run only once

  // --- API Call to Backend Proxy ---
  const getAiReply = useCallback(async (text) => {
    setIsProcessing(true); // Set loading state
    setMessages(prev => [...prev, { sender: 'bot', text: '...', isLoading: true }]); // Add temporary "thinking" message

    try {
      // Call OUR backend endpoint
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: text,
      });

      // Remove the temporary loading message before adding the real one
       setMessages(prev => prev.filter(msg => !msg.isLoading));

      if (response.data && response.data.reply) {
         const aiMessage = { sender: "bot", text: response.data.reply };
         setMessages((prev) => [...prev, aiMessage]);
      } else {
         throw new Error("Received an empty reply from the server.");
      }

    } catch (error) {
       console.error("Error fetching AI reply from backend:", error);
       // Remove loading message and show error
        setMessages(prev => prev.filter(msg => !msg.isLoading));
        const errorMessage = error.response?.data?.error || "Error communicating with the chatbot service.";
        setMessages((prev) => [...prev, { sender: "error", text: errorMessage }]);
    } finally {
      setIsProcessing(false); // Clear loading state
    }
  }, []); // Dependencies for useCallback (API_BASE_URL is effectively constant)

  // --- Event Handlers ---
  // Function to handle sending either typed or spoken text
  const handleSend = useCallback((textToSend = null) => {
     const messageText = (textToSend !== null ? textToSend : input).trim(); // Use provided text or current input

     if (messageText && !isProcessing) {
       const userMessage = { sender: "user", text: messageText };
       setMessages((prev) => [...prev, userMessage]);
       setInput(""); // Clear input field AFTER sending
       getAiReply(messageText); // Call the backend
    }
   }, [input, isProcessing, getAiReply]); // Dependencies

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current || isProcessing) return; // Don't allow mic toggle if AI is processing

    if (isListening) {
       recognitionRef.current.stop();
       // onend handler will set isListening to false and process result
     } else {
        try {
         setInput(""); // Clear input field before starting recording
         transcriptRef.current = ""; // Clear transcript ref
         recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error("Failed to start speech recognition:", error);
          // Show error message (e.g., if already started or other issue)
          setMessages(prev => [...prev, {sender:'error', text:"Could not start microphone."}]);
          setIsListening(false);
       }
    }
  };


  // --- JSX Rendering ---
  return (
     // Container: Mimicking Shadcn style with Tailwind
    <div className="flex flex-col h-[500px] bg-white dark:bg-neutral-darkest rounded-lg shadow-lg border border-neutral-light dark:border-neutral-darker overflow-hidden"> {/* Changed bg/border colors */}

      {/* Message Display Area */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-3 px-4 py-3"> {/* Added padding */}
        {/* Initial Welcome Message */}
        {messages.length === 0 && (
           <div className="text-center text-neutral-dark dark:text-neutral-med mt-10 px-4">
               <p className="text-lg font-medium mb-2">Welcome to HahuBot!</p>
               <p className="text-sm">Ask me about WiFi, breakfast, check-out, attractions, or the current dashboard summary.</p>
            </div>
         )}

         {/* Render Messages */}
        {messages.map((message, index) => (
          <div
             key={index}
             // Basic Alignment (can be refined)
             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
           >
             <div
               className={`px-3 py-2 rounded-lg max-w-[85%] shadow-sm ${ // Added shadow
                  message.sender === "user"
                   ? "bg-primary text-white rounded-br-none" // User message style
                    : message.sender === "bot"
                   ? `bg-neutral-light dark:bg-neutral-darker text-neutral-darker dark:text-neutral-lightest rounded-bl-none ${message.isLoading ? 'opacity-70 italic' : ''}` // Bot message style (+ loading state)
                    : "bg-error-light text-error-dark border border-error rounded-md" // Error message style
                }`}
             >
                 {/* Add simple "Thinking..." visual for bot loading state */}
                 {message.isLoading ? (
                     <div className="flex items-center space-x-1.5 text-sm">
                        <span className="w-1.5 h-1.5 bg-neutral-dark dark:bg-neutral-light rounded-full animate-bounce_1"></span>
                         <span className="w-1.5 h-1.5 bg-neutral-dark dark:bg-neutral-light rounded-full animate-bounce_2"></span>
                         <span className="w-1.5 h-1.5 bg-neutral-dark dark:bg-neutral-light rounded-full animate-bounce_3"></span>
                    </div>
                 ) : (
                     message.text // Actual message text
                )}
             </div>
           </div>
         ))}
         {/* Scroll anchor */}
         <div ref={messagesEndRef} />
      </div>

       {/* Input Area */}
       {/* Added slight border top */}
      <div className="flex items-end p-3 border-t border-neutral-light dark:border-neutral-darker space-x-2">
         {/* Use Textarea UI component if you have one, or style directly */}
        <textarea
           className="flex-grow p-2 border border-neutral dark:border-neutral-dark rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-neutral-darker dark:text-neutral-lightest resize-none text-sm"
           rows={1} // Auto-adjust height usually requires JS, keep simple for now
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={handleKeyPress}
           placeholder={isListening ? "Listening..." : "Type or speak..."}
           disabled={isProcessing} // Disable input while AI replies
           aria-label="Chat input"
        />
         {/* Send Button */}
         <Button
             onClick={() => handleSend()}
             variant="primary"
             size="icon" // Assuming your Button component has an 'icon' size
            disabled={!input.trim() || isProcessing || isListening} // Disable if empty, processing, or listening
            className="aspect-square h-10 w-10 flex-shrink-0" // Ensure size consistency
            aria-label="Send message"
        >
            <Send size={18} />
        </Button>
         {/* Microphone Button */}
         {isSpeechApiSupported && (
           <Button
              onClick={toggleListening}
              variant={isListening ? "danger" : "secondary"} // Use danger when active/listening
              size="icon"
              disabled={isProcessing} // Disable if AI is processing
              className="aspect-square h-10 w-10 flex-shrink-0"
              aria-label={isListening ? "Stop listening" : "Start voice input"}
           >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
        )}
      </div>
    </div>
  );
};

export default AiChatbot;