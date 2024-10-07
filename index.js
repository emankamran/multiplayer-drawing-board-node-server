import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", (data) => {
    const { prevPoint, currentPoint, color, lineWidth } = data;
    socket.broadcast.emit("draw-line", {
      prevPoint,
      currentPoint,
      color,
      lineWidth,
    });
  });

  socket.on("clear", () => io.emit("clear"));
});

app.get("/", (req, res) => {
  res.send("Server Deployed!");
});

server.listen(3000, () => {
  console.log("✔️ Server listening on port 3000");
});
