import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown for rendering Markdown

const GEMINI_API_KEY = "AIzaSyDiyylGDcfvF2-k8wGSyxHhpirUcSGnm5o"; // Replace with your actual API key

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(true);
  const [language, setLanguage] = useState("en-US"); // Default language is English
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language; // Set the language dynamically

      recognitionInstance.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcriptRef.current = transcript.trim();
        setInput(transcript.trim());
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        const spokenText = transcriptRef.current.trim();
        if (spokenText) {
          const userMessage = { sender: "user", text: spokenText };
          setMessages((prev) => [...prev, userMessage]);
          setInput("");
          transcriptRef.current = "";
          handleGeminiReply(spokenText);
        }
      };

      recognitionRef.current = recognitionInstance;
    } else {
      setIsSpeechApiSupported(false);
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, language]); // Reinitialize when the language changes

  const handleGeminiReply = async (text) => {
    try {
      const response = await fetch(
        `https://backend-bhww.onrender.com/api/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI.";
      const aiMessage = { sender: "bot", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error communicating with Gemini." },
      ]);
    }
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      const userMessage = { sender: "user", text: trimmedInput };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      handleGeminiReply(trimmedInput);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 mt-4">
      <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Send a message to start the conversation
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
              {message.sender === "bot" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown> // Render Markdown for bot messages
              ) : (
                message.text
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="en-US">En</option>
          <option value="es-ES">ESP</option>
          <option value="fr-FR">Fr</option>
          <option value="de-DE">Ger</option>
          <option value="zh-CN">CH</option>
          <option value="ar-SA">Ar</option>
          <option value="am-ET">Am</option>
        </select>
        <textarea
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 resize-none"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors duration-200"
        >
          <Send size={20} />
        </button>
        {isSpeechApiSupported && (
          <button
            onClick={toggleListening}
            className={`${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white p-2 rounded-md transition-colors duration-200`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
