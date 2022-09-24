const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});

const {
  studentRoute,
  teacherRoute,
  classRoute,
  resultRoute,
  imageRoute,
  adminRoute,
  termRoute,
  sessionRoute,
  invoiceRouter,
  feeRouter,
  notificationRouter,
} = require("./routes");

const server = express();
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));
server.use("/", express.static(__dirname));
server.use(cors());
server.use("/admins", adminRoute);
server.use("/students", studentRoute);
server.use("/teachers", teacherRoute);
server.use("/classes", classRoute);
server.use("/results", resultRoute);
server.use("/images", imageRoute);
server.use("/term", termRoute);
server.use("/session", sessionRoute);
server.use("/invoices", invoiceRouter);
server.use("/fees", feeRouter);
server.use("/notifications", notificationRouter);

server.get("/ping", (req, res) => {
  console.log("request at /testConnection");
  res.status(200).end();
});

server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
