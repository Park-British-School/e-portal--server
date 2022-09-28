const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const studentController = require("./student");
const staffController = require("./staff");
const adminController = require("./admin");

exports.signin = {
  student: async function (studentID, password, callback) {
    studentController.findStudentByID(
      studentID,
      {
        populateNotifications: false,
        populateClass: false,
        populateInvoices: false,
        populateResults: false,
      },
      (error, student) => {
        if (error) {
          callback(error, null);
        } else {
          if (student) {
            bcrypt
              .compare(password, student.password)
              .then((match) => {
                if (match) {
                  if (student.status === "banned") {
                    callback(
                      "This account has been banned, Please contact the administrator.",
                      null
                    );
                  } else {
                    const accessToken = jsonwebtoken.sign(
                      { id: student.id, role: "student" },
                      process.env.TOKEN_SECRET
                    );
                    callback(null, accessToken);
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
      }
    );
  },

  staff: async function (emailAddress, password, callback) {
    staffController.findByID(emailAddress, (error, staff) => {
      if (error) {
        callback(error, null);
      } else {
        bcrypt
          .compare(password, staff.password)
          .then((match) => {
            if (match) {
              if (staff.status === "banned") {
                callback(
                  "This account has been banned, Please contact the administrator.",
                  null
                );
              }
              if (staff.status === "suspended") {
                callback(
                  "This account has been suspended, Please contact the administrator.",
                  null
                );
              } else {
                const accessToken = jsonwebtoken.sign(
                  { id: staff.id, role: staff.role, subRole: staff.subRole },
                  process.env.TOKEN_SECRET
                );
                staffController.updateStaffByID(
                  staff.id,
                  {
                    $set: { lastSeen: new Date().getTime() },
                  },
                  (error) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      callback(null, {
                        accessToken: accessToken,
                        ...staff._doc,
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
    adminController.findByID(emailAddress, (error, admin) => {
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
              }
              if (admin.status === "suspended") {
                callback(
                  "This account has been suspended, Please contact the administrator.",
                  null
                );
              } else {
                const accessToken = jsonwebtoken.sign(
                  { id: admin.id, role: admin.role, subRole: admin.subRole },
                  process.env.TOKEN_SECRET
                );
                adminController.updateAdminByID(
                  admin.id,
                  {
                    $set: { lastSeen: new Date().getTime() },
                  },
                  (error) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      callback(null, {
                        accessToken: accessToken,
                        ...admin._doc,
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

exports.verifyAccessToken = async function (accessToken, callback) {};
