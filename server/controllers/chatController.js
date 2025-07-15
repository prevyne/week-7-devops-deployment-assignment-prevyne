const handleUserJoin = (io, socket, users) => {
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    socket.join('General');
    socket.currentRoom = 'General';
    io.emit('user_list', Object.values(users));
    socket.emit('system_message', `You joined the 'General' chat room.`);
    socket.to('General').emit('system_message', `${username} has joined the chat.`);
  });
};

const handleRoomJoin = (io, socket, users) => {
  socket.on('join_room', (roomName) => {
    const username = users[socket.id]?.username;
    if (!username) return;

    socket.leave(socket.currentRoom);
    socket.to(socket.currentRoom).emit('system_message', `${username} has left the room.`);
    
    socket.join(roomName);
    socket.currentRoom = roomName;
    socket.emit('system_message', `You joined the '${roomName}' chat room.`);
    socket.to(roomName).emit('system_message', `${username} has joined the room.`);
  });
};

const handleSendMessage = (io, socket, users, messages) => {
  socket.on('send_message', (message) => {
    if (!socket.currentRoom) return;

    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      status: 'sent',
      reactions: {}, // Initialize reactions
      timestamp: new Date().toISOString(),
    };
    messages.push(messageData); // Store the message
    io.to(socket.currentRoom).emit('receive_message', messageData);
  });
};

// --- NEW: Handles adding/removing reactions ---
const handleMessageReaction = (io, socket, users, messages) => {
  socket.on('send_reaction', ({ messageId, reaction }) => {
    const username = users[socket.id]?.username;
    const message = messages.find((msg) => msg.id === messageId);

    if (!message || !username) return;

    // If the reaction object doesn't exist, create it
    if (!message.reactions[reaction]) {
      message.reactions[reaction] = [];
    }

    const userIndex = message.reactions[reaction].indexOf(username);

    if (userIndex === -1) {
      // User hasn't reacted yet, add them
      message.reactions[reaction].push(username);
    } else {
      // User has reacted, remove them
      message.reactions[reaction].splice(userIndex, 1);
    }
    
    // If a reaction has no users, remove the emoji key
    if (message.reactions[reaction].length === 0) {
      delete message.reactions[reaction];
    }

    // Broadcast the updated message to the room
    io.to(socket.currentRoom).emit('update_message', message);
  });
};

const handleMessageRead = (io, socket) => {
  socket.on('message_read', ({ messageId, senderId }) => {
    io.to(senderId).emit('message_status_update', { messageId, status: 'read' });
  });
};

const handleTyping = (io, socket, users, typingUsers) => {
  socket.on('typing', (isTyping) => {
    if (!socket.currentRoom) return;
    const username = users[socket.id]?.username;
    if (!username) return;

    if (isTyping) {
      typingUsers[socket.id] = username;
    } else {
      delete typingUsers[socket.id];
    }
    socket.to(socket.currentRoom).emit('typing_users', Object.values(typingUsers));
  });
};

const handlePrivateMessage = (io, socket, users, messages) => {
  socket.on('send_private_message', ({ recipientSocketId, message }) => {
    try {
      const sender = users[socket.id];
      const recipient = users[recipientSocketId];

      if (!sender || !recipient) return;

      const messageData = {
        id: Date.now(),
        sender: sender.username,
        senderId: socket.id,
        message,
        recipient: recipient.username,
        isPrivate: true,
        status: 'sent',
        reactions: {}, // Initialize reactions
        timestamp: new Date().toISOString(),
      };
      
      messages.push(messageData); // Store the message

      io.to(recipientSocketId).emit('receive_message', messageData);
      socket.emit('receive_message', messageData);

    } catch (error) {
      console.error('An error occurred while handling a private message:', error);
    }
  });
};

const handleDisconnect = (io, socket, users, typingUsers) => {
  socket.on('disconnect', () => {
    const user = socket.user; // Get user from token
    if (user) {
      if(socket.currentRoom) {
        socket.to(socket.currentRoom).emit('system_message', `${user.username} has left the chat.`);
      }
      console.log(`${user.username} left.`);
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
};

module.exports = {
  handleRoomJoin,
  handleSendMessage,
  handleMessageRead,
  handleMessageReaction,
  handleTyping,
  handleDisconnect,
  handlePrivateMessage,
};