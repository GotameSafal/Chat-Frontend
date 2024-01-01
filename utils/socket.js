import { io } from "socket.io-client";
export var socket;
export const connectToSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
  socket.on("connect", () => {
    console.log("connected to socket successfully");
  });
};
