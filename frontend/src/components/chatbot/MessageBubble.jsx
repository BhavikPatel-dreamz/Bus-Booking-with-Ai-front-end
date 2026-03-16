import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'bg-muted text-foreground rounded-bl-sm'
            : 'bg-primary text-primary-foreground rounded-br-sm'
        }`}
      >
        {isBot ? (
          <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-primary [&_a]:underline [&_code]:bg-background/50 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-background/50 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="m-0">{message.content}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
