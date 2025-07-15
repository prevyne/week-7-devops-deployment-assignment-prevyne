import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import RoomList from '../components/RoomList';
import HamburgerMenu from '../components/HamburgerMenu';

const ChatPage = () => {
  const { users, messages, typingUsers, sendMessage, setTyping, currentRoom, logout } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="app-layout">
        <HamburgerMenu onClick={toggleSidebar} />

        {/* --- Sidebar for both mobile and desktop --- */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Channels</h3>
            <button onClick={toggleSidebar} className="close-sidebar-btn">&times;</button>
          </div>
          <RoomList onRoomSelect={isSidebarOpen ? toggleSidebar : undefined} />
        </div>
        
        {/* --- Main Chat Area --- */}
        <div className="chat-container">
          <header className="chat-header">
            <div className="room-info">
              <h2>#{currentRoom}</h2>
              <p>{users.length} members online</p>
            </div>
            <button onClick={logout} className="logout-btn">Logout</button>
          </header>
          
          <div className="chat-main">
            <div className="chat-content">
              <MessageList messages={messages} />
              <TypingIndicator typingUsers={typingUsers} />
              <MessageInput onSendMessage={sendMessage} onTyping={setTyping} />
            </div>
            <div className="chat-user-list">
              <UserList users={users} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;