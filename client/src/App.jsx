import React from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage'; // Import the new AuthPage
import './index.css';

const AppContent = () => {
  const { isAuthenticated } = useSocket();
  return isAuthenticated ? <ChatPage /> : <AuthPage />;
};

const App = () => {
  return (
    <SocketProvider>
      <div className="app-container">
        <AppContent />
      </div>
    </SocketProvider>
  );
};

export default App;