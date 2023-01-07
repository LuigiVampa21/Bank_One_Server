// const axios = require("axios");

const socketFunctions = (io, socket) => {
  console.log("new connection " + socket.id);
  
  
  socket.on("login", data => {
      console.log(data);
  });
};

// loadEvents = socket => {
//   let currentRoom;
//   socket.on("join_room", room => {
//     currentRoom = room;
//     socket.join(room);
//     console.log("user joined the room" + room);
//   });

//   socket.on("send_message", data => {
//     socket.emit("new_message", {
//       poster: data.poster,
//       content: data.content,
//       room: currentRoom,
//       date: Date.now(),
//     });
//   });

//   socket.on("leave_room", room => {
//     socket.leave(room);
//     console.log("user left the room" + room);
//   });

//   socket.on("connect_error", err => {
//     console.log(`connect_error due to ${err.message}`);
//   });

//   socket.on("end", function () {
//     socket.disconnect(0);
//   });

//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   });
// };

module.exports = socketFunctions;