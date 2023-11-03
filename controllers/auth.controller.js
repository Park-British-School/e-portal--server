const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const models = require("../models");
const studentController = require("./student");
const teacherController = require("./teacher");
const adminController = require("./administrator.controller");

const { administratorModel } = models;

exports.signin_deprecated = {
  student: async function (studentID, password, callback) {
    studentController.findStudentByID(studentID, (error, student) => {
      if (error) {
        callback(error, null);
      } else {
        if (student) {
          bcrypt
            .compare(password, student.password)
            .then((match) => {
              if (match) {
                if (
                  student.status === "banned" ||
                  student.status === "disabled"
                ) {
                  callback(
                    "This account has been banned, Please contact the administrator.",
                    null
                  );
                } else {
                  const accessToken = jsonwebtoken.sign(
                    { id: student.id, role: "student" },
                    process.env.TOKEN_SECRET
                  );
                  callback(null, {
                    accessToken: accessToken,
                    ...student._doc,
                  });
                }
              } else {
                callback("Password and StudentID do not match", null);
              }
            })
            .catch((error) => {
              callback(error, null);
            });
        } else {
          callback("Invalid student ID", null);
        }
      }
    });
  },
  teacher: async function (email, password, callback) {
    teacherController.findTeacherByEmailAddress(email, (error, teacher) => {
      if (error) {
        callback(error, null);
      } else {
        bcrypt
          .compare(password, teacher.password)
          .then((match) => {
            if (match) {
              if (
                teacher.status === "banned" ||
                teacher.status === "disabled"
              ) {
                callback(
                  "This account has been banned, Please contact the administrator.",
                  null
                );
              } else {
                const accessToken = jsonwebtoken.sign(
                  {
                    id: teacher._id,
                    role: teacher.role,
                  },
                  process.env.TOKEN_SECRET
                );
                teacherController.updateTeacherByID(
                  teacher._id,
                  {
                    $set: { lastSeen: new Date().getTime() },
                  },
                  (error) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      callback(null, {
                        accessToken: accessToken,
                        ...teacher._doc,
                      });
                    }
                  }
                );
              }
            } else {
              callback("Invalid email address or password", null);
            }
          })
          .catch((error) => {
            callback(error, null);
          });
      }
    });
  },
};

exports.verifyAccessToken = async function (accessToken, callback) {
  jsonwebtoken.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data);
    }
  });
};

const signIn = {
  administrator: async function (request, response) {
    try {
      let administrator;
      administrator = await administratorModel.findOne({
        email: request.body.emailAddress.toLowerCase(),
        isDeleted: false,
      });
      if (!administrator) {
        return response.status(400).send("Invalid email address");
      }
      let passwordMatch = await bcrypt.compare(
        request.body.password,
        administrator.password
      );
      if (!passwordMatch) {
        return response.status(400).json({
          message: "Incorrect password!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      if (administrator.isBanned === true) {
        return response.status(400).json({
          message: `This account has been banned!, Please contact the administrator.`,
          statusCode: 400,
          error: true,
          data: null,
        });
      }

      await administratorModel.updateOne(
        { _id: administrator._id },
        {
          $set: { lastSeen: new Date().getTime() },
        }
      );

      await models.administratorActivityLogModel.create({
        administrator: administrator._id,
        entity: administrator._id,
        type: "sign_in",
      });
      const accessToken = jsonwebtoken.sign(
        { id: administrator._id, role: administrator.role },
        process.env.TOKEN_SECRET
      );

      await models.sessionModel.create({
        administrator: administrator._id,
        accessToken: accessToken,
      });

      return response.status(200).json({
        message: "Success!",
        error: false,
        statusCode: 200,
        data: {
          administrator: administrator.toJSON(),
          accessToken: accessToken,
        },
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response.status(400).send("Unable to process this request!");
    }
  },
  teacher: async function (request, response) {
    try {
      const teacher = await models.teacherModel
        .findOne({
          email: request.body.emailAddress,
          isDeleted: false,
        })
        .populate(["class", "classes"]);
      if (!teacher) {
        return response.status(400).json({
          message: "Invalid email address!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      let passwordMatch = await bcrypt.compare(
        request.body.password,
        teacher.password
      );
      if (!passwordMatch) {
        return response.status(400).json({
          message: "Incorrect password!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      if (teacher.isBanned === true) {
        return response.status(400).json({
          message: `This account has been banned!, Please contact the administrator.`,
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      await models.teacherActivityLogModel.create({
        teacher: teacher._id,
        type: "sign_in",
      });
      const accessToken = jsonwebtoken.sign(
        { id: teacher._id, role: teacher.role },
        process.env.TOKEN_SECRET
      );

      await models.sessionModel.create({
        teacher: teacher._id,
        accessToken: accessToken,
      });

      return response.status(200).json({
        message: "Success!",
        statusCode: 200,
        error: false,
        data: {
          teacher: teacher.toJSON(),
          accessToken,
        },
      });
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
  student: async function (request, response) {
    try {
      const student = await models.studentModel
        .findOne({
          _id: request.body.id,
          isDeleted: false,
        })
        .populate(["results", "class"]);
      if (!student) {
        return response.status(400).json({
          message: "Invalid id!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }

      let passwordMatch = await bcrypt.compare(
        request.body.password,
        student.password
      );
      if (!passwordMatch) {
        return response.status(400).json({
          message: "Incorrect password!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      if (student.isBanned === true) {
        return response.status(400).json({
          message: `This account has been banned!, Please contact the administrator.`,
          statusCode: 400,
          error: true,
          data: null,
        });
      }

      await models.studentActivityLogModel.create({
        student: student._id,
        type: "sign_in",
      });
      const accessToken = jsonwebtoken.sign(
        { id: student._id, role: student.role },
        process.env.TOKEN_SECRET
      );

      await models.sessionModel.create({
        student: student._id,
        accessToken: accessToken,
      });
      return response.status(200).json({
        message: "Success",
        error: false,
        statusCode: 400,
        data: {
          student: student.toJSON(),
          accessToken,
        },
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response.status(400).json({
        message: "Unable to process this request!",
        error: false,
        statusCode: 400,
        data: null,
      });
    }
  },
};

const signOut = {
  administrator: async function (request, response) {
    try {
      const session = await models.sessionModel.findOne({
        accessToken: request
          .header("Authorization")
          .substring(7, request.header("Authorization").length),
      });
      if (!session) {
        return response.status(400).json({
          message: "Invalid session!",
          statusCode: 400,
          error: true,
          data: null,
        });
      }
      await models.sessionModel.deleteOne({ _id: session._id });
      await models.administratorActivityLogModel.create({
        administrator: request.administrator._id,
        entity: request.administrator._id,
        type: "sign_out",
      });
      return response.status(200).json({
        message: "Session ended successfully!",
        statusCode: 400,
        error: false,
        data: null,
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
};

exports.signIn = signIn;
exports.signOut = signOut;
