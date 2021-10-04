require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const app = express();
const routes = require("./routes.js");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use("/", routes);

// mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', () => {
 throw new Error(`unable to connect to database: ${process.env.MONGO_URI}`)
});

const userSchema = new mongoose.Schema({
  name: String
});

const User = mongoose.model("User", userSchema);

const user = new User({
  name: "testing"
});

user.save();


const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});




io.on("connection", socket => {
  console.log(socket.id);
  socket.on("send-message", (message, room)=>{
    console.log(message);
    if(room == ''){
      socket.broadcast.emit("receive-message", message);
    }
    else{
      socket.to(room).emit("receive-message", message);
    }

  })

  socket.on("join-room", room => {
    socket.join(room);
  })
});





app.listen(3000, (err) => {
 if (err) {
 console.log(err);
 }
 console.info('Server started on port %s.', 3000);
});
