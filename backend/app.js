var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var serverRouter = require("./routes/serverRoute");
let channelRouter = require("./routes/channelRoute");
let messageRouter = require("./routes/messageRoute");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", serverRouter);
app.use("/channelapi", channelRouter);
app.use("/msgapi", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// creating io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection",(socket)=>{
  console.log(`user with ${socket.id} socketID connected :)`)
  socket.on("send_message", (data) => {
      console.log(`author : ${data.author} | message : ${data.message} | channel Name: ${data.channelName} | time: ${data.timestamp}`)  
  });
})
// app.listen(5000, () => {
//   console.log(`server started on port 5000..`);
// });
server.listen(5000);
module.exports = app;
