import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useIsMobile } from "../../hooks/use-mobile";

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const ChatWindow = ({
  messages,
  onSendMessage,
  isTyping,
  onClose,
  fullscreen = false,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-background"
    : isMobile
      ? "fixed inset-0 z-50 flex flex-col bg-background"
      : "fixed bottom-20 right-4 z-50 w-[360px] h-[480px] flex flex-col rounded-2xl border border-border bg-background shadow-auth animate-in fade-in slide-in-from-bottom-4 duration-300";

  const headerClass = fullscreen
    ? "flex items-center gap-3 px-4 py-3 border-b border-border bg-primary shrink-0"
    : "flex items-center gap-3 px-4 py-3 border-b border-border bg-primary rounded-t-2xl shrink-0";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={headerClass}>
        <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-sm">
          QB
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary-foreground">
            QuickBus Assistant
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-primary-foreground/70" style = {{color : "white"}}>Online</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{color : "white"}} 
          className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-2 focus:ring-sky-500 focus-visible:ring-offset-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-button shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
