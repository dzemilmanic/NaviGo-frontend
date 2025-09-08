import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Truck } from "lucide-react";
import "./SupportChat.css";

const SupportChat = ({ userEmail = "user" }) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  const [messages, setMessages] = useState([
    {
      message: `Hello ${userEmail}! Welcome to NaviGo - your comprehensive logistics platform. I'm here to help you with fleet management, route planning, shipment tracking, booking transport, and all your logistics needs. How can I assist you today?`,
      sender: "NaviGo Assistant",
      direction: "incoming",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const systemMessage = {
    role: "system",
    content: `
You are the NaviGo Assistant, an expert AI helper EXCLUSIVELY for NaviGo - a comprehensive logistics platform that connects transport companies, freight forwarders, and clients who need cargo transportation services.

CRITICAL: You ONLY answer questions related to NaviGo platform and logistics. For ANY question not related to NaviGo, transportation, logistics, or shipping, you MUST politely decline and redirect the conversation back to NaviGo topics.

PLATFORM INFORMATION:
NaviGo is located in Belgrade, Serbia at Knez Mihailova 42. Contact: +381 11 123 4567, email: info@navigo.rs

FEATURES BY USER TYPE:

TRANSPORT COMPANIES can use NaviGo for:
- Fleet and driver management
- Route and shipment planning
- Automatic pricing creation
- Vehicle tracking and maintenance
- Failure and service management

FREIGHT FORWARDERS can:
- Get overview of all available routes
- Book transport for their clients
- Manage commissions
- Track delivery status
- Access special offers for urgent cases

CLIENTS can:
- Search transport companies
- Filter by destination and price
- Book vehicles up to 7 days in advance
- Track shipments in real-time
- Manage transportation costs transparently

INSTRUCTIONS:
- ONLY respond to questions about NaviGo platform, logistics, transportation, and shipping
- For ANY unrelated questions (general knowledge, other topics, personal questions, etc.), politely say: "I'm the NaviGo Assistant and I can only help with questions related to our logistics platform, transportation services, fleet management, shipment tracking, and booking. How can I assist you with NaviGo today?"
- Always be helpful, professional, and knowledgeable about logistics and transportation
- Provide specific guidance on how to use NaviGo features
- When users ask about pricing, booking, tracking, or fleet management, give detailed helpful advice
- If someone asks about contact information, provide the Belgrade office details
- Help users understand how the platform benefits their specific role (transport company, freight forwarder, or client)
- Suggest relevant NaviGo features based on user questions
- Be proactive in offering solutions for common logistics challenges
- If someone asks about competitors or other platforms, redirect them to NaviGo's advantages
- Always respond in English in a friendly, professional manner
`,
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      message: input.trim(),
      sender: "You",
      direction: "outgoing",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      await getAIResponse(userMessage.message);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          message:
            "I apologize, but I'm experiencing technical difficulties at the moment. Please try again in a few moments, or contact our support team directly at +381 11 123 4567 or info@navigo.rs for immediate assistance.",
          sender: "NaviGo Assistant",
          direction: "incoming",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "mistralai/mixtral-8x7b-instruct",
            messages: [
              { role: "system", content: systemMessage.content },
              { role: "user", content: userMessage },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      if (data?.choices?.[0]?.message?.content) {
        const reply = {
          message: data.choices[0].message.content.trim(),
          sender: "NaviGo Assistant",
          direction: "incoming",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
      } else {
        throw new Error("Unexpected response format from AI.");
      }
    } catch (error) {
      console.error(error);
      const errorReply = {
        message:
          "I'm sorry, but I encountered an error while processing your request. Please try again or contact our support team at info@navigo.rs for direct assistance.",
        sender: "NaviGo Assistant",
        direction: "incoming",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="support-chat-wrapper">
      <button className="chat-toggle-button" onClick={toggleChat}>
        <div className="toggle-content">
          {isOpen ? (
            <X size={20} />
          ) : (
            <div className="truck-icon-container">
              <Truck size={20} className="truck-icon" />
              <div className="truck-wheels">
                <div className="wheel wheel-1"></div>
                <div className="wheel wheel-2"></div>
              </div>
              <div className="truck-exhaust">
                <div className="smoke smoke-1"></div>
                <div className="smoke smoke-2"></div>
                <div className="smoke smoke-3"></div>
              </div>
            </div>
          )}
          <span className="toggle-text">
            {isOpen ? "Close Chat" : "NaviGo Help"}
          </span>
        </div>
      </button>

      <div className={`support-chat ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div className="header-content">
            <div className="header-info">
              <span className="header-title">NaviGo Assistant</span>
              <span className="header-subtitle">
                Logistics & Transportation Support
              </span>
            </div>
            <button className="chat-close-button" onClick={closeChat}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.direction}`}>
              <div className="message-bubble">
                <div className="message-text">{msg.message}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message incoming">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="typing-text">
                    NaviGo Assistant is typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about NaviGo"
            rows="1"
            disabled={isTyping}
          />
          <button
            className="chat-send-button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>

        <div className="chat-footer">
          <div className="footer-links">
            <span className="footer-contact">
              Need direct help? Call +381 11 123 4567
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
