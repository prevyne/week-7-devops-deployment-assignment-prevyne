import React from 'react';
import { useSocket } from '../context/SocketContext';

const rooms = ['General', 'Technology', 'Sports', 'Random'];

const RoomList = ({ onRoomSelect }) => {
  const { joinRoom, currentRoom } = useSocket();

  const handleRoomClick = (room) => {
    joinRoom(room);
    // If the onRoomSelect function is provided (on mobile), call it.
    if (onRoomSelect) {
      onRoomSelect();
    }
  };

  return (
    <aside className="room-list">
      <h3>Channels</h3>
      <ul>
        {rooms.map((room) => (
          <li
            key={room}
            className={room === currentRoom ? 'active' : ''}
            onClick={() => handleRoomClick(room)}
          >
            # {room}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RoomList;