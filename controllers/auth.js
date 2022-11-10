const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const studentController = require("./student");
const teacherController = require("./teacher");
const adminController = require("./admin");

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

  admin: async function (emailAddress, password, callback) {
    adminController.findAdminByEmailAddress(emailAddress, (error, admin) => {
      if (error) {
        callback(error, null);
      } else {
        bcrypt
          .compare(password, admin.password)
          .then((match) => {
            if (match) {
              if (admin.status === "banned") {
                callback(
                  "This account has been banned, Please contact the administrator.",
                  null
                );
              } else {
                const accessToken = jsonwebtoken.sign(
                  { id: admin._id, role: admin.role },
                  process.env.TOKEN_SECRET
                );
                callback(null, {
                  accessToken: accessToken,
                  ...admin._doc,
                });
                // adminController.updateAdminByID(
                //   admin.id,
                //   {
                //     $set: { lastSeen: new Date().getTime() },
                //   },
                //   (error) => {
                //     if (error) {
                //       callback(error, null);
                //     } else {

                //     }
                //   }
                // );
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
