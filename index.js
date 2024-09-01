const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const routers = require("./routers");
const models = require("./models");
const http = require("node:http");
const socket = require("socket.io");

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});

const {
  studentRouter,
  teacherRouter,
  classRouter,
  resultRouter,
  imageRouter,
  termRouter,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter,
} = routers;

const { invoiceModel } = models;
invoiceModel.default();
const app = express();
const server = http.createServer(app);
const io = new socket.Server(server, {
  path: "/api/socket.io",
  cors: {
    origin: true,
    credentials: true,
  },
  transports: [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling",
    "polling",
  ],
  allowEIO3: true,
});
app.use(morgan("combined"));
app.use(cors({ origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", express.static(__dirname));
app.use("/admins", routers.administratorRouter);
app.use("/students", studentRouter);
app.use("/teachers", teacherRouter);
app.use("/classes", classRouter);
app.use("/results", resultRouter);
app.use("/images", imageRouter);
app.use("/term", termRouter);
app.use("/session", sessionRouter);
app.use("/invoices", invoiceRouter);
app.use("/fees", feeRouter);
app.use("/notifications", notificationRouter);
app.use("/auth", authRouter);
app.use("/announcements", announcementRouter);

app.use("/api/", express.static(__dirname));
app.use("/api/administrators", routers.administratorRouter);
app.use("/api/students", routers.studentRouter);
app.use("/api/teachers", routers.teacherRouter);
app.use("/api/classes", routers.classRouter);
app.use("/api/results", routers.resultRouter);
app.use("/api/images", imageRouter);
app.use("/api/term", termRouter);
app.use("/api/session", sessionRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/fees", feeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/variables", routers.variableRouter);
app.use("/api/conversations", routers.conversation);

app.get("/ping", (request, response) => {
  console.log("PING!!!");
  response.status(200).send("PINGV2");
});

server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected to /");
  console.log(socket.id);
  io.emit("connection_success");
});
