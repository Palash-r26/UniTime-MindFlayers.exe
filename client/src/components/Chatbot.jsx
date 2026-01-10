import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
// 👇 IMPORT CONFIG HERE (Isse backend ka sahi address milega)
import { API_BASE_URL } from "../config"; 

const Chatbot = ({ isDark }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I am your UniTime assistant. Class cancelled? Ask me for a study plan!", 
      sender: "ai" 
    },
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. User ka message add karo
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    
    // Input clear aur loading start
    setInput("");
    setLoading(true);

    try {
      console.log("📡 Sending to Backend:", `${API_BASE_URL}/api/chat`); // Debugging ke liye

      // 2. Backend ko request bhejo (Using Config URL)
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      
      // 3. AI ka message add karo
      const aiMessage = { 
        text: data.text || "Sorry, I couldn't process that.", 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("❌ Chat Error:", error);
      setMessages((prev) => [...prev, { text: " Server error. check Backend is start or not?", sender: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[500px] w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">UniTime AI</h3>
          <p className="text-indigo-200 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "ai" && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${isDark ? "bg-gray-700" : "bg-indigo-100"}`}>
                    <Bot size={16} className={isDark ? "text-white" : "text-indigo-600"}/>
                </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.sender === "user" 
                ? "bg-indigo-600 text-white rounded-br-none" 
                : msg.sender === "error"
                ? "bg-red-100 text-red-600 border border-red-200"
                : isDark ? "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700" : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
            }`}>
              {msg.text}
            </div>
            {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 overflow-hidden">
                    <User size={16} className="text-gray-600"/>
                </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start items-center">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${isDark ? "bg-gray-700" : "bg-indigo-100"}`}>
                    <Bot size={16} className={isDark ? "text-white" : "text-indigo-600"}/>
             </div>
             <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs ${isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-3 border-t flex gap-2 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your schedule..."
          className={`flex-1 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${isDark ? "bg-gray-900 text-white placeholder-gray-500" : "bg-gray-100 text-gray-800 placeholder-gray-400"}`}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;