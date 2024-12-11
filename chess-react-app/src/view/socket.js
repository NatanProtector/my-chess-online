// socket.js
import { io } from 'socket.io-client';

const isProduction = process.env.NODE_ENV === 'production';

const socketUrl = isProduction
  ? process.env.REACT_APP_SOCKET_URL
  : 'http://localhost:3000';


const socket = io(socketUrl);
export default socket;