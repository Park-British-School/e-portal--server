const mongoose = require("mongoose");
const models = require("../models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
const classController = require("./class");

const Student = require("../models/studentModel");
const Class = require("../models/classModel");

const { notificationModel, invoiceModel } = models;

const metrics = async function (request, response) {
  try {
    let numberOfStudents = 0;
    let numberOfSuspendedStudents = 0;

    numberOfStudents += parseInt(models.studentModel.countDocuments({}));
    numberOfSuspendedStudents += parseInt(
      models.studentModel.countDocuments({ status: "suspended" })
    );

    return response.status(200).json({
      data: {
        numberOfStudents,
        numberOfSuspendedStudents,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response.status(400).json({});
  }
};

const find = async function (request, response) {
  try {
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(
      await models.studentModel.countDocuments({ ...request.body })
    );
    totalNumberOfPages = Math.ceil(totalCount / count);

    const students = await models.studentModel
      .find({ ...request.body }, {}, { limit: count, skip: (page - 1) * count })
      .sort({ createdAt: -1 })
      .populate(["class", "results"]);

    return response.status(200).json({
      data: {
        students,
        count: students.length,
        totalCount,
        totalNumberOfPages,
        page: page,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const findAll = async function (request, response) {
  try {
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(await models.studentModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const students = await models.studentModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .sort({ createdAt: -1 })
      .populate(["class", "results"]);

    return response.status(200).json({
      data: {
        students,
        count: students.length,
        totalCount,
        totalNumberOfPages,
        page: page,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const findOne = async function (request, response) {
  try {
    let student;
    let id = (student = await models.studentModel
      .findOne({ _id: request.query.id.replace(/-/g, "/") })
      .populate(["class", "results"]));
    if (!student) {
      return response
        .status(400)
        .json({ message: "Student not found!", statusCode: 400 });
    }
    return response.status(200).json({
      data: { student: student },
      statusCode: 200,
      message: "Success!",
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const updateOne = async function (request, response) {
  try {
    const student = await models.studentModel.findOne({
      _id: request.query.id.replace(/-/g, "/"),
    });
    if (!student) {
      return response
        .status(400)
        .json({ message: "Student not found!", statusCode: 400 });
    }

    switch (request.query.operation) {
      case "update":
        await models.studentModel.updateOne(
          { _id: request.query.id.replace(/-/g, "/") },
          { ...request.body }
        );
        return response
          .status(200)
          .json({ message: "Success!", statusCode: 200 });
      case "update_password":
        const salt = await bcrypt.genSalt(3);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        await models.studentModel.updateOne(
          { _id: request.query.id.replace(/-/g, "/") },
          { $set: { password: hashedPassword } }
        );
        return response
          .status(200)
          .json({ message: "Password updated successfully!", statusCode: 200 });
      default:
        return response
          .status(400)
          .json({ message: "Unknown operation!", statusCode: 400 });
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const search = async function (request, response) {
  try {
    let students = [];
    if (
      request.query.search &&
      request.query.search.trim() !== "" &&
      request.query.search.trim().length > 2
    ) {
      students = await models.studentModel.find({
        $or: [
          { firstName: new RegExp(request.query.search, "i") },
          { lastName: new RegExp(request.query.search, "i") },
          { emailAddress: new RegExp(request.query.search, "i") },
        ],
      });
    }

  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

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
      await models.resultModel.deleteOne({ _id: result });
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

exports.createStudent = async function (data, callback) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  Student.create({ ...data, password: hashedPassword })
    .then((document) => {
      if (data.class) {
        Class.updateOne(
          { _id: data.class },
          { $push: { students: document._id } },
          (error, documents) => {
            console.log(error);
          }
        );
      }
      if (data.image) {
        fs.writeFile(
          `${__dirname}/../uploads/images/profile/${document._id
            .toString()
            .replace(/\//g, "-")}.jpg`,
          data.image,
          "base64",
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        );
      }
      callback(null, document);
    })
    .catch((error) => {
      callback(error.message, null);
    });
};

exports.updateStudentByID = async function (studentID, data, callback) {
  Student.updateOne(
    { _id: studentID },
    { $set: { ...data } },
    (error, data) => {
      if (error) {
        callback(error.message);
      } else {
        callback(null);
      }
    }
  );
};

exports.deleteStudentByID = async function (studentID, callback) {
  Student.deleteOne({ _id: studentID }, (error) => {
    if (error) {
      callback(error);
    } else {
      models.resultModel
        .find()
        .where("student")
        .equals(studentID)
        .exec((error, results) => {
          if (error) {
            callback(error);
          } else {
            results.forEach((result, index) => {
              models.resultModel.deleteOne({ _id: result._id }, (error) => {
                if (error) {
                  console.log(error);
                }
              });
            });
          }
        });
      Class.find()
        .where("students")
        .in(studentID)
        .exec((error, classes) => {
          if (error) {
            console.log(error);
          } else {
            classes.forEach((_class, index) => {
              Class.updateOne(
                { _id: _class._id },
                { $pull: { students: studentID } }
              );
            });
          }
        });
    }
  });
};

exports.results = {
  findAll(studentID, callback) {
    Student.findByID(studentID, (error, document) => {
      if (error) {
        callback(error, null);
      } else {
        if (document) {
          console.log(document);
          callback(null, document.results ? document.results : []);
          return false;
        } else {
          callback("Student not found!", null);
          return false;
        }
      }
    });
  },
};

exports.invoices = {
  findAll() {
    Student.findByID(studentID, (error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        if (document) {
          callback(null, document.invoices);
        } else {
          callback("Student not found!", null);
        }
      }
    });
  },
};

//REFACTORING ENDS HERE

exports.metrics = metrics;
exports.find = find;
exports.search = search;
exports.findAll = findAll;
exports.findOne = findOne;
exports.updateOne = updateOne;
