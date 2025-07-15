import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) {
    return <div className="typing-indicator" />;
  }

  return (
    <div className="typing-indicator">
      {typingUsers.join(', ')} is typing...
    </div>
  );
};

export default TypingIndicator;