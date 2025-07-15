import React, { useEffect, useRef } from 'react';
import { socket } from '../socket/socket';
import { useSocket } from '../context/SocketContext';

const ReadReceipt = ({ status }) => {
  if (status === 'sent') return <span className="read-receipt sent">✓</span>;
  if (status === 'read') return <span className="read-receipt read">✓✓</span>;
  return null;
};

const Reactions = ({ reactions, messageId }) => {
  const { sendReaction } = useSocket();

  if (!reactions || Object.keys(reactions).length === 0) {
    return null;
  }

  return (
    <div className="reactions-container">
      {Object.entries(reactions).map(([emoji, users]) => (
        <div key={emoji} className="reaction" onClick={() => sendReaction(messageId, emoji)}>
          {emoji} {users.length}
        </div>
      ))}
    </div>
  );
};

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const { sendReaction } = useSocket();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="message-list">
      {messages.map((msg) => {
        const isSentByMe = msg.senderId === socket.id;

        if (msg.type === 'system') {
          return <div key={msg.id} className="message system">{msg.message}</div>;
        }

        return (
          <div key={msg.id} className={`message-wrapper ${isSentByMe ? 'sent' : 'received'}`}>
            <div className={`message ${msg.isPrivate ? 'private' : ''}`}>
              {!isSentByMe && <div className="message-sender">{msg.sender}</div>}
              
              <div className="message-content">
                {msg.message}
                <div className="message-meta">
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                  {isSentByMe && <ReadReceipt status={msg.status} />}
                </div>
              </div>

              <Reactions reactions={msg.reactions} messageId={msg.id} />
              
              <div className="reaction-buttons">
                <span onClick={() => sendReaction(msg.id, '👍')}>👍</span>
                <span onClick={() => sendReaction(msg.id, '❤️')}>❤️</span>
                <span onClick={() => sendReaction(msg.id, '😂')}>😂</span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;