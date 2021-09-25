const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log(socket.id);
  socket.on("custom-event", (number, string)=>{
    console.log(number + " " + string);

  })
});
