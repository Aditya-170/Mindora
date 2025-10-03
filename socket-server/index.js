const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("draw-action", ({ roomId, type, data }) => {
    socket.to(roomId).emit("draw-action", { type, data });
  });
  socket.on("cursor-move", ({ roomId, userId, name, x, y }) => {
    console.log("user connected for cursor" , name);
    socket.to(roomId).emit("cursor-move", { userId, name, x, y });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
