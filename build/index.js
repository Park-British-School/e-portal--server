var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };

// models/invoiceModel.js
var require_invoiceModel = __commonJS({
  "models/invoiceModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var { Schema, model } = mongoose2;
    var feeSchema = new Schema({
      title: { type: String, required: true },
      subTitle: { type: String },
      amount: {
        type: Number,
        required: true,
      },
    });
    var invoiceSchema = {
      default: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: {
            type: String,
            required: true,
            default: "DEFAULT",
          },
          issuedTo: {
            type: String,
            required: true,
            ref: "Student",
          },
          issuedAt: {
            type: Date,
            default: /* @__PURE__ */ new Date().getTime(),
          },
          status: {
            type: String,
            default: "Unpaid",
            enum: {
              values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
              message: "{VALUE} is not a valid option for status",
            },
          },
        },
        { collection: "invoices" }
      ),
      template: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: { type: String, default: "TEMPLATE" },
          title: { type: String, required: true },
        },
        { collection: "invoices" }
      ),
      draft: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: { type: String, default: "DRAFT" },
          issuedTo: {
            type: String,
            ref: "Student",
          },
          status: {
            type: String,
            default: "Unpaid",
            enum: {
              values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
              message: "{VALUE} is not a valid option for status",
            },
          },
        },
        { collection: "invoices" }
      ),
    };
    module2.exports = {
      default: mongoose2.model("INVOICE_DEFAULT", invoiceSchema.default),
      template: mongoose2.model("INVOICE_TEMPLATE", invoiceSchema.template),
      draft: mongoose2.model("INVOICE_DRAFT", invoiceSchema.draft),
    };
  },
});

// models/notification.js
var require_notification = __commonJS({
  "models/notification.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var { Schema, model } = mongoose2;
    var newInvoiceNotificationSchema = new Schema({
      recipient: {
        type: String,
        ref: "Student",
        required: true,
      },
      type: {
        type: String,
        default: "NEW_INVOICE",
      },
      invoiceID: {
        type: String,
        required: true,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    });
    var newInvoiceNotificationModel = model(
      "NewInvoiceNotification",
      newInvoiceNotificationSchema,
      "notifications"
    );
    var newMessageNotificationSchema = new Schema({
      recipient: {
        type: String,
        ref: "Student",
        required: true,
      },
      type: {
        type: String,
        default: "NEW_MESSAGE",
      },
    });
    var newMessageNotificationModel = model(
      "NewMessageNotification",
      newMessageNotificationSchema,
      "notifications"
    );
    var notificationModel = model("Notification", {}, "notifications");
    module2.exports = function (type) {
      switch (type) {
        case "NEW_INVOICE":
          return newInvoiceNotificationModel;
        case "NEW_MESSAGE":
          return newMessageNotificationModel;
        default:
          return notificationModel;
      }
    };
  },
});

// models/announcement.js
var require_announcement = __commonJS({
  "models/announcement.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var { Schema, model } = mongoose2;
    var announcementSchema = new Schema(
      {
        title: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        privacy: {
          type: String,
          required: true,
          enum: ["general", "class", "teacher", "student", "admin"],
          default: "general",
        },
        createdBy: {
          id: {
            type: String,
          },
          role: {
            type: String,
          },
        },
        isHidden: {
          type: String,
          default: false,
        },
        createdAt: {
          type: Date,
          default: /* @__PURE__ */ new Date().getTime(),
        },
        populatedFields: {},
      },
      {
        collection: "announcements",
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
      }
    );
    announcementSchema.static("findAll", function (options, callback2) {
      this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    Array(["Staff", "Student", "Admin"]).forEach((item) => {
      announcementSchema.virtual("populatedFields.createdBy", {
        ref: item,
        foreignField: "id",
        localField: "createdBy.id",
        justOne: true,
      });
    });
    announcementSchema.virtual("populatedFields.class", {
      ref: "Class",
      foreignField: "_id",
      localField: "class",
      justOne: true,
    });
    module2.exports = (options) => {
      if (options) {
        if (options.visibility === "class") {
          announcementSchema.add({
            class: { type: String, required: true },
          });
        } else {
          announcementSchema.remove("class");
        }
      }
      return model("Announcement", announcementSchema);
    };
  },
});

// models/studentModel.js
var require_studentModel = __commonJS({
  "models/studentModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var studentSchema = new mongoose2.Schema(
      {
        _id: {
          type: String,
          unique: true,
          lowercase: true,
          trim: true,
          required: true,
        },
        firstName: {
          type: String,
          lowercase: true,
          trim: true,
          required: true,
        },
        lastName: {
          type: String,
          lowercase: true,
          trim: true,
          required: true,
        },
        emailAddress: {
          type: String,
          lowercase: true,
          trim: true,
        },
        phoneNumber: {
          type: String,
          trim: true,
        },
        gender: {
          type: String,
          lowercase: true,
          enum: ["male", "female"],
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          lowercase: true,
          default: "student",
        },
        address: {
          type: String,
          required: true,
        },
        results: [
          {
            type: mongoose2.Types.ObjectId,
            ref: "Result",
          },
        ],
        invoices: [
          {
            type: String,
            ref: "INVOICE_DEFAULT",
          },
        ],
        status: {
          type: String,
          default: "active",
        },
        createdAt: {
          type: Date,
          default: () => /* @__PURE__ */ new Date().getTime(),
        },
        lastSeen: {
          type: Date,
          default: () => /* @__PURE__ */ new Date().getTime(),
        },
      },
      { collection: "students", minimize: false }
    );
    studentSchema.static("findAll", function (callback2) {
      return this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    studentSchema.static("findByID", function (ID2, callback2) {
      return this.find({ _id: ID2 })
        .populate(["results", "invoices"])
        .exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            if (documents.length === 0) {
              callback2(null, null);
            } else {
              callback2(null, documents[0]);
            }
          }
        });
    });
    studentSchema.static("findByName", function (name, callback2) {
      return this.find(
        {
          $or: [{ firstName: name }, { lastName: name }],
        },
        (error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents[0]);
          }
        }
      );
    });
    studentSchema.static("findBySearch", function (search, callback2) {
      return this.find(
        {
          $or: [
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") },
          ],
        },
        (error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        }
      );
    });
    var Student = mongoose2.model("Student", studentSchema);
    module2.exports = Student;
  },
});

// models/adminModel.js
var require_adminModel = __commonJS({
  "models/adminModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var adminSchema = new mongoose2.Schema({
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        lowercase: true,
        enum: ["male", "female"],
        required: true,
      },
      maritalStatus: {
        type: String,
        lowercase: true,
        enum: ["single", "married"],
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        lowercase: true,
        default: "admin",
      },
      address: {
        type: String,
      },
    });
    adminSchema.static("findAll", function (callback2) {
      return this.find().exec((error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    adminSchema.static("findByEmailAddress", function (email, callback2) {
      return this.find({ email }, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents[0]);
        }
      });
    });
    var Admin = mongoose2.model("Admin", adminSchema);
    module2.exports = Admin;
  },
});

// models/resultModel.js
var require_resultModel = __commonJS({
  "models/resultModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var resultSchema = mongoose2.Schema({
      student: {
        type: String,
        ref: "Student",
        required: true,
      },
      school: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      class: {
        type: mongoose2.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      session: {
        type: String,
        required: true,
        lowercase: true,
      },
      term: {
        type: String,
        required: true,
        lowercase: true,
      },
      scoreSheet: {
        type: String,
        required: true,
      },
      overallGrade: {
        type: String,
      },
      overallPercentage: {
        type: Number,
      },
      electives: [
        {
          title: {
            type: String,
          },
          grade: {
            type: String,
          },
        },
      ],
      teachersRemark: {
        type: String,
        required: true,
      },
      principalsRemark: {
        type: String,
      },
      resumptionDate: {
        type: String,
      },
      gradingScale: {
        type: String,
      },
      uploadedAt: {
        type: Date,
        default: () => /* @__PURE__ */ new Date().getTime(),
      },
      isApproved: {
        type: Boolean,
        required: true,
        default: false,
      },
      type: {
        type: String,
        required: true,
      },
      comments: {
        type: String,
        default: "N/A",
      },
    });
    resultSchema.static("findAll", function (callback2) {
      return this.find()
        .populate([
          { path: "class", select: "-image -password" },
          { path: "student", select: "-image -password" },
          { path: "uploadedBy", select: "-image -password" },
        ])
        .exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
    });
    resultSchema.static("findByID", function (ID2, callback2) {
      return this.find({ _id: ID2 }, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          if (documents.length === 0) {
            callback2(null, null);
          } else {
            callback2(null, documents[0]);
          }
        }
      });
    });
    var Result = mongoose2.model("Result", resultSchema);
    module2.exports = Result;
  },
});

// models/index.js
var require_models = __commonJS({
  "models/index.js"(exports, module2) {
    var invoiceModel2 = require_invoiceModel();
    var notificationModel = require_notification();
    var announcementModel = require_announcement();
    var studentModel = require_studentModel();
    var administratorModel = require_adminModel();
    var resultModel2 = require_resultModel();
    module2.exports = {
      invoiceModel: invoiceModel2,
      notificationModel,
      announcementModel,
      studentModel,
      administratorModel,
      resultModel: resultModel2,
    };
  },
});

// models/classModel.js
var require_classModel = __commonJS({
  "models/classModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var { Schema, model } = mongoose2;
    var classSchema = new Schema({
      name: {
        type: String,
        required: true,
        unique: true,
      },
      teachers: [
        {
          type: mongoose2.Schema.Types.ObjectId,
          ref: "Teacher",
        },
      ],
      subjects: [
        {
          type: String,
        },
      ],
      students: [
        {
          type: String,
          ref: "Student",
        },
      ],
    });
    classSchema.static("findAll", function (callback2) {
      return this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    var Class = model("Class", classSchema);
    module2.exports = Class;
  },
});

// models/teacherModel.js
var require_teacherModel = __commonJS({
  "models/teacherModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var teacherSchema = new mongoose2.Schema({
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        lowercase: true,
        enum: ["male", "female"],
        required: true,
      },
      maritalStatus: {
        type: String,
        lowercase: true,
        enum: ["single", "married"],
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        lowercase: true,
        default: "teacher",
      },
      address: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: "active",
      },
      createdAt: {
        type: Date,
        default: () => /* @__PURE__ */ new Date().getTime(),
      },
      lastSeen: {
        type: Date,
        default: () => /* @__PURE__ */ new Date().getTime(),
      },
    });
    teacherSchema.static("findAll", function (callback2) {
      return this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    teacherSchema.static("findByID", function (ID2, callback2) {
      return this.find({ _id: ID2 }, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          if (documents.length === 0) {
            callback2(null, null);
          } else {
            callback2(null, documents[0]);
          }
        }
      });
    });
    teacherSchema.static("findByName", function (name, callback2) {
      return this.find(
        {
          $or: [{ firstName: name }, { lastName: name }],
        },
        (error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents[0]);
          }
        }
      );
    });
    teacherSchema.static("findByEmailAddress", function (email, callback2) {
      return this.find({ email }, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents[0]);
        }
      });
    });
    var Teacher = mongoose2.model("Teacher", teacherSchema);
    module2.exports = Teacher;
  },
});

// controllers/class.js
var require_class = __commonJS({
  "controllers/class.js"(exports) {
    var mongoose2 = require("mongoose");
    var Class = require_classModel();
    var Student = require_studentModel();
    var Teacher = require_teacherModel();
    exports.getAllClasses = async function (req, res2) {
      try {
        const classes = await Class.find({})
          .populate([
            { path: "students", select: "-image -password" },
            { path: "teachers", select: "-image -password" },
          ])
          .exec();
        res2.status(200).json(classes);
      } catch (err) {
        res2.status(404).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.getClass = async function (req, res2) {
      try {
        const _class = await Class.findOne({ _id: req.params.classID })
          .populate([
            { path: "students", select: "-image -password" },
            { path: "teachers", select: "-image -password" },
          ])
          .exec();
        if (_class) {
          res2.status(200).json(_class);
        } else {
          throw "Class does not exist";
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.addClass = async (req, res2) => {
      const newClass = await new Class({
        ...req.body,
      }).save();
      res2.json(newClass);
    };
    exports.assignStudent = async function (req, res2) {
      const studentID2 = req.body.studentID;
      const classID = req.body.classID;
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          const _class = await Class.findById(classID);
          if (_class.students.indexOf(studentID2) < 0) {
            await Class.updateOne(
              { _id: classID },
              { $push: { students: studentID2 } }
            );
          } else {
            throw `${student.firstName} ${student.lastName} has already been added to ${_class.name}`;
          }
        } else {
          throw "Student does not exist!, Please check the ID";
        }
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.removeStudent = async function (req, res2) {
      const studentID2 = req.body.studentID;
      const classID = req.params.classID;
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          const _class = await Class.findById(classID);
          if (_class.students.indexOf(studentID2) >= 0) {
            await Class.updateOne(
              { _id: classID },
              { $pull: { students: studentID2 } }
            );
          } else {
            throw `${student.firstName} ${student.lastName} does not exist in ${_class.name}`;
          }
        } else {
          throw "Student does not exist!, Please check the ID";
        }
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.assignTeacher = async function (req, res2) {
      const teacherID = req.body.teacherID;
      const classID = req.body.classID;
      try {
        const teacher = await Teacher.findById(teacherID);
        if (teacher) {
          await Class.updateOne(
            { _id: classID },
            { $push: { teachers: teacherID } }
          );
        } else {
          throw "Teacher does not exist!";
        }
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.removeTeacher = async function (req, res2) {
      const teacherID = req.body.teacherID;
      const classID = req.params.classID;
      try {
        const teacher = await Teacher.findById(teacherID);
        if (teacher) {
          const _class = await Class.findById(classID);
          if (_class.teachers.indexOf(teacherID) >= 0) {
            await Class.updateOne(
              { _id: classID },
              { $pull: { teachers: teacherID } }
            );
          } else {
            throw `${teacher.firstName} ${teacher.lastName} does not exist in ${_class.name}`;
          }
        } else {
          throw "Teacher does not exist!, Please check the ID";
        }
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.getAllSubjects = async function (req, res2) {};
    exports.addSubject = async function (req, res2) {
      const subject = req.body.subject;
      console.log(subject);
      const classID = req.params.classID;
      try {
        const _class = await Class.findById(classID);
        if (_class) {
          console.log(_class.subjects.indexOf(subject));
          if (_class.subjects.indexOf(subject) < 0) {
            await Class.updateOne(
              { _id: classID },
              { $push: { subjects: subject } }
            );
          } else {
            throw "subject already exists";
          }
        } else {
          throw "class does not exist!";
        }
        res2.status(200).json({});
      } catch (error) {
        console.log(error);
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.deleteSubject = async function (req, res2) {
      const subject = req.body.subject;
      const classID = req.params.classID;
      try {
        const _class = await Class.findById(classID);
        if (_class) {
          console.log(_class.subjects.indexOf(subject));
          const updatedClass = await Class.findOneAndUpdate(
            { _id: classID },
            { $pull: { subjects: subject } },
            { useFindAndModify: false }
          );
          res2.status(200).json(updatedClass);
          console.log(updatedClass.subjects);
        } else {
          throw "class does not exist!";
        }
      } catch (error) {
        console.log(error);
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.countAllClasses = async function (callback2) {
      Class.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllClasses = async function (options, callback2) {
      if (options.paginate) {
        Class.find()
          .limit(options.count)
          .skip(options.count * (options.page - 1))
          .exec((error, classes) => {
            if (error) {
              callback2(error, null);
            } else {
              callback2(null, classes);
            }
          });
      }
      Class.findAll((error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findClassByID = async function (ID2, callback2) {
      Class.find({ _id: ID2 })
        .populate(["students", "teachers"])
        .exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents[0]);
          }
        });
    };
    exports.findClassByName = async function (name, callback2) {
      Class.find({ name })
        .populate(["students", "teachers"])
        .exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents[0]);
          }
        });
    };
    exports.createClass = async function (data2, callback2) {
      Class.create({ ...data2 })
        .then((document2) => {
          callback2(null, document2);
        })
        .catch((error) => {
          callback2(error, null);
        });
    };
    exports.students = {
      assign(classID, studentID2, callback2) {
        Student.findById(studentID2, (error, student) => {
          if (error) {
            callback2(error);
          } else {
            if (student) {
              Class.findById(classID, (error2, _class) => {
                if (_class) {
                  if (_class.students.indexOf(studentID2) < 0) {
                    Class.updateOne(
                      { _id: classID },
                      { $push: { students: studentID2 } },
                      (error3) => {
                        if (error3) {
                          callback2(error3);
                        } else {
                          callback2(null);
                        }
                      }
                    );
                  } else {
                    callback2(`Cannot assign a student twice!`);
                  }
                } else {
                  callback2("Class does not exist!");
                }
              });
            } else {
              callback2("Student does not exist!");
            }
          }
        });
      },
      deassign(classID, studentID2, callback2) {
        Student.findById(studentID2, (error, student) => {
          if (error) {
            callback2(error);
          } else {
            if (student) {
              Class.findById(classID, (error2, _class) => {
                if (_class) {
                  if (_class.students.indexOf(studentID2) >= 0) {
                    Class.updateOne(
                      { _id: classID },
                      { $pull: { students: studentID2 } },
                      (error3) => {
                        if (error3) {
                          callback2(error3);
                        } else {
                          callback2(null);
                        }
                      }
                    );
                  } else {
                    callback2(`Student does not exist in this class`);
                  }
                } else {
                  callback2("Class does not exist!");
                }
              });
            } else {
              callback2("Student does not exist!");
            }
          }
        });
      },
    };
    exports.teachers = {
      assign(classID, emailAddress, callback2) {
        console.log(emailAddress);
        Teacher.findOne({ email: emailAddress }, (error, teacher) => {
          if (error) {
            callback2(error);
          } else {
            if (teacher) {
              Class.findById(classID, (error2, _class) => {
                if (_class) {
                  if (_class.teachers.indexOf(teacher._id) < 0) {
                    Class.updateOne(
                      { _id: classID },
                      { $push: { teachers: teacher._id } },
                      (error3) => {
                        if (error3) {
                          callback2(error3);
                        } else {
                          callback2(null);
                        }
                      }
                    );
                  } else {
                    callback2(`Cannot assign a teacher twice!`);
                  }
                } else {
                  callback2("Class does not exist!");
                }
              });
            } else {
              callback2("teacher does not exist!");
            }
          }
        });
      },
      deassign(classID, teacherID, callback2) {
        Teacher.findById(teacherID, (error, teacher) => {
          if (error) {
            callback2(error);
          } else {
            if (teacher) {
              Class.findById(classID, (error2, _class) => {
                if (_class) {
                  if (_class.teachers.indexOf(teacherID) >= 0) {
                    Class.updateOne(
                      { _id: classID },
                      { $pull: { teachers: teacherID } },
                      (error3) => {
                        if (error3) {
                          callback2(error3);
                        } else {
                          callback2(null);
                        }
                      }
                    );
                  } else {
                    callback2(`Teacher does not exist in this class`);
                  }
                } else {
                  callback2("Class does not exist!");
                }
              });
            } else {
              callback2("Teacher does not exist!");
            }
          }
        });
      },
    };
    exports.subjects = {
      add(classID, subject, callback2) {
        Class.findById(classID, (error, _class) => {
          if (_class) {
            if (_class.subjects.indexOf(subject) < 0) {
              Class.updateOne(
                { _id: classID },
                { $push: { subjects: subject } },
                (error2) => {
                  if (error2) {
                    callback2(error2);
                  } else {
                    callback2(null);
                  }
                }
              );
            } else {
              callback2(`Cannot add a subject twice!`);
            }
          } else {
            callback2("Class does not exist!");
          }
        });
      },
      remove(classID, subject, callback2) {
        Class.findById(classID, (error, _class) => {
          if (_class) {
            if (_class.subjects.indexOf(subject) >= 0) {
              Class.updateOne(
                { _id: classID },
                { $pull: { subjects: subject } },
                (error2) => {
                  if (error2) {
                    callback2(error2);
                  } else {
                    callback2(null);
                  }
                }
              );
            } else {
              callback2(`Subject does not exist in this class`);
            }
          } else {
            callback2("Class does not exist!");
          }
        });
      },
    };
  },
});

// controllers/student.js
var require_student = __commonJS({
  "controllers/student.js"(exports) {
    var mongoose2 = require("mongoose");
    var models2 = require_models();
    var bcrypt = require("bcrypt");
    var fs = require("fs");
    var path = require("path");
    var jsonwebtoken2 = require("jsonwebtoken");
    var classController = require_class();
    var Student = require_studentModel();
    var Class = require_classModel();
    var Result = require_resultModel();
    var { notificationModel, invoiceModel: invoiceModel2 } = models2;
    exports.findAllStudents = async function (req, res2) {
      const student = await Student.find({}).populate("class");
      res2.json(student);
    };
    exports.getStudent = async function (req, res2) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      const student = await Student.findById(studentID2).populate([
        "class",
        "results",
      ]);
      res2.status(200).json(student);
    };
    exports.addStudent = async function (req, res2) {
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
          const isValid = mongoose2.Types.ObjectId.isValid(req.body.class);
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
        res2.status(200).json(newStudent);
      } catch (err) {
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.activate = async function (req, res2) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          if (student.status === "inactive") {
            await Student.updateOne({ _id: studentID2 }, { status: "active" });
            res2.status(200).json({});
          } else {
            throw "Account already activated";
          }
        } else {
          throw "This account doesn't exist, please try again";
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.deactivate = async function (req, res2) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          if (student.status === "active") {
            await Student.updateOne(
              { _id: studentID2 },
              { status: "inactive" }
            );
            res2.status(200).json({});
          } else {
            throw "Account already deactivated";
          }
        } else {
          throw "This account doesn't exist, please try again";
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports._delete = async function (req, res2) {
      try {
        const studentID2 = req.params.studentID.replace(/-/g, "/");
        const student = await Student.findByIdAndDelete(studentID2);
        await Class.updateOne(
          { _id: student.class },
          { $pull: { students: student._id } }
        );
        await student.results.forEach(async (result) => {
          await Result.deleteOne({ _id: result });
        });
        res2.status(200).json({});
      } catch (err) {
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.editProfile = async (req, res2) => {
      try {
        const studentID2 = req.params.studentID.replace(/-/g, "/");
        await Student.updateOne({ _id: studentID2 }, { ...req.body });
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.getAllNotifications = async function (request, response) {
      const studentID2 = request.params.studentID.replace(/-/g, "/");
      notificationModel().find(
        { recipient: studentID2 },
        (error, documents) => {
          response.status(200).json(documents);
        }
      );
    };
    exports.deleteNotificationByID = async function (request, response) {};
    exports.countAllStudents = async function (callback2) {
      Student.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllStudents = async function (options, callback2) {
      if (options.paginate) {
        Student.find()
          .sort({
            firstName: "asc",
          })
          .limit(options.count)
          .skip(options.count * (options.page - 1))
          .exec(function (error, students) {
            callback2(null, students);
          });
      } else {
        Student.findAll((error, document2) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, document2);
          }
        });
      }
    };
    exports.search = async function (search, callback2) {
      Student.findBySearch(search, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    };
    exports.findStudentByID = async function (studentID2, callback2) {
      Student.findByID(studentID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findStudentByName = async function (name, callback2) {
      Student.findByName(name, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.createStudent = async function (data2, callback2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(data2.password, salt);
      Student.create({ ...data2, password: hashedPassword })
        .then((document2) => {
          if (data2.class) {
            Class.updateOne(
              { _id: data2.class },
              { $push: { students: document2._id } },
              (error, documents) => {
                console.log(error);
              }
            );
          }
          if (data2.image) {
            fs.writeFile(
              `${__dirname}/../uploads/images/profile/${document2._id
                .toString()
                .replace(/\//g, "-")}.jpg`,
              data2.image,
              "base64",
              (error) => {
                if (error) {
                  console.log(error);
                }
              }
            );
          }
          callback2(null, document2);
        })
        .catch((error) => {
          callback2(error.message, null);
        });
    };
    exports.updateStudentByID = async function (studentID2, data2, callback2) {
      Student.updateOne(
        { _id: studentID2 },
        { $set: { ...data2 } },
        (error, data3) => {
          if (error) {
            callback2(error.message);
          } else {
            callback2(null);
          }
        }
      );
    };
    exports.deleteStudentByID = async function (studentID2, callback2) {
      Student.deleteOne({ _id: studentID2 }, (error) => {
        if (error) {
          callback2(error);
        } else {
          Result.find()
            .where("student")
            .equals(studentID2)
            .exec((error2, results) => {
              if (error2) {
                callback2(error2);
              } else {
                results.forEach((result, index) => {
                  Result.deleteOne({ _id: result._id }, (error3) => {
                    if (error3) {
                      console.log(error3);
                    }
                  });
                });
              }
            });
          Class.find()
            .where("students")
            .in(studentID2)
            .exec((error2, classes) => {
              if (error2) {
                console.log(error2);
              } else {
                classes.forEach((_class, index) => {
                  Class.updateOne(
                    { _id: _class._id },
                    { $pull: { students: studentID2 } }
                  );
                });
              }
            });
        }
      });
    };
    exports.results = {
      findAll(studentID2, callback2) {
        Student.findByID(studentID2, (error, document2) => {
          if (error) {
            callback2(error, null);
          } else {
            if (document2) {
              console.log(document2);
              callback2(null, document2.results ? document2.results : []);
              return false;
            } else {
              callback2("Student not found!", null);
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
  },
});

// controllers/invoice.js
var require_invoice = __commonJS({
  "controllers/invoice.js"(exports) {
    var models2 = require_models();
    var studentController = require_student();
    var {
      invoiceModel: invoiceModel2,
      notificationModel,
      studentModel,
    } = models2;
    exports.findAllInvoices = async function (options, callback2) {
      invoiceModel2.default
        .find({ type: "DEFAULT" })
        .exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
    };
    exports.countAllInvoices = async function (callback2) {
      invoiceModel2.default
        .countDocuments({ type: "DEFAULT" })
        .exec((error, count) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, count);
          }
        });
    };
    exports.findInvoiceByID = async function (invoiceID, callback2) {
      invoiceModel2.default.findOne(
        { _id: invoiceID, type: "DEFAULT" },
        (error, document2) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, document2);
          }
        }
      );
    };
    exports.createInvoice = async function (data2, callback2) {
      invoiceModel2.default
        .create({ ...data2 })
        .then((document2) => {
          studentModel.findOne({ _id: data2.issuedTo }, (error, student) => {
            if (error) {
              invoiceModel2.default.deleteOne({ _id: document2._id }).exec();
              callback2(error.message);
            } else {
              if (student) {
                studentModel.updateOne(
                  { _id: student._id },
                  { $push: { invoices: document2._id } },
                  (error2) => {
                    if (error2) {
                      invoiceModel2.default
                        .deleteOne({ _id: document2._id })
                        .exec();
                      callback2(error2.message);
                    }
                  }
                );
              } else {
                invoiceModel2.default.deleteOne({ _id: document2._id }).exec();
                callback2("Student does not exist!");
              }
            }
          });
        })
        .catch((error) => {
          console.log("ERROR: " + error);
          callback2(error);
        });
    };
    exports.updateInvoiceByID = async function (request, response) {
      let invoice = request.payload.invoice;
      invoiceModel2(request.body.invoice.type)
        .findByIdAndUpdate(
          invoice._id,
          { $set: { ...request.body } },
          { new: true },
          (error, document2) => {
            if (error) {
              response.status(400).send(error.message);
            }
            response.status(200).json(document2);
          }
        )
        .populate("issuedTo");
    };
    exports.deleteInvoiceByID = async function (invoiceID, callback2) {
      invoiceModel2.default.deleteOne(
        { type: "DEFAULT", _id: invoiceID },
        (error) => {
          if (error) {
            callback2(error);
          } else {
            callback2(null);
          }
        }
      );
    };
    exports.templates = {
      findAllInvoices: async function (options, callback2) {
        invoiceModel2.template
          .find({ type: "TEMPLATE" })
          .exec((error, documents) => {
            if (error) {
              callback2(error, null);
            } else {
              callback2(null, documents);
            }
          });
      },
      countAllInvoices: async function (callback2) {
        invoiceModel2.template
          .countDocuments({ type: "TEMPLATE" })
          .exec((error, count) => {
            if (error) {
              callback2(error, null);
            } else {
              callback2(null, count);
            }
          });
      },
      findInvoiceByID: async function (invoiceID, callback2) {
        invoiceModel2.template.findOne(
          { _id: invoiceID, type: "TEMPLATE" },
          (error, document2) => {
            if (error) {
              callback2(error, null);
            } else {
              callback2(null, document2);
            }
          }
        );
      },
      createInvoice: async function (data2, callback2) {
        invoiceModel2.template
          .create({ ...data2 })
          .then((document2) => {
            console.log(document2);
            callback2(null);
          })
          .catch((error) => {
            console.log("ERROR: " + error);
            callback2(error);
          });
      },
      updateInvoiceByID: async function (request, response) {
        let invoice = request.payload.invoice;
        invoiceModel2(request.body.invoice.type)
          .findByIdAndUpdate(
            invoice._id,
            { $set: { ...request.body } },
            { new: true },
            (error, document2) => {
              if (error) {
                response.status(400).send(error.message);
              }
              response.status(200).json(document2);
            }
          )
          .populate("issuedTo");
      },
      deleteInvoiceByID: async function (invoiceID, callback2) {
        invoiceModel2.template.deleteOne(
          { type: "TEMPLATE", _id: invoiceID },
          (error) => {
            if (error) {
              callback2(error);
            } else {
              callback2(null);
            }
          }
        );
      },
    };
  },
});

// controllers/notification.js
var require_notification2 = __commonJS({
  "controllers/notification.js"(exports, module2) {
    var models2 = require_models();
    var { notificationModel } = models2;
    async function getAll(request, response) {
      notificationModel().find({}, (error, document2) => {
        response.status(200).json(document2);
      });
    }
    async function create(request, response) {
      notificationModel("NEW_INVOICE").create(
        { recipient: "tttttt" },
        (error, document2) => {
          response.status(200).json(document2);
        }
      );
    }
    async function getByID(request, response) {}
    async function deleteByID(request, response) {
      let notificationID = request.params.notificationID;
      console.log(request.query.type);
      notificationModel().findByIdAndDelete(
        notificationID,
        (error, document2) => {
          response.status(200).json(document2);
        }
      );
    }
    async function updateByID(request, response) {
      let notificationID = request.params.notificationID;
      notificationModel(request.body.type).findByIdAndUpdate(
        notificationID,
        { $set: { ...request.body } },
        { new: true },
        (error, document2) => {
          response.status(200).json(document2);
        }
      );
    }
    async function deleteManyByID(request, response) {}
    module2.exports = {
      getAll,
      create,
      getByID,
      deleteByID,
      updateByID,
      deleteManyByID,
    };
  },
});

// controllers/admin.js
var require_admin = __commonJS({
  "controllers/admin.js"(exports) {
    var bcrypt = require("bcrypt");
    var mongoose2 = require("mongoose");
    var jsonwebtoken2 = require("jsonwebtoken");
    var Admin = require_adminModel();
    exports.getAdmin = async function (req, res2) {
      const admin = await Admin.findOne({ _id: req.params.id });
      res2.status(200).json(admin);
    };
    exports.createAdmin = async function (data2, callback2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(data2.password, salt);
      Admin.create({ ...data2, password: hashedPassword })
        .then((document2) => {
          callback2(null, document2);
        })
        .catch((error) => {
          callback2(error, null);
        });
    };
    exports.findAllAdmins = async function (options, callback2) {
      if (options.paginate) {
        Admin.find()
          .sort({
            firstName: "asc",
          })
          .limit(options.count)
          .skip(options.count * (options.page - 1))
          .exec(function (error, admins) {
            if (error) {
              callback2(error, null);
            } else {
              callback2(null, admins);
            }
          });
      } else {
        Admin.findAll((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
      }
    };
    exports.findAdminByEmailAddress = async function (emailAddress, callback2) {
      Admin.findByEmailAddress(emailAddress, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
  },
});

// controllers/result.js
var require_result = __commonJS({
  "controllers/result.js"(exports) {
    var Result = require_resultModel();
    var Student = require_studentModel();
    exports.getAllResults = async function (req, res2) {
      const results = await Result.find({})
        .populate([
          { path: "class", select: "-image -password" },
          { path: "student", select: "-image -password" },
          { path: "uploadedBy", select: "-image -password" },
        ])
        .exec();
      res2.status(200).json(results);
    };
    exports.getResultsByClass = async function (req, res2) {
      const classID = req.params.classID;
      const results = await Result.find({})
        .where("class")
        .equals(classID)
        .populate([
          { path: "class", select: "-password" },
          { path: "student", select: "-password" },
          { path: "uploadedBy", select: "-password" },
        ])
        .exec();
      res2.status(200).json(results);
    };
    exports.getResult = async function (req, res2) {
      const result = await Result.findById(req.params.id).populate([
        "class",
        "student",
        "uploadedBy",
      ]);
      res2.status(200).json(result);
    };
    exports.addResult = async function (req, res2) {
      const studentID2 = req.body.student;
      try {
        const student = Student.findById(studentID2);
        if (student) {
          const newResult = await new Result({
            ...req.body,
          }).save();
          await Student.updateOne(
            { _id: req.body.student },
            { $push: { results: newResult._id } }
          );
        } else {
          throw "This student does not exist!, Please check the ID and try again";
        }
        res2.status(200).json({});
      } catch (err) {
        console.log(err);
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.editResult = async function (req, res2) {
      try {
        const resultID = req.params.resultID;
        await Result.updateOne(
          { _id: resultID },
          { ...req.body, isApproved: false }
        );
        res2.status(200).json({});
      } catch (err) {
        console.log(err);
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.downloadResult = async function (req, res2, next) {
      try {
        const resultID = req.params.resultID;
        const result = await Result.findById(resultID).populate([
          "class",
          "student",
          "uploadedBy",
        ]);
        if (!result) {
          throw "Result not found";
        } else {
          req.body.result = result;
          next();
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.countAllResults = function (callback2) {
      Result.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllResults = async function (options, callback2) {
      if (options.paginate) {
        Result.find({})
          .populate([
            { path: "class", select: "-image -password" },
            { path: "student", select: "-image -password" },
            { path: "uploadedBy", select: "-image -password" },
          ])
          .limit(options.count)
          .skip(options.count * (options.page - 1))
          .exec(function (error, results) {
            callback2(null, results);
          });
      } else {
        Result.findAll((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
      }
    };
    exports.findResultbyID = async function (ID2, callback2) {
      Result.findByID(ID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findResultsByStudentID = async function (studentID2, callback2) {
      Result.findResultByStudentID(studentID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.uploadResult = async function (data2, callback2) {
      Student.findById(data2.student, (error, student) => {
        if (student) {
          Result.create({ ...data2 })
            .then((result) => {
              Student.updateOne(
                { _id: data2.student },
                { $push: { results: result._id } },
                (error2) => {
                  if (error2) {
                    callback2(error2);
                  } else {
                    callback2(null);
                  }
                }
              );
            })
            .catch((error2) => {
              callback2(error2);
            });
        } else {
          callback2(
            "This student does not exist!, Please check the ID and try again"
          );
        }
      });
    };
    exports.approveResult = async function (resultID, callback2) {
      Result.updateOne(
        { _id: resultID },
        { $set: { isApproved: true } },
        (error) => {
          if (error) {
            callback2(error);
          } else {
            callback2(null);
          }
        }
      );
    };
    exports.deleteResult = async function (resultID, callback2) {
      Result.deleteOne({ _id: resultID }, (error) => {
        if (error) {
          callback2(error);
        } else {
          Student.find()
            .where("results")
            .in(resultID)
            .exec((error2, students) => {
              console.log(students);
              if (error2) {
                console.log(error2);
              } else {
                students.forEach((student, index) => {
                  Student.updateOne(
                    { _id: student._id },
                    { $pull: { results: resultID } },
                    (error3) => {
                      if (error3) {
                        console.log(error3);
                      }
                    }
                  );
                });
                callback2(null);
              }
            });
        }
      });
    };
  },
});

// models/feeModel.js
var require_feeModel = __commonJS({
  "models/feeModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var { Schema, model } = mongoose2;
    var feeSchema = new Schema({});
    var feeSchema__withPriceVariations = new Schema({
      title: { type: String },
      hasPriceVariety: { type: Boolean, default: true },
      prices: [
        {
          variant: { type: String, default: "N/A" },
          price: { type: Number, default: 0 },
        },
      ],
      isGrouped: { type: Boolean, default: false },
      groupName: { type: String, default: "" },
    });
    var feeSchema__withoutPriceVariations = new Schema({
      title: { type: String },
      hasPriceVariety: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
      isGrouped: { type: Boolean, default: false },
      groupName: { type: String, default: "" },
    });
    var FeeModel = model("Fee", feeSchema, "fees");
    var feeModel__withPriceVariations = model(
      "Fee__withPriceVariations",
      feeSchema__withPriceVariations,
      "fees"
    );
    var feeModel__withoutPriceVariations = model(
      "Fee__withoutPriceVariations",
      feeSchema__withoutPriceVariations,
      "fees"
    );
    module2.exports = {
      feeModel__withoutPriceVariations,
      feeModel__withPriceVariations,
      FeeModel,
    };
  },
});

// controllers/fee.js
var require_fee = __commonJS({
  "controllers/fee.js"(exports) {
    var feeModel = require_feeModel();
    var {
      feeModel__withPriceVariations,
      feeModel__withoutPriceVariations,
      FeeModel,
    } = feeModel;
    exports.getAllFees = async function (req, res2) {
      const fees = await FeeModel.find({});
      res2.status(200).json(fees);
    };
    exports.createFee = async function (req, res2) {
      const fee = req.body;
      try {
        if (fee.hasPriceVariety === true) {
          const newFee = await new feeModel__withPriceVariations({
            ...fee,
          }).save();
          res2.status(200).json(newFee);
        }
        if (fee.hasPriceVariety === false) {
          const newFee = await new feeModel__withoutPriceVariations({
            ...fee,
          }).save();
          res2.status(200).json(newFee);
        }
      } catch (error) {}
    };
    exports.deleteFee = async function (req, res2) {
      const feeID = req.params.feeID;
      await FeeModel.deleteOne({ _id: feeID });
      res2.status(200).json({});
    };
  },
});

// models/termModel.js
var require_termModel = __commonJS({
  "models/termModel.js"(exports, module2) {
    var { Schema, model } = require("mongoose");
    var termSchema = new Schema(
      {
        name: {
          type: String,
          required: true,
        },
      },
      { collection: "term" }
    );
    var Term = model("Term", termSchema);
    module2.exports = Term;
  },
});

// controllers/term.js
var require_term = __commonJS({
  "controllers/term.js"(exports) {
    var Term = require_termModel();
    exports.getTerm = async function (req, res2) {
      const data2 = await Term.findOne({});
      if (!data2) {
        await new Term({ name: "Not Set" }).save();
        res2.status(200).json({ term: "Not Set" });
      } else {
        res2.status(200).json({ term: data2.name });
      }
    };
    exports.setTerm = async function (req, res2) {
      await Term.updateOne({}, { name: req.body.term });
      res2.status(200).send({});
    };
  },
});

// models/sessionModel.js
var require_sessionModel = __commonJS({
  "models/sessionModel.js"(exports, module2) {
    var { Schema, model } = require("mongoose");
    var sessionSchema = new Schema(
      {
        name: {
          type: String,
          required: true,
        },
      },
      { collection: "session" }
    );
    var Session = model("Sesssion", sessionSchema);
    module2.exports = Session;
  },
});

// controllers/session.js
var require_session = __commonJS({
  "controllers/session.js"(exports) {
    var Class = require_classModel();
    var Session = require_sessionModel();
    exports.getSession = async function (req, res2) {
      const data2 = await Session.findOne({});
      if (!data2) {
        await new Session({ name: "Not Set" }).save();
        res2.status(200).send({ session: "Not Set" });
      } else {
        res2.status(200).send({ session: data2.name });
      }
    };
    exports.setSession = async function (req, res2) {
      await Session.updateOne({}, { name: req.body.session });
      res2.status(200).send({});
    };
  },
});

// controllers/teacher.js
var require_teacher = __commonJS({
  "controllers/teacher.js"(exports) {
    var bcrypt = require("bcrypt");
    var mongoose2 = require("mongoose");
    var jsonwebtoken2 = require("jsonwebtoken");
    var Teacher = require_teacherModel();
    var Class = require_classModel();
    var fs = require("fs");
    exports.getAllTeachers = async function (req, res2) {
      const teachers = await Teacher.find({}, "-image");
      res2.status(200).json(teachers);
    };
    exports.getTeacher = async function (req, res2) {
      const teacher = await Teacher.findOne({ _id: req.params.id });
      res2.status(200).json(teacher);
    };
    exports.addTeacher = async function (req, res2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newTeacher = await new Teacher({
        ...req.body,
        password: hashedPassword,
      }).save();
      if (req.body.class) {
        const isValidClass = mongoose2.Types.ObjectId.isValid(req.body.class);
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
      res2.status(200).json(newTeacher);
    };
    exports.login = async function (req, res2) {
      try {
        const teacher = await Teacher.findOne({
          email: req.body.email,
        }).populate("class");
        if (teacher) {
          const isPasswordMatched = await bcrypt.compare(
            req.body.password,
            teacher.password
          );
          if (isPasswordMatched) {
            const token = jsonwebtoken2.sign(
              { _id: teacher._id, role: "teacher" },
              process.env.TOKEN_SECRET
            );
            const isActive = teacher.status === "active";
            if (isActive) {
              res2.status(200).json({ authToken: token, ...teacher._doc });
            } else {
              throw "This account has been deactivated, Please contact an administrator";
            }
          } else {
            throw "Invalid Email or Password";
          }
        } else {
          throw "Invalid Email or Password";
        }
      } catch (err) {
        console.log(err);
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.activate = async function (req, res2) {
      const teacherID = req.params.teacherID.replace(/-/g, "/");
      try {
        const teacher = await Teacher.findById(teacherID);
        if (teacher) {
          if (teacher.status === "inactive") {
            await Teacher.updateOne({ _id: teacherID }, { status: "active" });
            res2.status(200).json({});
          } else {
            throw "Account already activated";
          }
        } else {
          throw "This account doesn't exist, please try again";
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.deactivate = async function (req, res2) {
      const teacherID = req.params.teacherID.replace(/-/g, "/");
      try {
        const teacher = await Teacher.findById(teacherID);
        if (teacher) {
          if (teacher.status === "active") {
            await Teacher.updateOne({ _id: teacherID }, { status: "inactive" });
            res2.status(200).json({});
          } else {
            throw "Account already deactivated";
          }
        } else {
          throw "This account doesn't exist, please try again";
        }
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports._delete = async function (req, res2) {
      try {
        const teacherID = req.params.teacherID.replace(/-/g, "/");
        await Teacher.findByIdAndDelete(teacherID);
        res2.status(200).json({});
      } catch (err) {
        res2.status(400).json({
          error: {
            message: err,
          },
        });
      }
    };
    exports.editProfile = async (req, res2) => {
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
        res2.status(200).json({});
      } catch (error) {
        res2.status(400).json({
          error: {
            message: error,
          },
        });
      }
    };
    exports.countAllTeachers = async function (callback2) {
      Teacher.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllTeachers = async function (options, callback2) {
      Teacher.findAll((error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByID = async function (ID2, callback2) {
      Teacher.findByID(ID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByName = async function (name, callback2) {
      Teacher.findByName(name, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByEmailAddress = async function (email, callback2) {
      Teacher.findByEmailAddress(email, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.createTeacher = async function (data2, callback2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(data2.password, salt);
      Teacher.create({ ...data2, password: hashedPassword })
        .then((document2) => {
          if (data2.class && data2.class.length > 0) {
            Class.updateOne(
              { _id: data2.class },
              { $push: { teachers: document2._id } },
              (error, documents) => {
                if (error) {
                  console.log(error);
                }
              }
            );
          }
          if (data2.image) {
            fs.writeFile(
              `${__dirname}/../uploads/images/profile/${document2._id
                .toString()
                .replace(/\//g, "-")}.jpg`,
              data2.image,
              "base64",
              (error) => {
                if (error) {
                  console.log(error);
                }
              }
            );
          }
          callback2(null, document2);
        })
        .catch((error) => {
          if (error) {
            callback2(error, null);
          }
        });
    };
    exports.updateTeacherByID = async function (ID2, update, callback2) {
      Teacher.updateOne({ _id: ID2 }, { ...update }, (error) => {
        if (error) {
          callback2(error);
        } else {
          callback2(null);
        }
      });
    };
    exports.deleteTeacherByID = async function (ID2, callback2) {
      Teacher.deleteOne({ _id: ID2 }, (error) => {
        if (error) {
          callback2(error);
        } else {
          Class.find()
            .where("teachers")
            .in(ID2)
            .exec((error2, classes) => {
              if (error2) {
                console.log(error2);
              } else {
                classes.forEach((_class, index) => {
                  Class.updateOne(
                    { _id: _class._id },
                    { $pull: { teachers: ID2 } },
                    (error3) => {
                      if (error3) {
                        console.log(error3);
                      }
                    }
                  );
                });
                callback2(null);
              }
            });
        }
      });
    };
  },
});

// controllers/auth.js
var require_auth = __commonJS({
  "controllers/auth.js"(exports) {
    var jsonwebtoken2 = require("jsonwebtoken");
    var bcrypt = require("bcrypt");
    var models2 = require_models();
    var studentController = require_student();
    var teacherController = require_teacher();
    var adminController = require_admin();
    var { administratorModel } = models2;
    exports.signin = {
      student: async function (studentID2, password, callback2) {
        studentController.findStudentByID(studentID2, (error, student) => {
          if (error) {
            callback2(error, null);
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
                      callback2(
                        "This account has been banned, Please contact the administrator.",
                        null
                      );
                    } else {
                      const accessToken2 = jsonwebtoken2.sign(
                        { id: student.id, role: "student" },
                        process.env.TOKEN_SECRET
                      );
                      callback2(null, {
                        accessToken: accessToken2,
                        ...student._doc,
                      });
                    }
                  } else {
                    callback2("Password and StudentID do not match", null);
                  }
                })
                .catch((error2) => {
                  callback2(error2, null);
                });
            } else {
              callback2("Invalid student ID", null);
            }
          }
        });
      },
      teacher: async function (email, password, callback2) {
        teacherController.findTeacherByEmailAddress(email, (error, teacher) => {
          if (error) {
            callback2(error, null);
          } else {
            bcrypt
              .compare(password, teacher.password)
              .then((match) => {
                if (match) {
                  if (
                    teacher.status === "banned" ||
                    teacher.status === "disabled"
                  ) {
                    callback2(
                      "This account has been banned, Please contact the administrator.",
                      null
                    );
                  } else {
                    const accessToken2 = jsonwebtoken2.sign(
                      {
                        id: teacher._id,
                        role: teacher.role,
                      },
                      process.env.TOKEN_SECRET
                    );
                    teacherController.updateTeacherByID(
                      teacher._id,
                      {
                        $set: {
                          lastSeen: /* @__PURE__ */ new Date().getTime(),
                        },
                      },
                      (error2) => {
                        if (error2) {
                          callback2(error2, null);
                        } else {
                          callback2(null, {
                            accessToken: accessToken2,
                            ...teacher._doc,
                          });
                        }
                      }
                    );
                  }
                } else {
                  callback2("Invalid email address or password", null);
                }
              })
              .catch((error2) => {
                callback2(error2, null);
              });
          }
        });
      },
      admin: async function (request, response) {
        let emailAddress = request.body.emailAddress;
        let password = request.body.password;
        let administrator;
        try {
          administrator = await administratorModel.findOne({
            email: emailAddress,
          });
          if (!administrator) {
            return response
              .status(400)
              .send("Invalid email address or password");
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
              $set: { lastSeen: /* @__PURE__ */ new Date().getTime() },
            }
          );
          const accessToken2 = jsonwebtoken2.sign(
            { id: administrator._id, role: administrator.role },
            process.env.TOKEN_SECRET
          );
          response.status(200).json({
            ...administrator.toJSON(),
            accessToken: accessToken2,
          });
        } catch (error) {
          console.log(error.message);
          response.status(400).send("unable to process this request");
        }
      },
    };
    exports.verifyAccessToken = async function (accessToken2, callback2) {
      jsonwebtoken2.verify(
        accessToken2,
        process.env.TOKEN_SECRET,
        (error, data2) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, data2);
          }
        }
      );
    };
  },
});

// controllers/announcement.js
var require_announcement2 = __commonJS({
  "controllers/announcement.js"(exports) {
    var models2 = require_models();
    var classController = require_class();
    var { announcementModel } = models2;
    exports.findAllAnnouncements = async function (callback2) {
      announcementModel().findAll({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    };
    exports.findAnnouncements = async function (options, callback2) {
      switch (options.by) {
        case "visibility":
          announcementModel().find(
            { visibility: options.visibility },
            (error, documents) => {
              if (error) {
                callback2(error, null);
              } else {
                callback2(null, documents);
              }
            }
          );
          break;
        default:
          callback2("invalid query", null);
          break;
      }
    };
    exports.createAnnouncement = async function (data2, options, callback2) {
      announcementModel({ ...options })
        .create({ ...data2 })
        .then((document2) => {
          callback2(null, document2);
        })
        .catch((error) => {
          callback2(error, null);
        });
    };
    exports.findAnnouncementByID = async function (announcementID, callback2) {
      announcementModel().findByID(announcementID, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.deleteAnnouncementByID = async function (
      announcementID,
      callback2
    ) {
      announcementModel().deleteOne({ _id: announcementID }, (error) => {
        if (error) {
          callback2(error.message);
        } else {
          callback2(null);
        }
      });
    };
    exports.updateAnnouncementByID = async function (
      announcementID,
      options,
      callback2
    ) {
      switch (options.action) {
        case "hide":
          announcementModel().updateOne(
            { _id: announcementID },
            { $set: { isHidden: true } },
            (error) => {
              if (error) {
                callback2(error);
              } else {
                callback2(null);
              }
            }
          );
          break;
        case "unhide":
          announcementModel().updateOne(
            { _id: announcementID },
            { $set: { isHidden: false } },
            (error) => {
              if (error) {
                callback2(error);
              } else {
                callback2(null);
              }
            }
          );
          break;
        default:
          callback2("Invalid action!");
      }
    };
  },
});

// controllers/index.js
var require_controllers = __commonJS({
  "controllers/index.js"(exports, module2) {
    var invoiceController = require_invoice();
    var notificationController = require_notification2();
    var adminController = require_admin();
    var studentController = require_student();
    var classController = require_class();
    var resultController = require_result();
    var feeController = require_fee();
    var termController = require_term();
    var sessionController = require_session();
    var teacherController = require_teacher();
    var authController = require_auth();
    var announcementController = require_announcement2();
    module2.exports = {
      invoiceController,
      notificationController,
      adminController,
      studentController,
      classController,
      resultController,
      feeController,
      termController,
      sessionController,
      teacherController,
      authController,
      announcementController,
    };
  },
});

// middlewares/verifyAccessToken.js
var require_verifyAccessToken = __commonJS({
  "middlewares/verifyAccessToken.js"(exports, module2) {
    var jwt = require("jsonwebtoken");
    var controllers = require_controllers();
    var { authController } = controllers;
    var verify = (request, response, next) => {
      const token = request.header("access-token");
      if (!token) return res.status(401).json({ msg: "Access Denied" });
      try {
        jsonwebtoken.verify(
          accessToken,
          process.env.TOKEN_SECRET,
          (error, data2) => {
            if (error) {
              response.status(400).send(error.message);
            } else {
              request.payload = {
                ...request.payload,
                role: data2.role,
                id: data2.id,
              };
              next();
            }
          }
        );
        next();
      } catch (error) {
        response.status(400).send(error.message);
      }
    };
    module2.exports = verify;
  },
});

// middlewares/generateStudentID.js
var require_generateStudentID = __commonJS({
  "middlewares/generateStudentID.js"(exports, module2) {
    var uuid = require("uuid");
    function generateStudentID(req, res2, next) {
      const studentID2 = `pbs/${/* @__PURE__ */ new Date().getFullYear()}/${
        uuid.v4().split("-")[0]
      }`;
      req.body._id = studentID2;
      next();
    }
    module2.exports = generateStudentID;
  },
});

// middlewares/aggregateScores.js
var require_aggregateScores = __commonJS({
  "middlewares/aggregateScores.js"(exports, module2) {
    function rangeCompare(minValue, maxValue, value) {
      if (value >= minValue && value <= maxValue) {
        return true;
      }
    }
    function getGrade(gradingScale, score) {
      console.log(score);
      let grade = "";
      switch (gradingScale) {
        case "foundation":
          grade =
            (rangeCompare(90, 100, score) && "A+") ||
            (rangeCompare(80, 89, score) && "A") ||
            (rangeCompare(75, 79, score) && "B+") ||
            (rangeCompare(65, 74, score) && "B") ||
            (rangeCompare(60, 64, score) && "C+") ||
            (rangeCompare(50, 59, score) && "C") ||
            (rangeCompare(40, 49, score) && "D") ||
            (rangeCompare(0, 39, score) && "F");
          break;
        case "pbs":
          grade =
            (rangeCompare(95, 100, score) && "A+") ||
            (rangeCompare(90, 94, score) && "A") ||
            (rangeCompare(85, 89, score) && "A-") ||
            (rangeCompare(80, 84, score) && "B+") ||
            (rangeCompare(75, 79, score) && "B") ||
            (rangeCompare(70, 74, score) && "B-") ||
            (rangeCompare(65, 69, score) && "C+") ||
            (rangeCompare(60, 64, score) && "C") ||
            (rangeCompare(56, 59, score) && "C-") ||
            (rangeCompare(50, 55, score) && "D") ||
            (rangeCompare(40, 49, score) && "E") ||
            (rangeCompare(30, 39, score) && "F") ||
            (rangeCompare(0, 29, score) && "U");
          break;
        case "prc":
          grade =
            (rangeCompare(95, 100, score) && "A+") ||
            (rangeCompare(90, 94, score) && "A") ||
            (rangeCompare(85, 89, score) && "A-") ||
            (rangeCompare(80, 84, score) && "B+") ||
            (rangeCompare(75, 79, score) && "B") ||
            (rangeCompare(70, 74, score) && "B-") ||
            (rangeCompare(65, 69, score) && "C+") ||
            (rangeCompare(60, 64, score) && "C") ||
            (rangeCompare(56, 59, score) && "C-") ||
            (rangeCompare(50, 55, score) && "D") ||
            (rangeCompare(40, 49, score) && "E") ||
            (rangeCompare(30, 39, score) && "F") ||
            (rangeCompare(0, 29, score) && "U");
          break;
        case "igcse":
          grade =
            (rangeCompare(90, 100, score) && "A*") ||
            (rangeCompare(80, 89, score) && "A") ||
            (rangeCompare(70, 79, score) && "B") ||
            (rangeCompare(60, 69, score) && "C") ||
            (rangeCompare(50, 59, score) && "D") ||
            (rangeCompare(40, 49, score) && "E") ||
            (rangeCompare(30, 39, score) && "F") ||
            (rangeCompare(20, 29, score) && "G") ||
            (rangeCompare(0, 19, score) && "U");
          break;
        case "waec":
          grade =
            (rangeCompare(80, 100, score) && "A1") ||
            (rangeCompare(75, 79, score) && "B2") ||
            (rangeCompare(70, 74, score) && "B3") ||
            (rangeCompare(60, 69, score) && "C4") ||
            (rangeCompare(56, 59, score) && "C5") ||
            (rangeCompare(50, 55, score) && "C6") ||
            (rangeCompare(45, 49, score) && "D7") ||
            (rangeCompare(40, 44, score) && "E8") ||
            (rangeCompare(0, 39, score) && "F9");
          break;
        case "aslevel":
          grade =
            (rangeCompare(80, 100, score) && "a") ||
            (rangeCompare(70, 79, score) && "b") ||
            (rangeCompare(60, 69, score) && "c") ||
            (rangeCompare(50, 59, score) && "d") ||
            (rangeCompare(40, 49, score) && "e") ||
            (rangeCompare(0, 39, score) && "u");
          break;
        default:
          break;
      }
      return grade;
    }
    var average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    function computeGrade(req, res2, next) {
      const scoreSheet = JSON.parse(req.body.scoreSheet);
      let scores = [];
      scoreSheet.forEach((item, index) => {
        if (index === 0) {
          if (req.body.type === "midTerm") {
            item.push("GRADE");
          }
          if (req.body.type === "endOfTerm") {
            item.push("AVERAGE PERCENTAGE");
            item.push("GRADE");
          }
        }
        if (index > 0) {
          if (req.body.type === "midTerm") {
            scores.push(parseInt(item[item.length - 1].value));
            item.push({
              value: getGrade(
                req.body.gradingScale,
                parseInt(item[item.length - 1].value)
              ),
            });
          }
          if (req.body.type === "endOfTerm") {
            console.log(req.body);
            item.push({
              value: average([
                parseInt(item[item.length - 1].value),
                parseInt(item[item.length - 2].value),
              ]),
            });
            scores.push(parseInt(item[item.length - 1].value));
            console.log(item[item.length - 1]);
            item.push({
              value: getGrade(
                req.body.gradingScale,
                parseInt(item[item.length - 1].value)
              ),
            });
          }
        }
      });
      const overallPercentage = average(scores).toFixed(1);
      const overallGrade = getGrade(
        req.body.gradingScale,
        Math.round(overallPercentage)
      );
      console.log(scoreSheet);
      req.body.scoreSheet = JSON.stringify(scoreSheet);
      req.body.overallGrade = overallGrade;
      req.body.overallPercentage = overallPercentage;
      next();
    }
    module2.exports = computeGrade;
  },
});

// middlewares/generateResultPDF.js
var require_generateResultPDF = __commonJS({
  "middlewares/generateResultPDF.js"(exports, module2) {
    var pdfKit = require("pdfkit");
    var fs = require("fs");
    function generateResultPDF(req, res2, next) {
      let result = req.body.result;
      const doc = new pdfKit({ size: "A4" });
      doc.roundedRect(30, 30, 535.28, 781.89, 50).stroke();
      doc.image("static/images/logos/logo.png", 50, 50, { width: 50 });
      doc.image("static/images/logos/logo.png", 495, 50, { width: 50 });
      doc
        .font("Times-Bold")
        .fontSize(25)
        .text(`${result.school.toUpperCase()}`, {
          bold: true,
          align: "center",
        })
        .moveDown(0.5);
      doc
        .fontSize(11)
        .text(`${result.title.toUpperCase()}`, {
          bold: true,
          align: "center",
        })
        .moveDown();
      doc
        .fontSize(13)
        .text(`${result.class.name.toUpperCase()}`, {
          bold: true,
        })
        .moveDown();
      doc
        .lineCap("round")
        .lineWidth(4)
        .moveTo(50, 165)
        .lineTo(545.28, 165)
        .stroke();
      doc
        .lineCap("round")
        .lineWidth(4)
        .moveTo(50, 210)
        .lineTo(545.28, 210)
        .stroke();
      doc
        .text("Candidate Name", 70, 175)
        .text("Session", 230, 175)
        .text("Overall Percentage", 320, 175)
        .text("Grade", 470, 175);
      doc
        .fontSize(9)
        .text(
          `${result.student.firstName.toUpperCase()} ${result.student.lastName.toUpperCase()}`,
          70,
          190
        )
        .text(result.session, 230, 190)
        .text(`${result.overallPercentage}%`, 320, 190)
        .text(result.overallGrade, 470, 190);
      const scoreSheet = JSON.parse(result.scoreSheet);
      let col = 70;
      let row = 250;
      scoreSheet.shift();
      if (result.type === "midTerm") {
        doc
          .text("SYLLABUS TITLE", 70, 230)
          .text("SCORE", 320, 230)
          .text("GRADE", 470, 230);
        scoreSheet.forEach((item, index, array) => {
          item.forEach((item2, index2) => {
            if (index2 === 0) {
              col = 70;
            }
            if (index2 === 1) {
              col = 320;
            }
            if (index2 === 2) {
              col = 470;
            }
            doc.text(item2.value.toString().toUpperCase(), col, row, {
              bold: true,
            });
            col += 100;
          });
          row += 20;
        });
      }
      if (result.type === "endOfTerm") {
        doc
          .fontSize(9)
          .text("SYLLABUS TITLE", 70, 230)
          .text("TEST", 300, 230)
          .text("EXAM", 340, 230)
          .text("AVG. PERCENTAGE", 390, 230)
          .text("GRADE", 490, 230);
        scoreSheet.forEach((item, index, array) => {
          item.forEach((item2, index2) => {
            if (index2 === 0) {
              col = 70;
            }
            if (index2 === 1) {
              col = 300;
            }
            if (index2 === 2) {
              col = 340;
            }
            if (index2 === 3) {
              col = 390;
            }
            if (index2 === 4) {
              col = 490;
            }
            doc.text(item2.value.toString().toUpperCase(), col, row, {
              bold: true,
            });
            col += 100;
          });
          row += 20;
        });
      }
      doc.lineWidth(1).fontSize(15).text("Electives", 50, row);
      row += 15;
      if (result.electives.length === 0) {
        doc.fontSize(11).text("No electives to show", 53, row);
        row += 15;
      } else {
        result.electives.forEach((elective, index) => {
          doc
            .lineWidth(0.5)
            .rect(50, row, 80, 20)
            .stroke()
            .fontSize(11)
            .text(elective.title, 53, row + 2);
          doc
            .lineWidth(0.5)
            .rect(130, row, 80, 20)
            .stroke()
            .fontSize(11)
            .text(elective.grade, 133, row + 2);
          row += 20;
        });
      }
      row += 10;
      doc
        .lineWidth(1)
        .rect(50, row, 150, 40)
        .stroke()
        .fontSize(11)
        .text("CLASS TEACHER'S REMARK", 53, row + 3, { width: 150 });
      doc
        .lineWidth(1)
        .rect(50 + 150, row, 350, 40)
        .stroke()
        .fontSize(11)
        .text(result.teachersRemark, 53 + 150, row + 3);
      doc
        .lineWidth(1)
        .rect(50, row + 40, 500, 90)
        .stroke()
        .fontSize(14)
        .text("Principal's Remark and Signature:", 54, row + 44, { bold: true })
        .fontSize(11)
        .text(result.principalsRemark, 54, row + 65);
      if (result.isApproved) {
        doc
          .font("Helvetica-BoldOblique")
          .fontSize(13)
          .text("AMA", 480, row + 115, { bold: true });
      }
      doc.end();
      res2.setHeader("Content-Disposition", "attachment; result.pdf");
      doc.pipe(res2);
    }
    module2.exports = generateResultPDF;
  },
});

// middlewares/index.js
var require_middlewares = __commonJS({
  "middlewares/index.js"(exports, module2) {
    var verifyAccessToken = require_verifyAccessToken();
    var generateStudentID = require_generateStudentID();
    var aggregateScores = require_aggregateScores();
    var generateResultPDF = require_generateResultPDF();
    module2.exports = {
      verifyAccessToken,
      generateStudentID,
      aggregateScores,
      generateResultPDF,
    };
  },
});

// routers/student.js
var require_student2 = __commonJS({
  "routers/student.js"(exports, module2) {
    var router = require("express").Router();
    var multer2 = require("multer");
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var { studentController } = controllers;
    var { generateStudentID } = middlewares;
    router.get("/count-all", (request, response) => {
      studentController.countAllStudents((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    router.get("/find-all", (request, response) => {
      studentController.findAllStudents(
        {
          paginate: request.query.paginate === "true" ? true : false,
          count: request.query.count ? parseInt(request.query.count) : 10,
          page: request.query.page ? parseInt(request.query.page) : 1,
        },
        (error, students) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(students);
          }
        }
      );
    });
    router.post("/search", (request, response) => {
      studentController.search(request.body.search, (error, students) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(students);
        }
      });
    });
    router.get("/find-one", (request, response) => {
      if (request.query.by) {
        switch (request.query.by) {
          case "ID":
            studentController.findStudentByID(
              request.query.ID,
              (error, student) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (student) {
                    response.status(200).json(student);
                  } else {
                    response.status(400).send(`student does not exist`);
                  }
                }
              }
            );
            break;
          case "name":
            studentController.findStudentByName(
              request.query.name,
              (error, student) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (student) {
                    response.status(200).json(student);
                  } else {
                    response.status(400).send(`student does not exist`);
                  }
                }
              }
            );
            break;
          default:
            response.status(400).send("Incorrect query parameters.");
            break;
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    router.post("/create", generateStudentID, (request, response) => {
      studentController.createStudent({ ...request.body }, (error, student) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(student);
        }
      });
    });
    router.get("/:studentID", studentController.getStudent);
    router.get("/:studentID/results", (request, response) => {
      studentController.results.findAll(
        request.params.studentID.replace(/-/g, "/"),
        (error, results) => {
          if (error) {
            console.log("error ", error);
            response.status(400).send(error);
          } else {
            console.log("data", results);
            response.status(200).json(results);
          }
        }
      );
    });
    router.get("/:studentID/invoices", (request, response) => {
      studentController.invoices.findAll(
        request.params.studentID.replace(/-/g, "/"),
        (error, invoices) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(invoices);
          }
        }
      );
    });
    router.post("/:studentID/update", (request, response) => {
      studentController.findStudentByID(
        request.params.studentID.replace(/-/g, "/"),
        (error, student) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (student) {
              studentController.updateStudentByID(
                student._id,
                { ...request.body },
                (error2) => {
                  if (error2) {
                    response.status(400).send(error2);
                  } else {
                    response.status(200).end();
                  }
                }
              );
            } else {
              response.status(400).send("Student does not exist");
            }
          }
        }
      );
    });
    router.get("/:studentID/delete", (request, response) => {
      studentController.deleteStudentByID(
        request.params.studentID.replace(/-/g, "/"),
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:studentID/notifications", (request, response) => {
      studentController.notifications.findAll(
        request.params.studentID.replace(/-/g, "/"),
        (error, notifications) => {}
      );
    });
    router.get(
      "/:studentID/notifications",
      studentController.getAllNotifications
    );
    router.post("/:studentID/profile/edit", studentController.editProfile);
    router.get("/activate/:studentID", studentController.activate);
    router.get("/deactivate/:studentID", studentController.deactivate);
    router.get("/delete/:studentID", studentController._delete);
    module2.exports = router;
  },
});

// routers/teacher.js
var require_teacher2 = __commonJS({
  "routers/teacher.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var { teacherController } = controllers;
    router.get("/count-all", (request, response) => {
      teacherController.countAllTeachers((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    router.get("/find-all", (request, response) => {
      teacherController.findAllTeachers({}, (error, teachers) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(teachers);
        }
      });
    });
    router.get("/find-one", (request, response) => {
      if (request.query.by) {
        switch (request.query.by) {
          case "ID":
            teacherController.findTeacherByID(
              request.query.ID,
              (error, teacher) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (teacher) {
                    response.status(200).json(teacher);
                  } else {
                    response.status(400).send(`teacher does not exist`);
                  }
                }
              }
            );
            break;
          case "emailAddress":
            teacherController.findTeacherByEmailAddress(
              request.query.name,
              (error, teacher) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (teacher) {
                    response.status(200).json(teacher);
                  } else {
                    response.status(400).send(`teacher does not exist`);
                  }
                }
              }
            );
            break;
          default:
            response.status(400).send("Incorrect query parameters");
            break;
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    router.post("/create", (request, response) => {
      teacherController.findTeacherByEmailAddress(
        request.body.email,
        (error, teacher) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (teacher) {
              response
                .status(400)
                .send("Teacher with this e-mail address already exists!");
            } else {
              teacherController.createTeacher(
                { ...request.body },
                (error2, teacher2) => {
                  if (error2) {
                    response.status(400).send(error2);
                  } else {
                    response.status(200).json(teacher2);
                  }
                }
              );
            }
          }
        }
      );
    });
    router.get("/delete-one", (request, response) => {
      if (request.query.by) {
        switch (request.query.by) {
          case "ID":
            teacherController.findTeacherByID(
              request.query.ID,
              (error, teacher) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (teacher) {
                    teacherController.deleteTeacherByID(
                      teacher._id,
                      (error2) => {
                        if (error2) {
                          response.status(400).send(error2);
                        } else {
                          response.status(200).end();
                        }
                      }
                    );
                  } else {
                    response.status(400).send(`teacher does not exist`);
                  }
                }
              }
            );
            break;
          case "emailAddress":
            teacherController.findTeacherByEmailAddress(
              request.query.name,
              (error, teacher) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (teacher) {
                    response.status(200).json(teacher);
                  } else {
                    response.status(400).send(`teacher does not exist`);
                  }
                }
              }
            );
            break;
          default:
            response.status(400).send("Incorrect query parameters");
            break;
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    router.get("/:id", teacherController.getTeacher);
    module2.exports = router;
  },
});

// routers/class.js
var require_class2 = __commonJS({
  "routers/class.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var { classController } = controllers;
    router.get("/", classController.getAllClasses);
    router.post("/addClass", classController.addClass);
    router.post("/assignstudent", classController.assignStudent);
    router.post("/assignteacher", classController.assignTeacher);
    router.get("/count-all", (request, response) => {
      classController.countAllClasses((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    router.get("/find-all", (request, response) => {
      classController.findAllClasses(
        {
          paginate: request.query.paginate === "true" ? true : false,
          count: request.query.count ? parseInt(request.query.count) : 10,
          page: request.query.page ? parseInt(request.query.page) : 1,
        },
        (error, classes) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(classes);
          }
        }
      );
    });
    router.get("/find-one", (request, response) => {
      if (request.query.by) {
        switch (request.query.by) {
          case "ID":
            classController.findClassByID(request.query.ID, (error, _class) => {
              if (error) {
                response.status(400).send(error);
              } else {
                if (_class) {
                  response.status(200).json(_class);
                } else {
                  response.status(400).send(`class does not exist`);
                }
              }
            });
            break;
          case "name":
            classController.findClassByName(
              request.query.name,
              (error, _class) => {
                if (error) {
                  response.status(400).send(error);
                } else {
                  if (_class) {
                    response.status(200).json(_class);
                  } else {
                    response.status(400).send(`class does not exist`);
                  }
                }
              }
            );
            break;
          default:
            response.status(400).send("Incorrect query parameters");
            break;
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    router.get("/:classID/students/assign", (request, response) => {
      classController.students.assign(
        request.params.classID,
        request.query.studentID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:classID/students/deassign", (request, response) => {
      classController.students.deassign(
        request.params.classID,
        request.query.studentID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:classID/teachers/assign", (request, response) => {
      classController.teachers.assign(
        request.params.classID,
        request.query.emailAddress,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:classID/teachers/deassign", (request, response) => {
      classController.teachers.deassign(
        request.params.classID,
        request.query.teacherID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:classID/subjects/add", (request, response) => {
      classController.subjects.add(
        request.params.classID,
        request.query.subject,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.get("/:classID/subjects/remove", (request, response) => {
      classController.subjects.remove(
        request.params.classID,
        request.query.subject,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    router.post("/:classID/subjects/add", classController.addSubject);
    router.post("/:classID/subjects/delete", classController.deleteSubject);
    module2.exports = router;
  },
});

// routers/result.js
var require_result2 = __commonJS({
  "routers/result.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var { resultController } = controllers;
    var { aggregateScores, generateResultPDF } = middlewares;
    router.get("/", resultController.getAllResults);
    router.get("/find-all", (request, response) => {
      resultController.findAllResults(
        {
          paginate: request.query.paginate === "true" ? true : false,
          count: request.query.count ? parseInt(request.query.count) : 20,
          page: request.query.page ? parseInt(request.query.page) : 1,
        },
        (error, results) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(results);
          }
        }
      );
    });
    router.get("/find", (request, response) => {
      resultController.findAllResults((error, results) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(results);
        }
      });
    });
    router.get("/count-all", (request, response) => {
      resultController.countAllResults((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    router.get("/find-one", (request, response) => {
      switch (request.query.by) {
        case ID:
          resultController.findResultbyID(request.query.ID, (error, result) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (result) {
                response.status(200).json(result);
              } else {
                response.status(400).send(error);
              }
            }
          });
          break;
        default:
          response.status(400).send("Incorrect query parameters");
          break;
      }
    });
    router.post("/upload", aggregateScores, (request, response) => {
      resultController.uploadResult(data, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    router.get("/:id", resultController.getResult);
    router.post("/", aggregateScores, resultController.addResult);
    router.post("/:resultID/edit", resultController.editResult);
    router.get("/:resultID/approve", (request, response) => {
      resultController.approveResult(request.params.resultID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    router.get(
      "/:resultID/download",
      resultController.downloadResult,
      generateResultPDF
    );
    router.get("/:resultID/delete", (request, response) => {
      resultController.deleteResult(request.params.resultID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    module2.exports = router;
  },
});

// middlewares/imageUpload.js
var require_imageUpload = __commonJS({
  "middlewares/imageUpload.js"(exports, module2) {
    var multer2 = require("multer");
    var storage = multer2.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./");
      },
      filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `uploads/${req.body.fileName}.jpeg`);
      },
    });
    var upload = multer2({
      storage,
    });
    module2.exports = upload;
  },
});

// routers/image.js
var require_image = __commonJS({
  "routers/image.js"(exports, module2) {
    var router = require("express").Router();
    var multer2 = require("multer");
    var imageUpload = require_imageUpload();
    router.post("/upload", imageUpload.single("image"), (req, res2) => {
      try {
        console.log(req.body);
      } catch (err) {
        res2.status(400).send(err);
      }
    });
    module2.exports = router;
  },
});

// routers/admin.js
var require_admin2 = __commonJS({
  "routers/admin.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { adminController } = controllers;
    var { Router } = express2;
    var adminRouter2 = Router();
    adminRouter2.get("/find-all", (request, response) => {
      adminController.findAllAdmins(
        {
          paginate: request.query.paginate === "true" ? true : false,
          count: request.query.count ? parseInt(request.query.count) : 10,
          page: request.query.page ? parseInt(request.query.page) : 1,
        },
        (error, admins) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).send(admins);
          }
        }
      );
    });
    adminRouter2.post("/create", (request, response) => {
      adminController.findAdminByEmailAddress(
        request.body.emailAddress,
        (error, document2) => {
          if (error) {
            response.status(400).send(error);
          } else {
            if (document2) {
              response.status(400).send("This email already exists");
            } else {
              adminController.createAdmin(
                { ...request.body },
                (error2, admin) => {
                  if (error2) {
                    response.status(400).send(error2);
                  } else {
                    response.status(200).json(admin);
                  }
                }
              );
            }
          }
        }
      );
    });
    module2.exports = adminRouter2;
  },
});

// routers/term.js
var require_term2 = __commonJS({
  "routers/term.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { termController } = controllers;
    var { Router } = express2;
    termRouter = Router();
    termRouter.get("/", termController.getTerm);
    termRouter.post("/set", termController.setTerm);
    module2.exports = termRouter;
  },
});

// routers/session.js
var require_session2 = __commonJS({
  "routers/session.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var { sessionController } = controllers;
    router.get("/", sessionController.getSession);
    router.post("/set", sessionController.setSession);
    module2.exports = router;
  },
});

// routers/invoice.js
var require_invoice2 = __commonJS({
  "routers/invoice.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { Router } = express2;
    var { invoiceController } = controllers;
    var {
      findInvoiceByID,
      getByID,
      editByID,
      deleteByID,
      getAll,
      deleteAll,
      create,
    } = invoiceController;
    var invoiceRouter2 = Router();
    invoiceRouter2.get("/find-all", (request, response) => {
      invoiceController.findAllInvoices(
        {
          paginate: request.query.paginate === "true" ? true : false,
        },
        (error, invoices) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(invoices);
          }
        }
      );
    });
    invoiceRouter2.get("/count-all", (request, response) => {
      invoiceController.countAllInvoices((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    invoiceRouter2.get("/find-one", (request, response) => {
      if (request.query.by) {
        if (request.query.by === "ID") {
          invoiceController.findInvoiceByID(
            request.query.ID,
            (error, invoice) => {
              if (error) {
                response.status(400).send(error);
              } else {
                if (invoice) {
                  response.status(200).json(invoice);
                } else {
                  response.status(400).send("Invoice not found!");
                }
              }
            }
          );
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    invoiceRouter2.post("/create", (request, response) => {
      invoiceController.createInvoice({ ...request.body }, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    invoiceRouter2.get("/:ID/update", (request, response) => {
      invoiceController.updateInvoiceByID(request.params.ID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    invoiceRouter2.get("/:ID/delete", (request, response) => {
      invoiceController.deleteInvoiceByID(request.params.ID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    invoiceRouter2.get("/templates/find-all", (request, response) => {
      invoiceController.templates.findAllInvoices({}, (error, invoices) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(invoices);
        }
      });
    });
    invoiceRouter2.get("/templates/count-all", (request, response) => {
      invoiceController.templates.countAllInvoices((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    invoiceRouter2.get("/templates/find-one", (request, response) => {
      if (request.query.by) {
        if (request.query.by === "ID") {
          invoiceController.templates.findInvoiceByID(
            request.query.ID,
            (error, invoice) => {
              if (error) {
                response.status(400).send(error);
              } else {
                if (invoice) {
                  response.status(200).json(invoice);
                } else {
                  response.status(400).send("Invoice not found!");
                }
              }
            }
          );
        }
      } else {
        response.status(400).send("Incorrect query parameters");
      }
    });
    invoiceRouter2.post("/templates/create", (request, response) => {
      invoiceController.templates.createInvoice(
        { ...request.body },
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    invoiceRouter2.get("/templates/:ID/update", (request, response) => {
      invoiceController.templates.updateInvoiceByID(
        request.params.ID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    invoiceRouter2.get("/templates/:ID/delete", (request, response) => {
      invoiceController.templates.deleteInvoiceByID(
        request.params.ID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    module2.exports = invoiceRouter2;
  },
});

// routers/fee.js
var require_fee2 = __commonJS({
  "routers/fee.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { Router } = express2;
    var { feeController } = controllers;
    var feeRouter2 = Router();
    feeRouter2.get("/", feeController.getAllFees);
    feeRouter2.post("/", feeController.createFee);
    feeRouter2.delete("/:feeID", feeController.deleteFee);
    module2.exports = feeRouter2;
  },
});

// routers/notification.js
var require_notification3 = __commonJS({
  "routers/notification.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { Router } = express2;
    var { notificationController } = controllers;
    var { getAll, create, deleteByID, updateByID } = notificationController;
    var notificationRouter2 = Router();
    notificationRouter2.get("/", getAll);
    notificationRouter2.post("/", create);
    notificationRouter2.patch("/:notificationID", updateByID);
    notificationRouter2.delete("/:notificationID", deleteByID);
    module2.exports = notificationRouter2;
  },
});

// routers/auth.js
var require_auth2 = __commonJS({
  "routers/auth.js"(exports, module2) {
    var express2 = require("express");
    var jsonwebtoken2 = require("jsonwebtoken");
    var controllers = require_controllers();
    var { Router } = express2;
    var { authController } = controllers;
    var authRouter2 = Router();
    authRouter2.post("/sign-in/student", (request, response) => {
      authController.signin.student(
        request.body.studentID || "",
        request.body.password || "",
        (error, accessToken2) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).send(accessToken2);
          }
        }
      );
    });
    authRouter2.post("/sign-in/teacher", (request, response) => {
      authController.signin.teacher(
        request.body.email,
        request.body.password,
        (error, data2) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(data2);
          }
        }
      );
    });
    authRouter2.post("/sign-in/admin", authController.signin.admin);
    authRouter2.get("/verify-access-token", (request, response) => {
      authController.verifyAccessToken(
        request.query.accessToken,
        (error, data2) => {
          if (error) {
            response.status(400).send(error.message);
          } else {
            response.status(200).json(data2);
          }
        }
      );
    });
    authRouter2.get("/sign-out/student", (request, response) => {
      authController.signOut.student((error) => {});
    });
    module2.exports = authRouter2;
  },
});

// routers/announcement.js
var require_announcement3 = __commonJS({
  "routers/announcement.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { Router } = express2;
    var { announcementController } = controllers;
    var announcementRouter2 = Router();
    announcementRouter2.get("/find-all", (request, response) => {
      announcementController.findAllAnnouncements((error, announcements) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(announcements);
        }
      });
    });
    announcementRouter2.get("/find", (request, response) => {
      announcementController.findAnnouncements(
        {
          by: request.query.by || "",
          visibility: request.body.visibility || "all",
        },
        (error, announcements) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(announcements);
          }
        }
      );
    });
    announcementRouter2.post("/create", (request, response) => {
      announcementController.createAnnouncement(
        { ...request.body },
        {
          visibility: request.body.visibility || "general",
        },
        (error, announcement) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(announcement);
          }
        }
      );
    });
    announcementRouter2.get("/delete-one", (request, response) => {
      announcementController.deleteAnnouncementByID(
        request.query.ID,
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    announcementRouter2.get("/update-one", (request, response) => {
      announcementController.updateAnnouncementByID(
        request.query.ID,
        { action: request.query.action || null },
        (error) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).end();
          }
        }
      );
    });
    module2.exports = announcementRouter2;
  },
});

// routers/index.js
var require_routers = __commonJS({
  "routers/index.js"(exports, module2) {
    var studentRouter2 = require_student2();
    var teacherRouter2 = require_teacher2();
    var classRouter2 = require_class2();
    var resultRouter2 = require_result2();
    var imageRouter2 = require_image();
    var adminRouter2 = require_admin2();
    var termRouter3 = require_term2();
    var sessionRouter2 = require_session2();
    var invoiceRouter2 = require_invoice2();
    var feeRouter2 = require_fee2();
    var notificationRouter2 = require_notification3();
    var authRouter2 = require_auth2();
    var announcementRouter2 = require_announcement3();
    module2.exports = {
      studentRouter: studentRouter2,
      teacherRouter: teacherRouter2,
      classRouter: classRouter2,
      resultRouter: resultRouter2,
      imageRouter: imageRouter2,
      adminRouter: adminRouter2,
      termRouter: termRouter3,
      sessionRouter: sessionRouter2,
      invoiceRouter: invoiceRouter2,
      feeRouter: feeRouter2,
      notificationRouter: notificationRouter2,
      authRouter: authRouter2,
      announcementRouter: announcementRouter2,
    };
  },
});

// index.js
var express = require("express");
var dotenv = require("dotenv").config();
var mongoose = require("mongoose");
var cors = require("cors");
var multer = require("multer");
var routers = require_routers();
var models = require_models();
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});
var {
  studentRouter,
  teacherRouter,
  classRouter,
  resultRouter,
  imageRouter,
  adminRouter,
  termRouter: termRouter2,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter,
} = routers;
var { invoiceModel, resultModel } = models;
invoiceModel.default();
var server = express();
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
server.use("/term", termRouter2);
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
server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
