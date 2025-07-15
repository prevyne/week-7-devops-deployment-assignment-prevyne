import { io } from 'socket.io-client';

//const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000' || 'https://week-5-web-sockets-assignment-prevyne.onrender.com';

const SOCKET_URL = 'https://week-5-web-sockets-assignment-prevyne.onrender.com';
// The connection is now configured to send the auth token from localStorage
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: localStorage.getItem('chat_token') });
  }
});