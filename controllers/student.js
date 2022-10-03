const mongoose = require("mongoose");
const models = require("../models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");

const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const Result = require("../models/resultModel");

const { notificationModel } = models;

exports.findAllStudents = async function (req, res) {
  const student = await Student.find({}).populate("class");
  res.json(student);
};

exports.getStudent = async function (req, res) {
  const studentID = req.params.studentID.replace(/-/g, "/");
  const student = await Student.findById(studentID).populate([
    "class",
    "results",
  ]);
  res.status(200).json(student);
};

exports.addStudent = async function (req, res) {
  try {
    const salt = await bcrypt.genSalt(3);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newStudent = await new Student({
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
      address: req.body.address,
      password: hashedPassword,
    }).save();
    if (req.body.class) {
      const isValid = mongoose.Types.ObjectId.isValid(req.body.class);
      if (isValid) {
        await Class.updateOne(
          { _id: req.body.class },
          { $push: { students: newStudent._id } }
        );
      } else {
        throw "This class doesnt exist";
      }
    }
    if (req.body.image) {
      fs.writeFile(
        `${__dirname}/../uploads/images/profile/${newStudent._id
          .toString()
          .replace(/\//g, "-")}.jpg`,
        req.body.image,
        "base64",
        (err) => {
          if (err) {
            throw "upload rror";
          }
        }
      );
    }
    res.status(200).json(newStudent);
  } catch (err) {
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.login = async function (req, res) {
  try {
    //CHECK IF THE STUDENT EXISTS
    const student = await Student.findOne({ _id: req.body.id }).populate([
      "class",
      "results",
    ]);
    if (student) {
      //CHECK IF THE PASSWORD MATCHES
      const isPasswordMatched = await bcrypt.compare(
        req.body.password,
        student.password
      );
      if (isPasswordMatched) {
        //SIGN THE STUDENT ID AND ROLE WITH JSONWEBTOKEN
        const token = jsonwebtoken.sign(
          { _id: student._id, role: "student" },
          process.env.TOKEN_SECRET
        );
        //CHECK IF THE STUDENT ACCOUNT IS ACTIVE
        const isActive = student.status === "active";
        if (isActive) {
          await Student.updateOne(
            { _id: student._id },
            { lastSeen: new Date().getTime() }
          );
          res.status(200).json({ authToken: token, ...student._doc });
        } else {
          throw "This account has been deactivated, Please contact an administrator";
        }
      } else {
        throw "Invalid ID or Password";
      }
    } else {
      throw "Invalid ID or Password";
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.activate = async function (req, res) {
  //RE-FORMAT THE STUDENT ID
  const studentID = req.params.studentID.replace(/-/g, "/");
  try {
    //CHECK IF THE ACCOUNT EXISTS
    const student = await Student.findById(studentID);
    if (student) {
      if (student.status === "inactive") {
        await Student.updateOne({ _id: studentID }, { status: "active" });
        res.status(200).json({});
      } else {
        throw "Account already activated";
      }
    } else {
      throw "This account doesn't exist, please try again";
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.deactivate = async function (req, res) {
  //RE-FORMAT THE STUDENT ID
  const studentID = req.params.studentID.replace(/-/g, "/");
  try {
    //CHECK IF THE ACCOUNT EXISTS
    const student = await Student.findById(studentID);
    if (student) {
      if (student.status === "active") {
        await Student.updateOne({ _id: studentID }, { status: "inactive" });
        res.status(200).json({});
      } else {
        throw "Account already deactivated";
      }
    } else {
      throw "This account doesn't exist, please try again";
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports._delete = async function (req, res) {
  try {
    //RE-FORMAT THE STUDENT ID
    const studentID = req.params.studentID.replace(/-/g, "/");
    const student = await Student.findByIdAndDelete(studentID);
    await Class.updateOne(
      { _id: student.class },
      { $pull: { students: student._id } }
    );
    await student.results.forEach(async (result) => {
      await Result.deleteOne({ _id: result });
    });
    res.status(200).json({});
  } catch (err) {
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const studentID = req.params.studentID.replace(/-/g, "/");
    await Student.updateOne({ _id: studentID }, { ...req.body });
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.getStudents = async function (req, res) {
  try {
    const studentID = req.body.studentID;
    const students = req.body
      .find({ id: studentID })
      .populate(["class", "results"]);
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.getAllNotifications = async function (request, response) {
  const studentID = request.params.studentID.replace(/-/g, "/");
  notificationModel().find({ recipient: studentID }, (error, documents) => {
    response.status(200).json(documents);
  });
};

exports.deleteNotificationByID = async function (request, response) {};

// REFACTORING STARTS HERE

exports.countAllStudents = async function (callback) {
  Student.countDocuments({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};

exports.findAllStudents = async function (options, callback) {
  if (options.paginate) {
    Student.find()
      .sort({
        firstName: "asc",
      })
      .limit(options.count)
      .skip(options.count * (options.page - 1))
      .exec(function (error, students) {
        callback(null, students);
      });
  } else {
    Student.findAll((error, document) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, document);
      }
    });
  }
};

exports.findStudentByID = async function (studentID, callback) {
  Student.findByID(studentID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findStudentByName = async function (name, callback) {
  Student.findByName(name, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findStudents = async function (options, callback) {};

//REFACTORING ENDS HERE
