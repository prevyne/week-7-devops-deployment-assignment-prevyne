const jwt = require('jsonwebtoken');
const {
  handleRoomJoin,
  handleSendMessage,
  handleMessageRead,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
  handleMessageReaction,
} = require('../controllers/chatController'); // Corrected path

// In-memory stores
const onlineUsers = {};
const typingUsers = {};
const messages = [];

const configureSocket = (io) => {
  // --- JWT Authentication Middleware ---
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token not provided.'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token.'));
      }
      socket.user = decoded; // Attach user info to the socket
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Add user to online list
    onlineUsers[socket.id] = { username: socket.user.username, id: socket.id };
    
    // Join a default room and notify others
    socket.join('General');
    socket.currentRoom = 'General';
    io.emit('user_list', Object.values(onlineUsers));
    socket.emit('system_message', `Welcome! You are in the 'General' chat room.`);
    socket.to('General').emit('system_message', `${socket.user.username} has joined the chat.`);
    
    // --- Register Event Handlers ---
    handleRoomJoin(io, socket, onlineUsers);
    handleSendMessage(io, socket, onlineUsers, messages);
    handleMessageRead(io, socket);
    handleMessageReaction(io, socket, onlineUsers, messages);
    handleTyping(io, socket, onlineUsers, typingUsers);
    handlePrivateMessage(io, socket, onlineUsers, messages);

    // Use a modified disconnect handler
    handleDisconnect(io, socket, onlineUsers, typingUsers);
  });
};

module.exports = configureSocket;