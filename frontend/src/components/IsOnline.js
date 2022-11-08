import { socket } from './Socket';
export const isOnline = id => {
  return socket.emit('isOnline', id);
};
