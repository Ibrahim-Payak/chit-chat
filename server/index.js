const express = require("express");
const socetio = require("socket.io");
const http = require("http"); //buitin node module

const port = process.env.port || 5000;

//import helper function
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");

//import router

const router = require("./router");
const { use } = require("./router");

// socket.io server setup
const app = express();
const server = http.createServer(app);
const io = socetio(server); //instance of socket.io

//use for register client joining and client leaving

io.on("connection", (socket) => {
  //   console.log("new user added");

  //event name should same we used in chat.js (data getting from front end)
  //also can do callback (and trigger that after event emitted)
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);

    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) callback({ error: "error" });

    //emit new event (welcome message for user enter into room)
    socket.emit("message", {
      user: "admin",
      text: `${user?.name}, welcome to the room ${user?.room}`,
    });

    //brodcast send message to everyone
    socket.broadcast
      .to(user?.room)
      .emit("message", { user: "admin", text: `${user?.name} has joined!` });

    //built in socket mthod if user exist
    socket.join(room);

    socket
      .to(user?.room)
      .emit("roomData", {
        room: user?.room,
        users: getUsersInRoom(user?.room),
      });

    callback(); //if error callback not work
  });

  //events for user generated messages (on: backend, emit: frontend)
  //emit listner
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user?.room).emit("message", { user: user?.name, text: message });
    io.to(user?.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    //to do something after message has sent
    callback();
  });

  socket.on("disconnect", () => {
    // console.log("user left");
    //remove user
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);

//server running
server.listen(port, () =>
  console.log(`server started running on port ${port}`)
);
