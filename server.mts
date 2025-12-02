import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`);
    socket.on(
      "join-room",
      ({ room, userName }: { room: string; userName: string }) => {
        socket.join(room);
        console.log(`Room : ${room} , User connected : ${userName}`);
        socket.to(room).emit("user_joined", `${userName} joined to ${room}`);
      }
    );
    socket.on("message", ({ message, room ,sender }) => {
      console.log(`Message from : ${sender} in room ${room} : ${message} `)
      socket.to(room).emit("message", { sender, message });
    });
  });
  io.on("disconnet", (socket) => {
    console.log(`User Leave : ${socket}`);
  });
  httpServer.listen(port, () => {
    console.log(`A sever is running on : http://${hostname}:${port}`);
  });
});
