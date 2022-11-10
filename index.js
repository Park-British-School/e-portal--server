const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
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
  adminRouter,
  termRouter,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter,
} = routers;

const { invoiceModel } = models;

const server = express();
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));
server.use(cors());
server.use("/", express.static(__dirname));
server.use("/admins", adminRouter);
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

server.get("/ping", (request, response) => {
  console.log("PING!!!");
  response.status(200).end();
});

invoiceModel();

server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
