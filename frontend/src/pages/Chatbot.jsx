import { useNavigate } from "react-router-dom";
import ChatbotWidget from "../components/chatbot/ChatbotWidget";

const Chatbot = () => {
  const navigate = useNavigate();

  return (
    <ChatbotWidget
      defaultOpen
      launcher={false}
      fullscreen
      onClose={() => navigate("/")}
    />
  );
};

export default Chatbot;
