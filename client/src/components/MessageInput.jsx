import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onTyping(false);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSend}>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          onTyping(true);
        }}
        placeholder="Type a message..."
        onBlur={() => onTyping(false)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;