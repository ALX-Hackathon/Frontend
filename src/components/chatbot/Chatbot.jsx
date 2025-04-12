import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyDiyylGDcfvF2-k8wGSyxHhpirUcSGnm5o"; // Replace with your actual API key

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(true);
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

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
  }, [isListening, language]);

  const handleGeminiReply = async (text) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI.";
      const aiMessage = { sender: "bot", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
      speak(aiText);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error communicating with Gemini." },
      ]);
    }
  };

  // Send typed message
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

  const speak = (text) => {
    console.log("Speaking text:", text); // Added console log
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;

      // Optional: Set a specific voice based on language
      const selectedVoice = voices.find((voice) => voice.lang === language);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Delay speaking until voices are loaded
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          const updatedVoice = updatedVoices.find((v) => v.lang === language);
          if (updatedVoice) utterance.voice = updatedVoice;
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.warn("Speech Synthesis not supported");
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
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
              {message.text}
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
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="zh-CN">Chinese</option>
          <option value="ar-SA">Arabic</option>
          <option value="am-ET">Amharic</option>
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
