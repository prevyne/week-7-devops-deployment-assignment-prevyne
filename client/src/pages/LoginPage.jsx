import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const { connect } = useSocket();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username.trim());
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Join Chat</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default LoginPage;