const { Server } = require("socket.io");

let io;

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-support-room", (userId) => {
      socket.join(userId);
      console.log(`User joined support room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

};

const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };