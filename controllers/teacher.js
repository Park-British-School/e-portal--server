const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");
const Class = require("../models/classModel");
const fs = require("fs");
const models = require("../models");

exports.getAllTeachers = async function (req, res) {
  const teachers = await Teacher.find({}, "-image");
  res.status(200).json(teachers);
};
exports.getTeacher = async function (req, res) {
  const teacher = await Teacher.findOne({ _id: req.params.id });
  res.status(200).json(teacher);
};
exports.addTeacher = async function (req, res) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newTeacher = await new Teacher({
    ...req.body,
    password: hashedPassword,
  }).save();
  if (req.body.class) {
    const isValidClass = mongoose.Types.ObjectId.isValid(req.body.class);
    if (isValidClass) {
      await Class.updateOne(
        { _id: req.body.class },
        { $push: { teachers: newTeacher._id } }
      );
    }
  }
  if (req.body.image) {
    fs.writeFile(
      `${__dirname}/../uploads/images/profile/${newTeacher._id
        .toString()
        .replace(/\//g, "-")}.jpg`,
      req.body.image,
      "base64",
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }
  res.status(200).json(newTeacher);
};

exports.login = async function (req, res) {
  try {
    //CHECK IF THE TEACHER EXISTS
    const teacher = await Teacher.findOne({ email: req.body.email }).populate(
      "class"
    );
    if (teacher) {
      //CHECK IF THE PASSWORD MATCHES
      const isPasswordMatched = await bcrypt.compare(
        req.body.password,
        teacher.password
      );
      if (isPasswordMatched) {
        //SIGN THE STUDENT ID AND ROLE WITH JSONWEBTOKEN
        const token = jsonwebtoken.sign(
          { _id: teacher._id, role: "teacher" },
          process.env.TOKEN_SECRET
        );
        const isActive = teacher.status === "active";
        if (isActive) {
          res.status(200).json({ authToken: token, ...teacher._doc });
        } else {
          throw "This account has been deactivated, Please contact an administrator";
        }
      } else {
        //THROW ERROR FOR INCORRECT PASSWORD
        throw "Invalid Email or Password";
      }
    } else {
      //THROW ERROR FOR INVALID EMAIL ADDRESS
      throw "Invalid Email or Password";
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
  //RE-FORMAT THE TEACHER ID
  const teacherID = req.params.teacherID.replace(/-/g, "/");
  try {
    //CHECK IF THE ACCOUNT EXISTS
    const teacher = await Teacher.findById(teacherID);
    if (teacher) {
      if (teacher.status === "inactive") {
        await Teacher.updateOne({ _id: teacherID }, { status: "active" });
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
  const teacherID = req.params.teacherID.replace(/-/g, "/");
  try {
    //CHECK IF THE ACCOUNT EXISTS
    const teacher = await Teacher.findById(teacherID);
    if (teacher) {
      if (teacher.status === "active") {
        await Teacher.updateOne({ _id: teacherID }, { status: "inactive" });
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
    //RE-FORMAT THE TEACHER ID
    const teacherID = req.params.teacherID.replace(/-/g, "/");
    await Teacher.findByIdAndDelete(teacherID);
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
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(3);
    const teacherID = req.params.teacherID.replace(/-/g, "/");
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }
    await Teacher.updateOne(
      { _id: teacherID },
      { ...req.body, password: hashedPassword }
    );
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

// REFACTORING STARTS HERE

exports.countAllTeachers = async function (callback) {
  Teacher.countDocuments({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};

exports.findAllTeachers = async function (options, callback) {
  Teacher.findAll((error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findTeacherByID = async function (ID, callback) {
  Teacher.findByID(ID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findTeacherByName = async function (name, callback) {
  Teacher.findByName(name, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findTeacherByEmailAddress = async function (email, callback) {
  Teacher.findByEmailAddress(email, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.createTeacher = async function (data, callback) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  Teacher.create({ ...data, password: hashedPassword })
    .then((document) => {
      if (data.class && data.class.length > 0) {
        Class.updateOne(
          { _id: data.class },
          { $push: { teachers: document._id } },
          (error, documents) => {
            if (error) {
              console.log(error);
            }
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
      if (error) {
        callback(error, null);
      }
    });
};

exports.updateTeacherByID = async function (ID, update, callback) {
  Teacher.updateOne({ _id: ID }, { ...update }, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

exports.deleteTeacherByID = async function (ID, callback) {
  Teacher.deleteOne({ _id: ID }, (error) => {
    if (error) {
      callback(error);
    } else {
      Class.find()
        .where("teachers")
        .in(ID)
        .exec((error, classes) => {
          if (error) {
            console.log(error);
          } else {
            classes.forEach((_class, index) => {
              Class.updateOne(
                { _id: _class._id },
                { $pull: { teachers: ID } },
                (error) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            });
            callback(null);
          }
        });
    }
  });
};

const metrics = async function (request, response) {
  try {
    let totalNumberOfTeachers = 0;
    let totalNumberOfBannedTeachers = 0;
    let totalNumberOfDeletedTeachers = 0;

    totalNumberOfTeachers = parseInt(
      await models.teacherModel.countDocuments({ isDeleted: false })
    );
    totalNumberOfBannedTeachers = parseInt(
      await models.teacherModel.countDocuments({ isBanned: true })
    );
    totalNumberOfDeletedTeachers = parseInt(
      await models.teacherModel.countDocuments({ isDeleted: true })
    );

    return response.status(200).json({
      message: "Success!",
      statusCode: 200,
      data: {
        totalNumberOfTeachers,
        totalNumberOfBannedTeachers,
        totalNumberOfDeletedTeachers,
      },
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
    let teachers = [];
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(await models.teacherModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    teachers = await models.teacherModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .sort({ createdAt: -1 })
      .populate(["class", "classes"]);

    return response.status(200).json({
      data: {
        teachers,
        count: teachers.length,
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
    let teacher;

    teacher = await models.teacherModel
      .findOne({ _id: request.query.id })
      .populate(["class"]);
    if (!teacher) {
      return response
        .status(400)
        .json({ message: "Teacher not found!", statusCode: 400 });
    }

    return response
      .status(200)
      .json({ data: { teacher }, message: "Success!", statusCode: 200 });
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
    let teacher;
    teacher = await models.teacherModel.findOne({ _id: request.query.id });
    if (!teacher) {
      return response
        .status(400)
        .json({ message: "Teacher not found!", statusCode: 400 });
    }

    switch (request.query.operation) {
      case "update":
        return response
          .status(200)
          .json({ message: "Teacher updated successfully!", statusCode: 200 });

      case "ban":
        await models.teacherModel.updateOne(
          { _id: request.query.id },
          { $set: { status: "banned", updatedAt: new Date().getTime() } }
        );
        return response
          .status(200)
          .json({ message: "Teacher banned successfully", statusCode: 200 });

      case "unban":
        await models.teacherModel.updateOne(
          { _id: request.query.id },
          { $set: { status: "active", updatedAt: new Date().getTime() } }
        );

        return response
          .status(200)
          .json({ message: "Teacher unbanned successfully", statusCode: 200 });
      case "update_password":
        const salt = await bcrypt.genSalt(3);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        await models.teacherModel.updateOne(
          { _id: request.query.id },
          { $set: { password: hashedPassword } }
        );
        return response
          .status(200)
          .json({ message: "Password updated successfully!", statusCode: 200 });
      default:
        return response
          .status(400)
          .json({ message: "Invalid operation!", statusCode: 400 });
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const activityLogs = {
  findAll: async function (request, response) {
    try {
      let teacherActivityLogs = [];
      let count = parseInt(request.query.count) || 10;
      let page = parseInt(request.query.page) || 1;
      let totalCount = 0;
      let totalNumberOfPages = 1;

      totalCount = parseInt(
        await models.teacherActivityLogModel.countDocuments({})
      );
      totalNumberOfPages = Math.ceil(totalCount / count);

      teacherActivityLogs = await models.teacherActivityLogModel
        .find({}, {}, { limit: count, skip: (page - 1) * count })
        .sort({ createdAt: -1 })
        .populate(["teacher"]);

      return response.status(200).json({
        data: {
          teacherActivityLogs,
          count: teacherActivityLogs.length,
          totalCount,
          totalNumberOfPages,
          page: page,
        },
        statusCode: 200,
        error: false,
        message: "Success!",
      });
    } catch (error) {
      console.log(error.stack);
      console.log(error.message);
      return response.status(400).json({
        message: "Unable to process this request!",
        error: true,
        statusCode: 400,
        data: null,
      });
    }
  },
  deleteAll: async function (request, response) {
    try {
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response.status(400).json({
        message: "Unable to process this request!",
        error: true,
        statusCode: 400,
        data: null,
      });
    }
  },
};

exports.metrics = metrics;
exports.findAll = findAll;
exports.findOne = findOne;
exports.updateOne = updateOne;
exports.activityLogs = activityLogs;
