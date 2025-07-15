import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const AuthPage = () => {
  const { login, register } = useSocket();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await login(username, password);
      } else {
        await register(username, password);
        // Switch to login view after successful registration
        setIsLoginView(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} style={{ width: '300px', textAlign: 'center' }}>
        <h2>{isLoginView ? 'Login' : 'Register'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {isLoginView ? 'Login' : 'Register'}
        </button>
        <p style={{ marginTop: '1rem' }}>
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => setIsLoginView(!isLoginView)}
            style={{ color: '#007bff', cursor: 'pointer', marginLeft: '5px' }}
          >
            {isLoginView ? 'Register' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;