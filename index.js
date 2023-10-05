const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const routers = require("./routers");
const models = require("./models");

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

const server = express();
server.use(morgan("combined"));
server.use(cors({ origin: true }));
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));
server.use("/", express.static(__dirname));
server.use("/admins", routers.administratorRouter);
server.use("/students", studentRouter);
server.use("/teachers", teacherRouter);
server.use("/classes", classRouter);
server.use("/results", resultRouter);
server.use("/images", imageRouter);
server.use("/term", termRouter);
server.use("/session", sessionRouter);
server.use("/invoices", invoiceRouter);
server.use("/fees", feeRouter);
server.use("/notifications", notificationRouter);
server.use("/auth", authRouter);
server.use("/announcements", announcementRouter);

server.use("/api/", express.static(__dirname));
server.use("/api/administrators", routers.administratorRouter);
server.use("/api/students", routers.studentRouter);
server.use("/api/teachers", routers.teacherRouter);
server.use("/api/classes", routers.classRouter);
server.use("/api/results", routers.resultRouter);
server.use("/api/images", imageRouter);
server.use("/api/term", termRouter);
server.use("/api/session", sessionRouter);
server.use("/api/invoices", invoiceRouter);
server.use("/api/fees", feeRouter);
server.use("/api/notifications", notificationRouter);
server.use("/api/auth", authRouter);
server.use("/api/announcements", announcementRouter);
server.use("/api/variables", routers.variableRouter);

server.get("/ping", (request, response) => {
  console.log("PING!!!");
  response.status(200).end();
});

server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
