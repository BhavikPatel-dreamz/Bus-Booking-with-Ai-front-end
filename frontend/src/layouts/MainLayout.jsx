import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';


const MainLayout = () => {
  const role = localStorage.getItem("role")
  const location = useLocation();
  const isChatbotPage = location.pathname === "/chatbot";
  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {role === "admin" || isChatbotPage ? <></> : <ChatbotWidget />}
    </div>
  );
};

export default MainLayout;
