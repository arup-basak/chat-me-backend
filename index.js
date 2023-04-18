import { Server } from "socket.io";

const io = new Server();

io.on('connect', (socket) => {
  console.log("Connected")
  socket.on("disconnect", () => {
    console.log("Disconnect")
  });
  socket.on("send-message", (msg) => {
    try {
      io.emit('recieve-message', msg)
    } catch (error) {
      console.error(error)
    }
  });
});

const port = 80;

io.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
