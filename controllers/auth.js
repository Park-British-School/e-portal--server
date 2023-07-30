const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const models = require("../models");
const studentController = require("./student");
const teacherController = require("./teacher");
const adminController = require("./administrator.controller");

const { administratorModel } = models;

exports.signin = {
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

  admin: async function (request, response) {
    let emailAddress = request.body.emailAddress;
    let password = request.body.password;
    let administrator;
    try {
      administrator = await administratorModel.findOne({ email: emailAddress });
      if (!administrator) {
        return response.status(400).send("Invalid email address or password");
      }
      let passwordMatch = await bcrypt.compare(
        request.body.password,
        administrator.password
      );
      if (!passwordMatch) {
        return response.status(400).send("Incorrect password!");
      }
      if (
        administrator.status === "banned" ||
        administrator.status === "suspended"
      ) {
        return response
          .status(400)
          .send(
            `This account has been ${administrator.status}, Please contact the administrator.`
          );
      }

      await administratorModel.updateOne(
        { _id: administrator._id },
        {
          $set: { lastSeen: new Date().getTime() },
        }
      );
      const accessToken = jsonwebtoken.sign(
        { id: administrator._id, role: administrator.role },
        process.env.TOKEN_SECRET
      );
      response.status(200).json({
        ...administrator.toJSON(),
        accessToken: accessToken,
      });
    } catch (error) {
      console.log(error.message);
      response.status(400).send("unable to process this request");
    }
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
