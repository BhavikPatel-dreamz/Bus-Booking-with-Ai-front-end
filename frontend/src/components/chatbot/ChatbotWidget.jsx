import { useState, useCallback, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import axios from "axios";

const ChatbotWidget = ({
  defaultOpen = false,
  launcher = true,
  fullscreen = false,
  onClose,
}) => {
  const userRaw = localStorage.getItem("user");
const user = userRaw ? JSON.parse(userRaw) : null;
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");
  const WELCOME_MESSAGE = {
    id: "welcome",
    role: "bot",
    content: (user && role === "user")?"Hi there! 👋 I'm the **TripMate**. How can I help you today?\n\nYou can ask me about:\n- 🚌 Bus routes & schedules\n- 🎫 Booking & cancellations\n- 💰 Pricing & offers":"Hi there! 👋 I'm the **QuickBus Assistant**. How can I help you today?\n\nYou can ask me about:\n- 🚌 Bus routes & schedules\n- 🎫 Booking & cancellations\n- 💰 Pricing & offers",
  };
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const idCounter = useRef(1);

  function getOrCreateSession() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  } 
  return sessionId;
}


  const handleSendMessage = useCallback(async (text) => {
    const userMsg = {
      id: `user-${idCounter.current++}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    try {
      const sessionId = getOrCreateSession()
      

       const payload = {
         message: text,
         session_id: sessionId,
         access_token: JSON.parse(token),
       };
    
      let response;
      let reply;
      if (user && role === "user") {
        response = await axios.post(`${import.meta.env.VITE_CHATBOT_AUTH}`,payload);
        reply = response?.data?.reply;
      } 
      if(!user){
        response = await axios.post(`${import.meta.env.VITE_CHATBOT_NORMAL}`,payload);
        reply = response?.data?.message;
      }
      const botMsg = {
        id: `bot-${idCounter.current++}`,
        role: "bot",
        content: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMessage = {
        id: `bot-${idCounter.current++}`,
        role: "bot",
        content:
          error?.response?.data.message ||
          error?.message ||
          "Something went Wrong Please Try Again",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          fullscreen={fullscreen}
          onClose={() => {
            if (typeof onClose === "function") return onClose();
            setIsOpen(false);
          }}
        />
      )}

      {launcher && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-dropdown flex items-center justify-center hover:scale-105 hover:shadow-auth transition-all duration-200"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ChatbotWidget;
