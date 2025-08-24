import React, { useState, useEffect, useRef } from 'react';
import './SupportChat.css';

const SupportChat = ({ userEmail = 'user' }) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  
  const [messages, setMessages] = useState([
    {
      message: `Hello ${userEmail}, welcome to the Digital Platform for Logistics and Transportation Companies. How can I assist you with managing transportation, reservations or shipment tracking?`,
      sender: "NaviGo Assistant",
      direction: "incoming",
      timestamp: new Date().toISOString(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const systemMessage = {
    role: "system",
    content: `
You are an expert in logistics, transportation, and digital platforms for goods transportation.
Please respond to questions related to:
- Vehicle and driver management
- Route and shipment tracking
- Reservations and transportation pricing
- Monitoring shipments and delivery status
- Rules for delays and penalties
- Communication with forwarders and clients
- Security and geolocation checks
Please respond professionally and in a friendly manner, helping users to better use the platform.
Please respond exclusively in **English**.
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
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      await getAIResponse(userMessage.message);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        message: "Sorry, I'm experiencing technical difficulties. Please try again later.",
        sender: "NaviGo Assistant",
        direction: "incoming",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

const getAIResponse = async (userMessage) => {
  setIsTyping(true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      const reply = {
        message: data.choices[0].message.content.trim(),
        sender: "NaviGo Asistent",
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
      message: "Error related to the AI assistant. Please try again later.",
      sender: "NaviGo Asistent",
      direction: "incoming",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, errorReply]);
  } finally {
    setIsTyping(false);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        <span className="toggle-icon">{isOpen ? '✕' : '💬'}</span>
        <span className="toggle-text">{isOpen ? 'Close Chat' : 'Open Chat'}</span>
      </button>

      <div className={`support-chat ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="header-content">
            <span className="header-title">NaviGo Assistant</span>
            <button className="chat-close-button" onClick={closeChat}>×</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.direction}`}
            >
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
                  <span className="typing-text">Assistant is typing...</span>
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
            placeholder="Ask a question..."
            rows="1"
            disabled={isTyping}
          />
          <button
            className="chat-send-button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;