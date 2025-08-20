import React, { useState, useRef, useEffect, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your AI assistant. How can I help you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Gemini AI and chat session once
  const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY), []);
  
  const initializeChatSession = useMemo(() => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    return model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }, [genAI]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Initialize chat session when component mounts
  useEffect(() => {
    setChatSession(initializeChatSession);
  }, [initializeChatSession]);

  const toggleChat = () => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
      }, 250);
    } else {
      setOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage = { 
      from: "user", 
      text: input.trim(), 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to chat session (maintains conversation context)
      const result = await chatSession.sendMessage(input.trim());
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { 
        from: "bot", 
        text: text, 
        timestamp: Date.now() 
      }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "I apologize, but I'm having trouble connecting right now. Please check if your API key is properly configured and try again.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const MarkdownRenderer = ({ content, isUser }) => {
    if (isUser) {
      return <span>{content}</span>;
    }

    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic mb-2">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    // Fixed positioning with increased bottom spacing
    // Changed from bottom-6 to bottom-20 to add more height from bottom
    // This prevents the chatbot from being too close to the browser edge
    <div className="fixed bottom-20 right-6 z-50">
      {!open && (
        <button
          onClick={toggleChat}
          className="group bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out animate-pulse hover:animate-none will-change-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full"></div>
        </button>
      )}

      {(open || isAnimating) && (
        <div 
          className={`w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out transform origin-bottom-right ${
            open && !isAnimating 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-95 opacity-0 translate-y-2'
          }`}
          onWheel={(e) => {
            e.stopPropagation();
            const messagesContainer = e.currentTarget.querySelector('[data-messages-container]');
            if (messagesContainer && messagesContainer.contains(e.target)) {
              return;
            }
            e.preventDefault();
          }}
        >
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold">Placify Assistant</span>
                <div className="text-xs opacity-90">Always here to help</div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 will-change-transform"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div 
            data-messages-container
            className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-80 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""
                } animate-in slide-in-from-bottom-3 fade-in duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.from === "user" 
                    ? "bg-purple-100 text-purple-600" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {msg.from === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`flex flex-col max-w-xs ${
                  msg.from === "user" ? "items-end" : "items-start"
                }`}>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed transition-all duration-200 hover:shadow-md will-change-transform ${
                    msg.from === "user"
                      ? "bg-purple-600 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                  }`}>
                    <MarkdownRenderer content={msg.text} isUser={msg.from === "user"} />
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2 animate-in slide-in-from-bottom-3 fade-in duration-300">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md animate-pulse">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all max-h-32 min-h-[44px]"
                  rows="1"
                  style={{ 
                    height: 'auto',
                    minHeight: '44px',
                    maxHeight: '128px'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex-shrink-0 will-change-transform"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;