import { io } from 'socket.io-client';

const SOCKET_IO_URL = process.env.REACT_APP_SOCKET_IO_URL;
export const socket = io(SOCKET_IO_URL, { autoConnect: false });
