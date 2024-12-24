var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
        required: true
      }
    });
    var invoiceSchema = {
      default: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: {
            type: String,
            required: true,
            default: "DEFAULT"
          },
          issuedTo: {
            type: String,
            required: true,
            ref: "Student"
          },
          issuedAt: {
            type: Date,
            default: (/* @__PURE__ */ new Date()).getTime()
          },
          status: {
            type: String,
            default: "Unpaid",
            enum: {
              values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
              message: "{VALUE} is not a valid option for status"
            }
          }
        },
        { collection: "invoices" }
      ),
      template: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: { type: String, default: "TEMPLATE" },
          title: { type: String, required: true }
        },
        { collection: "invoices" }
      ),
      draft: new mongoose2.Schema(
        {
          fees: [feeSchema],
          type: { type: String, default: "DRAFT" },
          issuedTo: {
            type: String,
            ref: "Student"
          },
          status: {
            type: String,
            default: "Unpaid",
            enum: {
              values: ["Unpaid", "Paid", "Overdue", "PartPayment"],
              message: "{VALUE} is not a valid option for status"
            }
          }
        },
        { collection: "invoices" }
      )
    };
    module2.exports = {
      default: mongoose2.model("INVOICE_DEFAULT", invoiceSchema.default),
      template: mongoose2.model("INVOICE_TEMPLATE", invoiceSchema.template),
      draft: mongoose2.model("INVOICE_DRAFT", invoiceSchema.draft)
    };
  }
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
        required: true
      },
      type: {
        type: String,
        default: "NEW_INVOICE"
      },
      invoiceID: {
        type: String,
        required: true
      },
      isRead: {
        type: Boolean,
        default: false
      }
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
        required: true
      },
      type: {
        type: String,
        default: "NEW_MESSAGE"
      }
    });
    var newMessageNotificationModel = model(
      "NewMessageNotification",
      newMessageNotificationSchema,
      "notifications"
    );
    var notificationModel = model("Notification", {}, "notifications");
    module2.exports = function(type) {
      switch (type) {
        case "NEW_INVOICE":
          return newInvoiceNotificationModel;
        case "NEW_MESSAGE":
          return newMessageNotificationModel;
        default:
          return notificationModel;
      }
    };
  }
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
          required: true
        },
        message: {
          type: String,
          required: true
        },
        privacy: {
          type: String,
          required: true,
          enum: ["general", "class", "teacher", "student", "admin"],
          default: "general"
        },
        createdBy: {
          id: {
            type: String
          },
          role: {
            type: String
          }
        },
        isHidden: {
          type: String,
          default: false
        },
        createdAt: {
          type: Date,
          default: (/* @__PURE__ */ new Date()).getTime()
        },
        populatedFields: {}
      },
      {
        collection: "announcements",
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );
    announcementSchema.static("findAll", function(options, callback2) {
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
        justOne: true
      });
    });
    announcementSchema.virtual("populatedFields.class", {
      ref: "Class",
      foreignField: "_id",
      localField: "class",
      justOne: true
    });
    module2.exports = (options) => {
      if (options) {
        if (options.visibility === "class") {
          announcementSchema.add({
            class: { type: String, required: true }
          });
        } else {
          announcementSchema.remove("class");
        }
      }
      return model("Announcement", announcementSchema);
    };
  }
});

// models/studentModel.js
var require_studentModel = __commonJS({
  "models/studentModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var studentSchema = new mongoose2.Schema(
      {
        _id: {
          type: String,
          lowercase: true,
          trim: true,
          required: true,
          index: false
        },
        firstName: {
          type: String,
          lowercase: true,
          trim: true,
          required: true
        },
        lastName: {
          type: String,
          lowercase: true,
          trim: true,
          required: true
        },
        emailAddress: {
          type: String,
          lowercase: true,
          trim: true
        },
        phoneNumber: {
          type: String,
          trim: true
        },
        gender: {
          type: String,
          lowercase: true,
          enum: ["male", "female"],
          required: true
        },
        password: {
          type: String,
          required: true
        },
        pin: {
          type: String,
          required: true,
          default: "0000"
        },
        role: {
          type: String,
          lowercase: true,
          default: "student"
        },
        address: {
          type: String,
          required: true
        },
        invoices: [
          {
            type: String,
            ref: "INVOICE_DEFAULT"
          }
        ],
        status: {
          type: String,
          default: "active"
        },
        createdAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        },
        updatedAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        },
        lastSeen: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        },
        isDeleted: {
          type: Boolean,
          required: true,
          default: false
        },
        isBanned: {
          type: Boolean,
          required: true,
          default: false
        },
        isSuspended: {
          type: Boolean,
          required: true,
          default: false
        },
        isArchived: {
          type: Boolean,
          required: true,
          default: false
        }
      },
      {
        collection: "students",
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );
    studentSchema.virtual("class", {
      ref: "Class",
      localField: "_id",
      foreignField: "students",
      justOne: true
    });
    studentSchema.virtual("results", {
      ref: "Result",
      localField: "_id",
      foreignField: "student"
    });
    studentSchema.static("findAll", function(callback2) {
      return this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    studentSchema.static("findByID", function(ID, callback2) {
      return this.find({ _id: ID }).populate(["results", "invoices"]).exec((error, documents) => {
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
    studentSchema.static("findByName", function(name, callback2) {
      return this.find(
        {
          $or: [{ firstName: name }, { lastName: name }]
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
    studentSchema.static("findBySearch", function(search, callback2) {
      return this.find(
        {
          $or: [
            { firstName: new RegExp(search, "i") },
            { lastName: new RegExp(search, "i") }
          ]
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
  }
});

// models/administrator.model.js
var require_administrator_model = __commonJS({
  "models/administrator.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var administratorSchema = new mongoose2.Schema(
      {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        gender: {
          type: String,
          lowercase: true,
          enum: ["male", "female"],
          required: true,
          default: "male"
        },
        maritalStatus: {
          type: String,
          lowercase: true,
          enum: ["single", "married", "divorced"],
          required: true,
          default: "single"
        },
        email: {
          type: String,
          required: true
        },
        password: {
          type: String,
          required: true
        },
        role: {
          type: String,
          lowercase: true,
          default: "admin"
        },
        secondaryRole: {
          type: String,
          lowercase: true,
          required: true,
          default: "administrator"
        },
        homeAddress: {
          type: String
        },
        status: {
          type: String,
          default: "active"
        },
        isDeleted: {
          type: Boolean,
          required: true,
          default: false
        },
        isBanned: {
          type: Boolean,
          required: true,
          default: false
        },
        image: {
          type: String
        },
        conversations: [
          {
            type: String,
            ref: "Conversation"
          }
        ]
      },
      { collection: "admins" }
    );
    var administratorModel = mongoose2.model("Administrator", administratorSchema);
    module2.exports = administratorModel;
  }
});

// models/result.model.js
var require_result_model = __commonJS({
  "models/result.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var resultSchema = new mongoose2.Schema({
      student: {
        type: "String",
        ref: "Student",
        required: true
      },
      school: {
        type: "String",
        required: true
      },
      title: {
        type: "String",
        required: true
      },
      class: {
        type: mongoose2.Types.ObjectId,
        ref: "Class",
        required: true
      },
      session: {
        type: "String",
        required: true,
        lowercase: true
      },
      term: {
        type: "String",
        required: true,
        lowercase: true
      },
      scoreSheet: {
        type: "String",
        required: true
      },
      overallGrade: {
        type: "String"
      },
      overallPercentage: {
        type: "Number"
      },
      electives: [
        {
          title: {
            type: "String"
          },
          grade: {
            type: "String"
          }
        }
      ],
      teachersRemark: {
        type: String
      },
      principalsRemark: {
        type: String
      },
      resumptionDate: {
        type: String
      },
      gradingScale: {
        type: String
      },
      uploadedAt: {
        type: Date,
        default: () => (/* @__PURE__ */ new Date()).getTime()
      },
      updatedAt: {
        type: Date,
        default: () => (/* @__PURE__ */ new Date()).getTime()
      },
      isApproved: {
        type: Boolean,
        required: true,
        default: false
      },
      type: {
        type: String,
        required: true
      },
      comments: {
        type: String,
        default: "n/a"
      },
      isDeleted: {
        type: Boolean,
        required: true,
        default: false
      }
    });
    resultSchema.static("findAll", function(callback2) {
      return this.find().populate([
        { path: "class", select: "-image -password" },
        { path: "student", select: "-image -password" }
      ]).exec((error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    resultSchema.static("findByID", function(ID, callback2) {
      return this.find({ _id: ID }, (error, documents) => {
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
  }
});

// models/passwordResetPin.model.js
var require_passwordResetPin_model = __commonJS({
  "models/passwordResetPin.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var passwordResetPinSchema = new mongoose2.Schema(
      {
        administrator: {
          type: "String",
          ref: "Admin"
        },
        pin: {
          type: String,
          unique: true,
          lowercase: true
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      },
      { collection: "password_reset_pins" }
    );
    var passwordResetPinModel = mongoose2.model(
      "PasswordResetPin",
      passwordResetPinSchema
    );
    module2.exports = passwordResetPinModel;
  }
});

// models/teacherModel.js
var require_teacherModel = __commonJS({
  "models/teacherModel.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var teacherSchema = new mongoose2.Schema(
      {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        gender: {
          type: String,
          lowercase: true,
          enum: ["male", "female"],
          required: true
        },
        maritalStatus: {
          type: String,
          lowercase: true,
          enum: ["single", "married"],
          required: true
        },
        email: {
          lowercase: true,
          type: String,
          required: true
        },
        password: {
          type: String,
          required: true
        },
        role: {
          type: String,
          lowercase: true,
          default: "teacher"
        },
        address: {
          type: String,
          required: true
        },
        status: {
          type: String,
          default: "active"
        },
        createdAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        },
        updatedAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        },
        isDeleted: {
          type: Boolean,
          required: true,
          default: false
        },
        isBanned: {
          type: Boolean,
          required: true,
          default: false
        }
      },
      {
        collection: "teachers",
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );
    teacherSchema.static("findAll", function(callback2) {
      return this.find({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    });
    teacherSchema.static("findByID", function(ID, callback2) {
      return this.find({ _id: ID }, (error, documents) => {
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
    teacherSchema.static("findByName", function(name, callback2) {
      return this.find(
        {
          $or: [{ firstName: name }, { lastName: name }]
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
    teacherSchema.static("findByEmailAddress", function(email, callback2) {
      return this.find({ email }, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents[0]);
        }
      });
    });
    teacherSchema.virtual("class", {
      ref: "Class",
      foreignField: "teachers",
      localField: "_id",
      justOne: true
    });
    teacherSchema.virtual("classes", {
      ref: "Class",
      foreignField: "teachers",
      localField: "_id"
    });
    var Teacher = mongoose2.model("Teacher", teacherSchema);
    module2.exports = Teacher;
  }
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
        unique: true
      },
      teachers: [
        {
          type: mongoose2.Schema.Types.ObjectId,
          ref: "Teacher"
        }
      ],
      subjects: [
        {
          type: String
        }
      ],
      students: [
        {
          type: String,
          ref: "Student"
        }
      ],
      isDeleted: {
        type: Boolean,
        required: true,
        default: false
      }
    });
    classSchema.static("findAll", function(callback2) {
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
  }
});

// models/administratorActivityLog.model.js
var require_administratorActivityLog_model = __commonJS({
  "models/administratorActivityLog.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var administratorActivityLogSchema = new mongoose2.Schema(
      {
        administrator: {
          type: mongoose2.Types.ObjectId,
          required: true,
          ref: "Administrator"
        },
        type: {
          type: "String",
          required: true
        },
        entity: {
          type: mongoose2.Types.ObjectId,
          ref: function(doc) {
            if ([
              "sign_in",
              "sign_out",
              "create_administrator",
              "ban_administrator",
              "unban_administrator",
              "delete_administrator"
            ].indexOf(doc.type) > -1) {
              return "Administrator";
            }
            if (["ban_student", "unban_student"].indexOf(doc.type) > -1) {
              return "User";
            }
            if (["approve_result", "delete_result"].indexOf(doc.type) > -1) {
              return "Result";
            }
          }
        },
        createdAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        }
      },
      {
        collection: "administrator_activity_logs",
        minimize: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );
    var administratorActivityLogModel = mongoose2.model(
      "AdministratorActivityLog",
      administratorActivityLogSchema
    );
    module2.exports = administratorActivityLogModel;
  }
});

// models/studentActivityLog.model.js
var require_studentActivityLog_model = __commonJS({
  "models/studentActivityLog.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var studentActivityLogSchema = new mongoose2.Schema(
      {
        student: {
          $type: String,
          required: true,
          ref: "Student"
        },
        type: {
          $type: String,
          enum: ["sign_in"],
          required: true
        },
        createdAt: {
          $type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        }
      },
      { typeKey: "$type", collection: "student_activity_logs" }
    );
    var studentActivityLogModel = mongoose2.model(
      "StudentActivityLog",
      studentActivityLogSchema
    );
    module2.exports = studentActivityLogModel;
  }
});

// models/teacherActivityLog.model.js
var require_teacherActivityLog_model = __commonJS({
  "models/teacherActivityLog.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var teacherActivityLogSchema = new mongoose2.Schema(
      {
        teacher: {
          $type: String,
          required: true,
          ref: "Teacher"
        },
        type: {
          $type: String,
          enum: ["sign_in"],
          required: true
        },
        createdAt: {
          $type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        }
      },
      { typeKey: "$type", collection: "teacher_activity_logs" }
    );
    var teacherActivityLogModel = mongoose2.model(
      "TeacherActivityLog",
      teacherActivityLogSchema
    );
    module2.exports = teacherActivityLogModel;
  }
});

// models/session.model.js
var require_session_model = __commonJS({
  "models/session.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var sessionSchema = new mongoose2.Schema(
      {
        administrator: {
          type: mongoose2.Types.ObjectId,
          ref: "Administrator"
        },
        student: {
          type: String,
          ref: "Administrator"
        },
        teacher: {
          type: mongoose2.Types.ObjectId,
          ref: "Administrator"
        },
        accessToken: {
          type: String,
          unique: true,
          required: true
        },
        createdAt: {
          type: Date,
          default: () => (/* @__PURE__ */ new Date()).getTime()
        }
      },
      { collection: "sessions" }
    );
    var sessionModel = mongoose2.model("Session", sessionSchema);
    module2.exports = sessionModel;
  }
});

// models/variable.model.js
var require_variable_model = __commonJS({
  "models/variable.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var variableSchema = new mongoose2.Schema(
      {
        key: {
          type: String,
          required: true,
          unique: true
        },
        value: {
          type: mongoose2.Schema.Types.Mixed,
          required: true,
          default: "n/a"
        }
      },
      { collection: "variables" }
    );
    var variableModel = mongoose2.model("Variable", variableSchema);
    module2.exports = variableModel;
  }
});

// models/conversation.model.js
var require_conversation_model = __commonJS({
  "models/conversation.model.js"(exports, module2) {
    var mongoose2 = require("mongoose");
    var conversationSchema = new mongoose2.Schema({
      members: [
        {
          id: {
            type: String
          },
          role: {
            type: String,
            enum: ["student", "teacher", "administrator", "admin"]
          }
        }
      ],
      messages: [
        {
          id: {
            type: String
          },
          body: {
            type: String
          },
          sender: {
            role: {
              type: String,
              enum: ["administrator", "student", "teacher", "admin"]
            },
            id: {
              type: String
            }
          }
        }
      ],
      createdAt: {
        type: Date,
        default: () => (/* @__PURE__ */ new Date()).getTime()
      }
    });
    var conversationModel = mongoose2.model("Conversation", conversationSchema);
    module2.exports = conversationModel;
  }
});

// models/index.js
var require_models = __commonJS({
  "models/index.js"(exports, module2) {
    var invoiceModel2 = require_invoiceModel();
    var notificationModel = require_notification();
    var announcementModel = require_announcement();
    var studentModel = require_studentModel();
    var administratorModel = require_administrator_model();
    var resultModel = require_result_model();
    var passwordResetPinModel = require_passwordResetPin_model();
    var teacherModel = require_teacherModel();
    var classModel = require_classModel();
    var administratorActivityLogModel = require_administratorActivityLog_model();
    var studentActivityLogModel = require_studentActivityLog_model();
    var teacherActivityLogModel = require_teacherActivityLog_model();
    var sessionModel = require_session_model();
    var variableModel = require_variable_model();
    var conversation = require_conversation_model();
    var student = require_studentModel();
    var result = require_result_model();
    module2.exports = {
      invoiceModel: invoiceModel2,
      notificationModel,
      announcementModel,
      studentModel,
      administratorModel,
      resultModel,
      passwordResetPinModel,
      teacherModel,
      classModel,
      administratorActivityLogModel,
      sessionModel,
      variableModel,
      teacherActivityLogModel,
      studentActivityLogModel,
      conversation,
      student,
      result
    };
  }
});

// controllers/student.js
var require_student = __commonJS({
  "controllers/student.js"(exports) {
    var mongoose2 = require("mongoose");
    var models2 = require_models();
    var bcrypt = require("bcrypt");
    var fs = require("fs");
    var Student = require_studentModel();
    var Class = require_classModel();
    var { notificationModel, invoiceModel: invoiceModel2 } = models2;
    var metrics = async function(request, response) {
      try {
        let totalNumberOfStudents = 0;
        let totalNumberOfSuspendedStudents = 0;
        let totalNumberOfBannedStudents = 0;
        let totalNumberOfArchivedStudents = 0;
        let totalNumberOfDeletedStudents = 0;
        totalNumberOfStudents += parseInt(
          await models2.studentModel.countDocuments({ isDeleted: false })
        );
        totalNumberOfSuspendedStudents += parseInt(
          await models2.studentModel.countDocuments({ isSuspended: true })
        );
        totalNumberOfBannedStudents += parseInt(
          await models2.studentModel.countDocuments({ isBanned: true })
        );
        totalNumberOfArchivedStudents += parseInt(
          await models2.studentModel.countDocuments({ isArchived: true })
        );
        totalNumberOfDeletedStudents += parseInt(
          await models2.studentModel.countDocuments({ isDeleted: true })
        );
        return response.status(200).json({
          message: "Success!",
          data: {
            totalNumberOfStudents,
            totalNumberOfSuspendedStudents,
            totalNumberOfArchivedStudents,
            totalNumberOfBannedStudents,
            totalNumberOfDeletedStudents
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({});
      }
    };
    var find = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(
          await models2.studentModel.countDocuments({
            ...request.body,
            isDeleted: false
          })
        );
        totalNumberOfPages = Math.ceil(totalCount / count);
        const students = await models2.studentModel.find(
          { ...request.body, isDeleted: false },
          {},
          { limit: count, skip: (page - 1) * count }
        ).sort({ createdAt: -1 }).populate(["class", "results"]);
        return response.status(200).json({
          data: {
            students,
            count: students.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findAll = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(await models2.studentModel.countDocuments({}));
        totalNumberOfPages = Math.ceil(totalCount / count);
        const students = await models2.studentModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ createdAt: -1 }).populate(["class", "results"]);
        return response.status(200).json({
          data: {
            students,
            count: students.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findOne = async function(request, response) {
      try {
        let student;
        let id = student = await models2.studentModel.findOne({ _id: request.query.id.replace(/-/g, "/") }).populate(["class", "results"]);
        if (!student) {
          return response.status(400).json({ message: "Student not found!", statusCode: 400 });
        }
        return response.status(200).json({
          data: { student },
          statusCode: 200,
          message: "Success!"
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var updateOne = async function(request, response) {
      try {
        const student = await models2.studentModel.findOne({
          _id: request.query.id.replace(/-/g, "/")
        });
        if (!student) {
          return response.status(400).json({ message: "Student not found!", statusCode: 400 });
        }
        switch (request.query.operation) {
          case "update":
            await models2.studentModel.updateOne(
              { _id: request.query.id.replace(/-/g, "/") },
              { ...request.body }
            );
            return response.status(200).json({ message: "Success!", statusCode: 200 });
          case "update_password":
            const salt = await bcrypt.genSalt(3);
            const hashedPassword = await bcrypt.hash(request.body.password, salt);
            await models2.studentModel.updateOne(
              { _id: request.query.id.replace(/-/g, "/") },
              { $set: { password: hashedPassword } }
            );
            return response.status(200).json({ message: "Password updated successfully!", statusCode: 200 });
          default:
            return response.status(400).json({ message: "Unknown operation!", statusCode: 400 });
        }
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var search = async function(request, response) {
      try {
        let students = [];
        if (request.query.search && request.query.search.trim() !== "" && request.query.search.trim().length > 2) {
          students = await models2.studentModel.find({
            $or: [
              {
                firstName: new RegExp(request.query.search, "i"),
                isDeleted: false
              },
              {
                lastName: new RegExp(request.query.search, "i"),
                isDeleted: false
              },
              {
                emailAddress: new RegExp(request.query.search, "i"),
                isDeleted: false
              }
            ]
          }).populate(["class", "results"]);
        }
        return response.status(200).json({ message: "Success!", data: { students }, statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    exports.findAllStudents = async function(req, res) {
      const student = await Student.find({}).populate("class");
      res.json(student);
    };
    exports.getStudent = async function(req, res) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      const student = await Student.findById(studentID2).populate([
        "class",
        "results"
      ]);
      res.status(200).json(student);
    };
    exports.addStudent = async function(req, res) {
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
          password: hashedPassword
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
            `${__dirname}/../uploads/images/profile/${newStudent._id.toString().replace(/\//g, "-")}.jpg`,
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
            message: err
          }
        });
      }
    };
    exports.activate = async function(req, res) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          if (student.status === "inactive") {
            await Student.updateOne({ _id: studentID2 }, { status: "active" });
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
            message: error
          }
        });
      }
    };
    exports.deactivate = async function(req, res) {
      const studentID2 = req.params.studentID.replace(/-/g, "/");
      try {
        const student = await Student.findById(studentID2);
        if (student) {
          if (student.status === "active") {
            await Student.updateOne({ _id: studentID2 }, { status: "inactive" });
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
            message: error
          }
        });
      }
    };
    exports._delete = async function(req, res) {
      try {
        const studentID2 = req.params.studentID.replace(/-/g, "/");
        const student = await Student.findByIdAndDelete(studentID2);
        await Class.updateOne(
          { _id: student.class },
          { $pull: { students: student._id } }
        );
        await student.results.forEach(async (result) => {
          await models2.resultModel.deleteOne({ _id: result });
        });
        res.status(200).json({});
      } catch (err) {
        res.status(400).json({
          error: {
            message: err
          }
        });
      }
    };
    exports.editProfile = async (req, res) => {
      try {
        const studentID2 = req.params.studentID.replace(/-/g, "/");
        await Student.updateOne({ _id: studentID2 }, { ...req.body });
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.getAllNotifications = async function(request, response) {
      const studentID2 = request.params.studentID.replace(/-/g, "/");
      notificationModel().find({ recipient: studentID2 }, (error, documents) => {
        response.status(200).json(documents);
      });
    };
    exports.deleteNotificationByID = async function(request, response) {
    };
    exports.countAllStudents = async function(callback2) {
      Student.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllStudents = async function(options, callback2) {
      if (options.paginate) {
        Student.find().sort({
          firstName: "asc"
        }).limit(options.count).skip(options.count * (options.page - 1)).exec(function(error, students) {
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
    exports.findStudentByID = async function(studentID2, callback2) {
      Student.findByID(studentID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findStudentByName = async function(name, callback2) {
      Student.findByName(name, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.createStudent = async function(data, callback2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      Student.create({ ...data, password: hashedPassword }).then((document2) => {
        if (data.class) {
          Class.updateOne(
            { _id: data.class },
            { $push: { students: document2._id } },
            (error, documents) => {
              console.log(error);
            }
          );
        }
        if (data.image) {
          fs.writeFile(
            `${__dirname}/../uploads/images/profile/${document2._id.toString().replace(/\//g, "-")}.jpg`,
            data.image,
            "base64",
            (error) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        callback2(null, document2);
      }).catch((error) => {
        callback2(error.message, null);
      });
    };
    exports.updateStudentByID = async function(studentID2, data, callback2) {
      Student.updateOne(
        { _id: studentID2 },
        { $set: { ...data } },
        (error, data2) => {
          if (error) {
            callback2(error.message);
          } else {
            callback2(null);
          }
        }
      );
    };
    exports.deleteStudentByID = async function(studentID2, callback2) {
      Student.deleteOne({ _id: studentID2 }, (error) => {
        if (error) {
          callback2(error);
        } else {
          models2.resultModel.find().where("student").equals(studentID2).exec((error2, results) => {
            if (error2) {
              callback2(error2);
            } else {
              results.forEach((result, index) => {
                models2.resultModel.deleteOne({ _id: result._id }, (error3) => {
                  if (error3) {
                    console.log(error3);
                  }
                });
              });
            }
          });
          Class.find().where("students").in(studentID2).exec((error2, classes) => {
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
      }
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
      }
    };
    var activityLogs = {
      findAll: async function(request, response) {
        try {
          let studentActivityLogs = [];
          let count = parseInt(request.query.count) || 10;
          let page = parseInt(request.query.page) || 1;
          let totalCount = 0;
          let totalNumberOfPages = 1;
          totalCount = parseInt(
            await models2.studentActivityLogModel.countDocuments({})
          );
          totalNumberOfPages = Math.ceil(totalCount / count);
          studentActivityLogs = await models2.studentActivityLogModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ createdAt: -1 }).populate(["student"]);
          return response.status(200).json({
            data: {
              studentActivityLogs,
              count: studentActivityLogs.length,
              totalCount,
              totalNumberOfPages,
              page
            },
            statusCode: 200,
            error: false,
            message: "Success!"
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({
            message: "Unable to process this request!",
            statusCode: 400,
            error: true,
            data: null
          });
        }
      }
    };
    var single = {
      results: {
        find: async function(request, response) {
          try {
            const filter = {
              isBanned: (() => {
                let value = null;
                if (request.query.is_banned) {
                  if (request.query.is_banned === "true" || request.query.is_banned === "false") {
                    value = request.query.is_banned === "true" ? true : false;
                  }
                }
                return value;
              })(),
              isLocked: (() => {
                let value = null;
                if (request.query.is_locked) {
                  if (request.query.is_locked === "true" || request.query.is_locked === "false") {
                    value = request.query.is_locked === "true" ? true : false;
                  }
                }
                return value;
              })(),
              createdAt: (() => {
                let value = null;
                if (request.query.created_at_start && request.query.created_at_end) {
                  const pattern = /^\d{4}-\d{2}-\d{2}$/;
                  let start;
                  let end;
                  if (pattern.test(request.query.created_at_start)) {
                    start = request.query.created_at_start.trim().split("-");
                    start = `${start[2]}-${start[1] - 1}-${start[0]}T00:00:00.000Z`;
                  }
                  if (pattern.test(request.query.created_at_end)) {
                    end = request.query.created_at_end.trim().split("-");
                    end = `${end[2]}-${end[1] - 1}-${end[0]}T00:00:00.000Z`;
                  }
                  if (start && end) {
                    value = { $gte: new Date(start), $lte: new Date(end) };
                  }
                }
                return value;
              })()
            };
            Object.keys(filter).forEach((key) => {
              if (filter[key] === null) {
                delete filter[key];
              }
            });
            const count = parseInt(request.query.count) || 10;
            const page = parseInt(request.query.page) || 1;
            let totalCount = 0;
            let totalNumberOfPages = 1;
            totalCount = await models2.result.countDocuments({
              student: request.payload.student._id
            });
            totalNumberOfPages = Math.ceil(totalCount / count);
            const results = await models2.result.find(
              { student: request.payload.student._id },
              {},
              { limit: count, skip: (page - 1) * count }
            ).sort({ createdAt: -1 }).populate(["student", "class"]);
            return response.status(200).json({
              data: {
                count: results.length,
                totalCount,
                totalNumberOfPages,
                page,
                results
              },
              message: "Success!",
              error: false,
              statusCode: 200
            });
          } catch (error) {
            console.log(error.message);
            console.log(error.stack);
            return response.status(400).json({
              message: "Unable to process this request!",
              error: true,
              data: null,
              statusCode: 400
            });
          }
        }
      }
    };
    exports.metrics = metrics;
    exports.find = find;
    exports.search = search;
    exports.findAll = findAll;
    exports.findOne = findOne;
    exports.updateOne = updateOne;
    exports.activityLogs = activityLogs;
    exports.single = single;
  }
});

// controllers/invoice.js
var require_invoice = __commonJS({
  "controllers/invoice.js"(exports) {
    var models2 = require_models();
    var studentController = require_student();
    var { invoiceModel: invoiceModel2, notificationModel, studentModel } = models2;
    exports.findAllInvoices = async function(options, callback2) {
      invoiceModel2.default.find({ type: "DEFAULT" }).exec((error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    };
    exports.countAllInvoices = async function(callback2) {
      invoiceModel2.default.countDocuments({ type: "DEFAULT" }).exec((error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findInvoiceByID = async function(invoiceID, callback2) {
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
    exports.createInvoice = async function(data, callback2) {
      invoiceModel2.default.create({ ...data }).then((document2) => {
        studentModel.findOne({ _id: data.issuedTo }, (error, student) => {
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
                    invoiceModel2.default.deleteOne({ _id: document2._id }).exec();
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
      }).catch((error) => {
        console.log("ERROR: " + error);
        callback2(error);
      });
    };
    exports.updateInvoiceByID = async function(request, response) {
      let invoice = request.payload.invoice;
      invoiceModel2(request.body.invoice.type).findByIdAndUpdate(
        invoice._id,
        { $set: { ...request.body } },
        { new: true },
        (error, document2) => {
          if (error) {
            response.status(400).send(error.message);
          }
          response.status(200).json(document2);
        }
      ).populate("issuedTo");
    };
    exports.deleteInvoiceByID = async function(invoiceID, callback2) {
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
      findAllInvoices: async function(options, callback2) {
        invoiceModel2.template.find({ type: "TEMPLATE" }).exec((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
      },
      countAllInvoices: async function(callback2) {
        invoiceModel2.template.countDocuments({ type: "TEMPLATE" }).exec((error, count) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, count);
          }
        });
      },
      findInvoiceByID: async function(invoiceID, callback2) {
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
      createInvoice: async function(data, callback2) {
        invoiceModel2.template.create({ ...data }).then((document2) => {
          console.log(document2);
          callback2(null);
        }).catch((error) => {
          console.log("ERROR: " + error);
          callback2(error);
        });
      },
      updateInvoiceByID: async function(request, response) {
        let invoice = request.payload.invoice;
        invoiceModel2(request.body.invoice.type).findByIdAndUpdate(
          invoice._id,
          { $set: { ...request.body } },
          { new: true },
          (error, document2) => {
            if (error) {
              response.status(400).send(error.message);
            }
            response.status(200).json(document2);
          }
        ).populate("issuedTo");
      },
      deleteInvoiceByID: async function(invoiceID, callback2) {
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
      }
    };
  }
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
    async function getByID(request, response) {
    }
    async function deleteByID(request, response) {
      let notificationID = request.params.notificationID;
      console.log(request.query.type);
      notificationModel().findByIdAndDelete(notificationID, (error, document2) => {
        response.status(200).json(document2);
      });
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
    async function deleteManyByID(request, response) {
    }
    module2.exports = {
      getAll,
      create,
      getByID,
      deleteByID,
      updateByID,
      deleteManyByID
    };
  }
});

// utils/responseGenerator.js
var require_responseGenerator = __commonJS({
  "utils/responseGenerator.js"(exports, module2) {
    var responseGenerator = (data, message, error = false, statusCode = 200) => {
      return {
        error,
        statusCode,
        message,
        data
      };
    };
    module2.exports = responseGenerator;
  }
});

// utils/index.js
var require_utils = __commonJS({
  "utils/index.js"(exports) {
    exports.responseGenerator = require_responseGenerator();
  }
});

// services/postmark.js
var require_postmark = __commonJS({
  "services/postmark.js"(exports, module2) {
    var postmark = require("postmark");
    var serverToken = "7d0a0998-9165-4e25-be5c-e25ddb114dcf";
    var serverClient = new postmark.ServerClient(serverToken);
    module2.exports = {
      serverClient
    };
    exports = postmark;
  }
});

// services/cloudinary.js
var require_cloudinary = __commonJS({
  "services/cloudinary.js"(exports, module2) {
    var cloudinary = require("cloudinary");
    cloudinary.v2.config({
      cloud_name: "dpdlmetwd",
      api_key: "625683892699238",
      api_secret: "aEV37HPSkXiXhbf2cDQkTpAwxeU",
      secure: true
    });
    module2.exports = cloudinary;
  }
});

// services/index.js
var require_services = __commonJS({
  "services/index.js"(exports) {
    exports.postmark = require_postmark();
    exports.cloudinary = require_cloudinary();
  }
});

// controllers/administrator.controller.js
var require_administrator_controller = __commonJS({
  "controllers/administrator.controller.js"(exports) {
    var bcrypt = require("bcrypt");
    var uid = require("uid");
    var models2 = require_models();
    var utils = require_utils();
    var services = require_services();
    var { cloudinary } = require_services();
    var metrics = async function(request, response) {
      try {
        let totalNumberOfAdministrators = 0;
        let totalNumberOfBannedAdministrators = 0;
        let totalNumberOfDeletedAdministrators = 0;
        totalNumberOfAdministrators = parseInt(
          await models2.administratorModel.countDocuments({ isDeleted: false })
        );
        totalNumberOfBannedAdministrators = parseInt(
          await models2.administratorModel.countDocuments({
            isDeleted: false,
            isBanned: true
          })
        );
        totalNumberOfBannedAdministrators = parseInt(
          await models2.administratorModel.countDocuments({
            isDeleted: true
          })
        );
        return response.status(200).json({
          message: "Success!",
          statusCode: 200,
          data: {
            totalNumberOfDeletedAdministrators,
            totalNumberOfBannedAdministrators,
            totalNumberOfAdministrators
          }
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var create = async function(request, response) {
      try {
        let administrator;
        administrator = await models2.administratorModel.findOne({
          email: request.body.emailAddress,
          isDeleted: false
        });
        if (administrator) {
          return response.status(400).json({
            message: "Administrator with this email address already exists!",
            statusCode: 400
          });
        }
        if (request.body.image) {
          const result = await services.cloudinary.v2.uploader.upload(
            `data:image/jpg;base64,${request.body.image}`,
            {
              folder: "uploads/administrators/images"
            }
          );
          request.body.image = result.secure_url;
        } else {
          if (request.body.gender === "male") {
            request.body.image = "https://res.cloudinary.com/dpdlmetwd/image/upload/v1692557699/assets/images/undraw_male_avatar_g98d_xxrdqz.svg";
          }
          if (request.body.gender === "female") {
            request.body.image = "https://res.cloudinary.com/dpdlmetwd/image/upload/v1692557699/assets/images/undraw_female_avatar_efig_kvzx8p.svg";
          }
        }
        const salt = await bcrypt.genSalt(3);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        administrator = await models2.administratorModel.create({
          ...request.body,
          password: hashedPassword,
          email: request.body.emailAddress
        });
        return response.status(200).json({
          message: "Administrator created successfully!",
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findAll = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(await models2.administratorModel.countDocuments({}));
        totalNumberOfPages = Math.ceil(totalCount / count);
        const administrators = await models2.administratorModel.find(
          { isDeleted: false },
          {},
          { limit: count, skip: (page - 1) * count }
        ).sort({ createdAt: -1 });
        return response.status(200).json({
          data: {
            administrators,
            count: administrators.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findOne = async function(request, response) {
      try {
        let administrator;
        administrator = await models2.administratorModel.findOne({
          _id: request.query.id
        }).populate(["conversations"]);
        if (!administrator) {
          return response.status(400).json({ message: "Administrator not found!", statusCode: 400 });
        }
        return response.status(200).json({ message: "Success!", data: { administrator }, statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var updateOne = async function(request, response) {
      try {
        let administrator;
        administrator = await models2.administratorModel.findOne({
          _id: request.query.id
        });
        if (!administrator) {
          return response.status(400).json({ message: "Administrator not found!", statusCode: 400 });
        }
        switch (request.query.operation) {
          case "update":
            await models2.administratorModel.updateOne(
              { _id: request.query.id },
              { $set: { ...request.body } }
            );
            return response.status(200).json({
              message: "Administrator updated successfully!",
              statusCode: 200
            });
          case "ban":
            await models2.administratorModel.updateOne(
              { _id: administrator._id },
              { $set: { status: "banned" } }
            );
            return response.status(200).json({ message: "Administrator banned successfully!" });
          case "unban":
            await models2.administratorModel.updateOne(
              { _id: administrator._id },
              { $set: { status: "active" } }
            );
            return response.status(200).json({ message: "Administrator unbanned successfully!" });
          default:
            return response.status(400).json({ message: "Invalid operation!", statusCode: 400 });
        }
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var deleteOne = async function(request, response) {
      try {
        let administrator;
        administrator = await models2.administratorModel.findOne({
          _id: request.query.id
        });
        if (!administrator) {
          return response.status(400).json({ message: "Administrator not found!", statusCode: 400 });
        }
        await models2.administratorModel.deleteOne({ _id: administrator._id });
        return response.status(200).json({
          message: "Administrator deleted successfully!",
          statusCode: 400
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    exports.password = {
      reset: async function(request, response) {
        try {
          const administrator = models2.administratorModel.findOne({
            email: request.query.emailAddress
          });
          if (!administrator) {
            return response.status(400).json(
              utils.responseGenerator(
                null,
                "Account with this email address was not found!",
                true,
                400
              )
            );
          }
          if (!administrator.allowPasswordReset) {
            return response.status(400).json(
              utils.responseGenerator(
                null,
                "You can't reset the password on this account without a reset token",
                true,
                400
              )
            );
          }
          const passwordMatch = await bcrypt.compare(
            request.body.password,
            administrator.password
          );
          if (passwordMatch) {
            return response.status(400).json(
              utils.responseGenerator(
                null,
                "You can't old password as new password",
                true,
                400
              )
            );
          }
          const salt = await bcrypt.genSalt(3);
          const hashedPassword = await bcrypt.hash(request.body.password, salt);
          await models2.administratorModel.updateOne(
            { _id: administrator._id },
            { $set: { password: hashedPassword } }
          );
          await services.postmark;
          return response.status(200).json(
            utils.responseGenerator(
              null,
              "Password updated successfully!",
              false,
              200
            )
          );
        } catch (error) {
          return response.status(400).json(
            utils.responseGenerator(
              null,
              "An error occurred while processing this request",
              true,
              400
            )
          );
        }
      },
      resetPin: {
        generate: async function(request, response) {
          try {
            const administrator = models2.administratorModel.findOne({
              email: request.query.emailAddress
            });
            if (!administrator) {
              return response.status(400).json(
                utils.responseGenerator(
                  null,
                  "Account with this email address was not found!",
                  true,
                  400
                )
              );
            }
            const pin = uid.uid(8);
            await models2.passwordResetPinModel.create({
              administrator: administrator._id,
              pin
            });
            if (process.env.NODE_ENV !== "test") {
              await services.postmark.serverClient.sendEmailWithTemplate(
                {
                  TemplateId: 30682589,
                  From: "Park British School no-reply@parkbritishschool.com",
                  To: request.query.emailAddress,
                  TemplateModel: {
                    email_address: request.query.emailAddress,
                    reset_pin: pin,
                    last_name: administrator.lastName
                  }
                },
                (error) => {
                  if (error) {
                    console.log(error.message);
                  }
                }
              );
            }
            return response.status(200).json(utils.responseGenerator(null, "Success", false, 200));
          } catch (error) {
            return response.status(400).json(
              utils.responseGenerator(
                null,
                "An error occurred while processing this request",
                true,
                400
              )
            );
          }
        },
        verify: async function(request, response) {
          try {
            const pin = await models2.passwordResetPinModel.findOne({
              pin: request.query.pin
            });
            if (!pin) {
              return response.status(400).json(utils.responseGenerator(null, "Invalid pin!", true, 400));
            }
            const administrator = models2.administratorModel.findOne({
              email: request.query.emailAddress
            });
            if (!administrator) {
              return response.status(400).json(
                utils.responseGenerator(
                  null,
                  "Account with this email address was not found!",
                  true,
                  400
                )
              );
            }
            if (pin.administrator !== administrator._id) {
              return response.status(400).json(utils.responseGenerator(null, "Invalid pin!", true, 400));
            }
            await models2.administratorModel.updateOne(
              { _id: administrator._id },
              { $set: { allowPasswordReset: true } }
            );
            return response.status(200).json(utils.responseGenerator(null, "Success", false, 200));
          } catch (error) {
            return response.status(400).json(
              utils.responseGenerator(
                null,
                "An error occurred while processing this request",
                true,
                400
              )
            );
          }
        }
      }
    };
    var single = {
      find: async function(request, response) {
        try {
          return response.status(200).json({
            message: "Success!",
            data: { administrator: request.payload.administrator },
            statusCode: 200
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      },
      update: async function(request, response) {
        try {
          switch (request.query.operation) {
            case "update":
              await models2.administratorModel.updateOne(
                { _id: request.query.id },
                { $set: { ...request.body } }
              );
              return response.status(200).json({
                message: "Administrator updated successfully!",
                statusCode: 200
              });
            case "update_image":
              if (!request.body.image) {
                return response.status(400).json({
                  message: "Please select image for upload!",
                  statusCode: 400
                });
              }
              const result = await services.cloudinary.v2.uploader.upload(
                `data:image/jpg;base64,${request.body.image}`,
                {
                  folder: "uploads/administrators/images"
                }
              );
              request.body.image = result.secure_url;
              await models2.administratorModel.updateOne(
                { _id: request.payload.administrator._id },
                {
                  $set: {
                    image: request.body.image,
                    updatedAt: (/* @__PURE__ */ new Date()).getTime()
                  }
                }
              );
              return response.status(200).json({
                message: "Image updated successfully!",
                statusCode: 200
              });
            default:
              return response.status(400).json({ message: "Unknown operation!", statusCode: 400 });
          }
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      },
      ban: async function(request, response) {
        try {
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      },
      unban: async function(request, response) {
        try {
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      },
      delete: async function(request, response) {
        try {
          if (request.payload.administrator.secondaryRole === "super_administrator") {
            return response.status(400).json({ message: "Super administrator cannot be deleted!" });
          }
          await models2.administratorModel.updateOne(
            { _id: request.payload.administrator._id },
            { $set: { isDeleted: true } }
          );
          await models2.administratorActivityLogModel.create({
            type: "delete_administrator",
            entity: request.payload.administrator._id,
            administrator: request.administrator._id
          });
          return response.status(200).json({
            message: "Administrator deleted successfully!",
            error: false,
            statusCode: 200
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      }
    };
    var activityLogs = {
      findAll: async function(request, response) {
        try {
          const count = parseInt(request.query.count) || 10;
          const page = parseInt(request.query.page) || 1;
          let totalCount = 0;
          let totalNumberOfPages = 1;
          totalCount = await models2.administratorActivityLogModel.countDocuments(
            {}
          );
          totalNumberOfPages = Math.ceil(totalCount / count);
          const administratorActivityLogs = await models2.administratorActivityLogModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ createdAt: -1 }).populate(["entity", "administrator"]);
          return response.status(200).json({
            data: {
              count: administratorActivityLogs.length,
              totalCount,
              totalNumberOfPages,
              page,
              administratorActivityLogs
            },
            statusCode: 200,
            error: false,
            message: "Success!"
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      },
      deleteAll: async function(request, response) {
        try {
          await models2.administratorActivityLogModel.deleteMany({});
          return response.status(200).json({
            message: "Administrator activity logs deleted successfully!",
            statusCode: 400
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      }
    };
    exports.metrics = metrics;
    exports.create = create;
    exports.findAll = findAll;
    exports.updateOne = updateOne;
    exports.deleteOne = deleteOne;
    exports.findOne = findOne;
    exports.activityLogs = activityLogs;
    exports.single = single;
  }
});

// controllers/class.js
var require_class = __commonJS({
  "controllers/class.js"(exports) {
    var mongoose2 = require("mongoose");
    var Class = require_classModel();
    var Student = require_studentModel();
    var Teacher = require_teacherModel();
    var models2 = require_models();
    exports.getAllClasses = async function(req, res) {
      try {
        const classes = await Class.find({}).populate([
          { path: "students", select: "-image -password" },
          { path: "teachers", select: "-image -password" }
        ]).exec();
        res.status(200).json(classes);
      } catch (err) {
        res.status(404).json({
          error: {
            message: err
          }
        });
      }
    };
    exports.getClass = async function(req, res) {
      try {
        const _class = await Class.findOne({ _id: req.params.classID }).populate([
          { path: "students", select: "-image -password" },
          { path: "teachers", select: "-image -password" }
        ]).exec();
        if (_class) {
          res.status(200).json(_class);
        } else {
          throw "Class does not exist";
        }
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.addClass = async (req, res) => {
      const newClass = await new Class({
        ...req.body
      }).save();
      res.json(newClass);
    };
    exports.assignStudent = async function(req, res) {
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
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.removeStudent = async function(req, res) {
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
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.assignTeacher = async function(req, res) {
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
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.removeTeacher = async function(req, res) {
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
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.getAllSubjects = async function(req, res) {
    };
    exports.addSubject = async function(req, res) {
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
        res.status(200).json({});
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.deleteSubject = async function(req, res) {
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
          res.status(200).json(updatedClass);
          console.log(updatedClass.subjects);
        } else {
          throw "class does not exist!";
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.countAllClasses = async function(callback2) {
      Class.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllClasses = async function(options, callback2) {
      if (options.paginate) {
        Class.find().limit(options.count).skip(options.count * (options.page - 1)).exec((error, classes) => {
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
    exports.findClassByID = async function(ID, callback2) {
      Class.find({ _id: ID }).populate(["students", "teachers"]).exec((error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents[0]);
        }
      });
    };
    exports.findClassByName = async function(name, callback2) {
      Class.find({ name }).populate(["students", "teachers"]).exec((error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents[0]);
        }
      });
    };
    exports.createClass = async function(data, callback2) {
      Class.create({ ...data }).then((document2) => {
        callback2(null, document2);
      }).catch((error) => {
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
      }
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
      }
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
      }
    };
    var metrics = async function(request, response) {
      try {
        let totalNumberOfClasses = 0;
        let totalNumberOfDeletedClasses;
        totalNumberOfClasses = parseInt(
          await models2.classModel.countDocuments({ isDeleted: false })
        );
        totalNumberOfDeletedClasses = parseInt(
          await models2.classModel.countDocuments({ isDeleted: true })
        );
        return response.status(200).json({
          message: "Success!",
          statusCode: 200,
          data: { totalNumberOfDeletedClasses, totalNumberOfClasses }
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findAll = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(await models2.classModel.countDocuments({}));
        totalNumberOfPages = Math.ceil(totalCount / count);
        const classes = await models2.classModel.find({}, {}, { limit: count, skip: (page - 1) * count }).populate(["students", "teachers"]);
        return response.status(200).json({
          data: {
            classes,
            count: classes.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({
          message: "Unable to process this request!",
          statusCode: 400,
          error: false
        });
      }
    };
    exports.metrics = metrics;
    exports.findAll = findAll;
  }
});

// controllers/result.js
var require_result = __commonJS({
  "controllers/result.js"(exports) {
    var models2 = require_models();
    exports.getAllResults = async function(req, res) {
      const results = await models2.resultModel.find({}).populate([
        { path: "class", select: "-image -password" },
        { path: "student", select: "-image -password" }
      ]).exec();
      res.status(200).json(results);
    };
    exports.getResultsByClass = async function(req, res) {
      const classID = req.params.classID;
      const results = await models2.resultModel.find({}).where("class").equals(classID).populate([
        { path: "class", select: "-password" },
        { path: "student", select: "-password" }
      ]).exec();
      res.status(200).json(results);
    };
    exports.getResult = async function(req, res) {
      const result = await models2.resultModel.findById(req.params.id).populate(["class", "student"]);
      res.status(200).json(result);
    };
    exports.addResult = async function(req, res) {
      const studentID2 = req.body.student;
      try {
        const student = models2.studentModel.findById(studentID2);
        if (student) {
          const newResult = await models2.resultModel({
            ...req.body
          });
          await models2.studentModel.updateOne(
            { _id: req.body.student },
            { $push: { results: newResult._id } }
          );
        } else {
          throw "This student does not exist!, Please check the ID and try again";
        }
        res.status(200).json({});
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: {
            message: err
          }
        });
      }
    };
    exports.downloadResult = async function(req, res, next) {
      try {
        const resultID = req.params.resultID;
        const result = await models2.resultModel.findById(resultID).populate(["class", "student"]);
        if (!result) {
          throw "Result not found";
        } else {
          req.body.result = result;
          next();
        }
      } catch (error) {
        console.log(error.message);
        res.status(400).json({
          error: {
            message: error
          }
        });
      }
    };
    exports.countAllResults = function(callback2) {
      models2.resultModel.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllResults = async function(options, callback2) {
      if (options.paginate) {
        models2.resultModel.find({}).populate([
          { path: "class", select: "-image -password" },
          { path: "student", select: "-image -password" }
        ]).limit(options.count).skip(options.count * (options.page - 1)).exec(function(error, results) {
          if (error) {
            console.log(error);
            callback2(error, null);
          } else {
            callback2(null, results);
          }
        });
      } else {
        models2.resultModel.findAll((error, documents) => {
          if (error) {
            callback2(error, null);
          } else {
            callback2(null, documents);
          }
        });
      }
    };
    exports.findResultbyID = async function(ID, callback2) {
      models2.resultModel.findByID(ID, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findResultsByStudentID = async function(studentID2, callback2) {
      models2.resultModel.findResultByStudentID(studentID2, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    var metrics = async function(request, response) {
      try {
        let totalNumberOfResults = 0;
        let totalNumberOfApprovedResults = 0;
        let totalNumberOfUnapprovedResults = 0;
        let totalNumberOfDeletedResults = 0;
        totalNumberOfResults = parseInt(
          await models2.resultModel.countDocuments({ isDeleted: false })
        );
        totalNumberOfApprovedResults = parseInt(
          await models2.resultModel.countDocuments({
            isDeleted: false,
            isApproved: true
          })
        );
        totalNumberOfUnapprovedResults = parseInt(
          await models2.resultModel.countDocuments({
            isDeleted: false,
            isApproved: false
          })
        );
        totalNumberOfDeletedResults = parseInt(
          await models2.resultModel.countDocuments({ isDeleted: true })
        );
        return response.status(200).json({
          message: "Success!",
          statusCode: 200,
          data: {
            totalNumberOfUnapprovedResults,
            totalNumberOfDeletedResults,
            totalNumberOfResults,
            totalNumberOfApprovedResults
          }
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var upload = async function(request, response) {
      console.log("REQUEST BODY FOR RESULT", request.body);
      try {
        const student = await models2.studentModel.findOne({
          _id: request.body.student
        });
        if (!student) {
          return response.status(400).json({ message: "Student not found!", statusCode: 400 });
        }
        const result = await models2.resultModel.create({ ...request.body });
        await models2.studentModel.updateOne(
          { _id: request.body.student },
          { $push: { results: result._id } }
        );
        return response.status(200).json({ message: "Result uploaded successfully!", statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 200 });
      }
    };
    exports.approveResult = async function(resultID, callback2) {
      models2.resultModel.updateOne(
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
    exports.deleteResult = async function(resultID, callback2) {
      models2.resultModel.deleteOne({ _id: resultID }, (error) => {
        if (error) {
          callback2(error);
        } else {
          models2.studentModel.find().where("results").in(resultID).exec((error2, students) => {
            console.log(students);
            if (error2) {
              console.log(error2);
            } else {
              students.forEach((student, index) => {
                models2.studentModel.updateOne(
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
    var search = async function(request, response) {
      try {
        let students = [];
        let results = [];
        if (!request.query.search || request.query.search.trim() === "" || request.query.search.trim().length < 3) {
          return response.status(400).json({
            message: "Search query must 3 or more letters!",
            statusCode: 400
          });
        }
        students = await models2.studentModel.find({
          $or: [
            { firstName: new RegExp(request.query.search, "i") },
            { lastName: new RegExp(request.query.search, "i") },
            { emailAddress: new RegExp(request.query.search, "i") }
          ]
        });
        results = await models2.resultModel.find({
          student: [...students.map((student) => student._id)]
        }).populate(["student", "class"]);
        return response.status(200).json({
          message: `${results.length} results found`,
          statusCode: 400,
          data: { results }
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findAll = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(await models2.resultModel.countDocuments({}));
        totalNumberOfPages = Math.ceil(totalCount / count);
        const results = await models2.resultModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ uploadedAt: -1, isApproved: "asc" }).populate(["class", "student"]);
        return response.status(200).json({
          data: {
            results,
            count: results.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 200 });
      }
    };
    var find = async function(request, response) {
      try {
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(
          await models2.resultModel.countDocuments({ ...request.body })
        );
        totalNumberOfPages = Math.ceil(totalCount / count);
        const results = await models2.resultModel.find({ ...request.body }, {}, { limit: count, skip: (page - 1) * count }).sort({ uploadedAt: -1 }).populate(["class", "student"]);
        return response.status(200).json({
          data: {
            results,
            count: results.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findOne = async function(request, response) {
      try {
        let result;
        result = await models2.resultModel.findOne({ _id: request.query.id }).populate(["class", "student"]);
        if (!result) {
          return response.status(400).json({ message: "Result not found!", statusCode: 400 });
        }
        return response.status(200).json({ message: "Success", data: { result }, statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var updateOne = async function(request, response) {
      try {
        switch (request.query.operation) {
          case "update":
            await models2.resultModel.updateOne(
              { _id: request.body._id },
              { $set: { ...request.body } }
            );
            return response.status(200).json({ message: "Success", statusCode: 200 });
          default:
            return response.status(400).json({ message: "Unknown operation!", statusCode: 400 });
        }
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var deleteOne = async function(request, response) {
      try {
        const result = await models2.resultModel.findOne({ _id: request.query.id });
        if (!result) {
          return response.status(400).json({ message: "Result not found!", statusCode: 400 });
        }
        await models2.resultModel.deleteOne({ _id: request.query.id });
        await models2.studentModel.updateOne(
          { _id: result.student },
          { $pull: { results: request.query.id } }
        );
        return response.status(200).json({ message: "Result deleted successfully!", statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    exports.metrics = metrics;
    exports.search = search;
    exports.findAll = findAll;
    exports.find = find;
    exports.findOne = findOne;
    exports.updateOne = updateOne;
    exports.deleteOne = deleteOne;
    exports.upload = upload;
  }
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
          price: { type: Number, default: 0 }
        }
      ],
      isGrouped: { type: Boolean, default: false },
      groupName: { type: String, default: "" }
    });
    var feeSchema__withoutPriceVariations = new Schema({
      title: { type: String },
      hasPriceVariety: { type: Boolean, default: false },
      price: { type: Number, default: 0 },
      isGrouped: { type: Boolean, default: false },
      groupName: { type: String, default: "" }
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
      FeeModel
    };
  }
});

// controllers/fee.js
var require_fee = __commonJS({
  "controllers/fee.js"(exports) {
    var feeModel = require_feeModel();
    var {
      feeModel__withPriceVariations,
      feeModel__withoutPriceVariations,
      FeeModel
    } = feeModel;
    exports.getAllFees = async function(req, res) {
      const fees = await FeeModel.find({});
      res.status(200).json(fees);
    };
    exports.createFee = async function(req, res) {
      const fee = req.body;
      try {
        if (fee.hasPriceVariety === true) {
          const newFee = await new feeModel__withPriceVariations({
            ...fee
          }).save();
          res.status(200).json(newFee);
        }
        if (fee.hasPriceVariety === false) {
          const newFee = await new feeModel__withoutPriceVariations({
            ...fee
          }).save();
          res.status(200).json(newFee);
        }
      } catch (error) {
      }
    };
    exports.deleteFee = async function(req, res) {
      const feeID = req.params.feeID;
      await FeeModel.deleteOne({ _id: feeID });
      res.status(200).json({});
    };
  }
});

// models/termModel.js
var require_termModel = __commonJS({
  "models/termModel.js"(exports, module2) {
    var { Schema, model } = require("mongoose");
    var termSchema = new Schema(
      {
        name: {
          type: String,
          required: true
        }
      },
      { collection: "term" }
    );
    var Term = model("Term", termSchema);
    module2.exports = Term;
  }
});

// controllers/term.js
var require_term = __commonJS({
  "controllers/term.js"(exports) {
    var Term = require_termModel();
    var models2 = require_models();
    exports.getTerm = async function(req, res) {
      const data = await models2.variableModel.findOne({ key: "term" });
      if (!data) {
        res.status(200).json({ term: "Not Set" });
      } else {
        res.status(200).json({ term: data.value });
      }
    };
    exports.setTerm = async function(req, res) {
      await Term.updateOne({}, { name: req.body.term });
      res.status(200).send({});
    };
  }
});

// models/sessionModel.js
var require_sessionModel = __commonJS({
  "models/sessionModel.js"(exports, module2) {
    var { Schema, model } = require("mongoose");
    var sessionSchema = new Schema(
      {
        name: {
          type: String,
          required: true
        }
      },
      { collection: "session" }
    );
    var Session = model("Sesssion", sessionSchema);
    module2.exports = Session;
  }
});

// controllers/session.js
var require_session = __commonJS({
  "controllers/session.js"(exports) {
    var models2 = require_models();
    var Session = require_sessionModel();
    exports.getSession = async function(req, res) {
      const data = await models2.variableModel.findOne({ key: "session" });
      if (!data) {
        res.status(200).send({ session: "Not Set" });
      } else {
        res.status(200).send({ session: data.value });
      }
    };
    exports.setSession = async function(req, res) {
      await Session.updateOne({}, { name: req.body.session });
      res.status(200).send({});
    };
  }
});

// controllers/teacher.js
var require_teacher = __commonJS({
  "controllers/teacher.js"(exports) {
    var bcrypt = require("bcrypt");
    var mongoose2 = require("mongoose");
    var jsonwebtoken = require("jsonwebtoken");
    var Teacher = require_teacherModel();
    var Class = require_classModel();
    var fs = require("fs");
    var models2 = require_models();
    exports.getAllTeachers = async function(req, res) {
      const teachers = await Teacher.find({}, "-image");
      res.status(200).json(teachers);
    };
    exports.getTeacher = async function(req, res) {
      const teacher = await Teacher.findOne({ _id: req.params.id });
      res.status(200).json(teacher);
    };
    exports.addTeacher = async function(req, res) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newTeacher = await new Teacher({
        ...req.body,
        password: hashedPassword
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
          `${__dirname}/../uploads/images/profile/${newTeacher._id.toString().replace(/\//g, "-")}.jpg`,
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
    exports.login = async function(req, res) {
      try {
        const teacher = await Teacher.findOne({ email: req.body.email }).populate(
          "class"
        );
        if (teacher) {
          const isPasswordMatched = await bcrypt.compare(
            req.body.password,
            teacher.password
          );
          if (isPasswordMatched) {
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
            throw "Invalid Email or Password";
          }
        } else {
          throw "Invalid Email or Password";
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({
          error: {
            message: err
          }
        });
      }
    };
    exports.activate = async function(req, res) {
      const teacherID = req.params.teacherID.replace(/-/g, "/");
      try {
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
            message: error
          }
        });
      }
    };
    exports.deactivate = async function(req, res) {
      const teacherID = req.params.teacherID.replace(/-/g, "/");
      try {
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
            message: error
          }
        });
      }
    };
    exports._delete = async function(req, res) {
      try {
        const teacherID = req.params.teacherID.replace(/-/g, "/");
        await Teacher.findByIdAndDelete(teacherID);
        res.status(200).json({});
      } catch (err) {
        res.status(400).json({
          error: {
            message: err
          }
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
            message: error
          }
        });
      }
    };
    exports.countAllTeachers = async function(callback2) {
      Teacher.countDocuments({}, (error, count) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, count);
        }
      });
    };
    exports.findAllTeachers = async function(options, callback2) {
      Teacher.findAll((error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByID = async function(ID, callback2) {
      Teacher.findByID(ID, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByName = async function(name, callback2) {
      Teacher.findByName(name, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.findTeacherByEmailAddress = async function(email, callback2) {
      Teacher.findByEmailAddress(email, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.createTeacher = async function(data, callback2) {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      Teacher.create({ ...data, password: hashedPassword }).then((document2) => {
        if (data.class && data.class.length > 0) {
          Class.updateOne(
            { _id: data.class },
            { $push: { teachers: document2._id } },
            (error, documents) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        if (data.image) {
          fs.writeFile(
            `${__dirname}/../uploads/images/profile/${document2._id.toString().replace(/\//g, "-")}.jpg`,
            data.image,
            "base64",
            (error) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        callback2(null, document2);
      }).catch((error) => {
        if (error) {
          callback2(error, null);
        }
      });
    };
    exports.updateTeacherByID = async function(ID, update, callback2) {
      Teacher.updateOne({ _id: ID }, { ...update }, (error) => {
        if (error) {
          callback2(error);
        } else {
          callback2(null);
        }
      });
    };
    exports.deleteTeacherByID = async function(ID, callback2) {
      Teacher.deleteOne({ _id: ID }, (error) => {
        if (error) {
          callback2(error);
        } else {
          Class.find().where("teachers").in(ID).exec((error2, classes) => {
            if (error2) {
              console.log(error2);
            } else {
              classes.forEach((_class, index) => {
                Class.updateOne(
                  { _id: _class._id },
                  { $pull: { teachers: ID } },
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
    var metrics = async function(request, response) {
      try {
        let totalNumberOfTeachers = 0;
        let totalNumberOfBannedTeachers = 0;
        let totalNumberOfDeletedTeachers = 0;
        totalNumberOfTeachers = parseInt(
          await models2.teacherModel.countDocuments({ isDeleted: false })
        );
        totalNumberOfBannedTeachers = parseInt(
          await models2.teacherModel.countDocuments({ isBanned: true })
        );
        totalNumberOfDeletedTeachers = parseInt(
          await models2.teacherModel.countDocuments({ isDeleted: true })
        );
        return response.status(200).json({
          message: "Success!",
          statusCode: 200,
          data: {
            totalNumberOfTeachers,
            totalNumberOfBannedTeachers,
            totalNumberOfDeletedTeachers
          }
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findAll = async function(request, response) {
      try {
        let teachers = [];
        let count = parseInt(request.query.count) || 10;
        let page = parseInt(request.query.page) || 1;
        let totalCount = 0;
        let totalNumberOfPages = 1;
        totalCount = parseInt(await models2.teacherModel.countDocuments({}));
        totalNumberOfPages = Math.ceil(totalCount / count);
        teachers = await models2.teacherModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ createdAt: -1 }).populate(["class", "classes"]);
        return response.status(200).json({
          data: {
            teachers,
            count: teachers.length,
            totalCount,
            totalNumberOfPages,
            page
          },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var findOne = async function(request, response) {
      try {
        let teacher;
        teacher = await models2.teacherModel.findOne({ _id: request.query.id }).populate(["class"]);
        if (!teacher) {
          return response.status(400).json({ message: "Teacher not found!", statusCode: 400 });
        }
        return response.status(200).json({ data: { teacher }, message: "Success!", statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var updateOne = async function(request, response) {
      try {
        let teacher;
        teacher = await models2.teacherModel.findOne({ _id: request.query.id });
        if (!teacher) {
          return response.status(400).json({ message: "Teacher not found!", statusCode: 400 });
        }
        switch (request.query.operation) {
          case "update":
            return response.status(200).json({ message: "Teacher updated successfully!", statusCode: 200 });
          case "ban":
            await models2.teacherModel.updateOne(
              { _id: request.query.id },
              { $set: { status: "banned", updatedAt: (/* @__PURE__ */ new Date()).getTime() } }
            );
            return response.status(200).json({ message: "Teacher banned successfully", statusCode: 200 });
          case "unban":
            await models2.teacherModel.updateOne(
              { _id: request.query.id },
              { $set: { status: "active", updatedAt: (/* @__PURE__ */ new Date()).getTime() } }
            );
            return response.status(200).json({ message: "Teacher unbanned successfully", statusCode: 200 });
          case "update_password":
            const salt = await bcrypt.genSalt(3);
            const hashedPassword = await bcrypt.hash(request.body.password, salt);
            await models2.teacherModel.updateOne(
              { _id: request.query.id },
              { $set: { password: hashedPassword } }
            );
            return response.status(200).json({ message: "Password updated successfully!", statusCode: 200 });
          default:
            return response.status(400).json({ message: "Invalid operation!", statusCode: 400 });
        }
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var activityLogs = {
      findAll: async function(request, response) {
        try {
          let teacherActivityLogs = [];
          let count = parseInt(request.query.count) || 10;
          let page = parseInt(request.query.page) || 1;
          let totalCount = 0;
          let totalNumberOfPages = 1;
          totalCount = parseInt(
            await models2.teacherActivityLogModel.countDocuments({})
          );
          totalNumberOfPages = Math.ceil(totalCount / count);
          teacherActivityLogs = await models2.teacherActivityLogModel.find({}, {}, { limit: count, skip: (page - 1) * count }).sort({ createdAt: -1 }).populate(["teacher"]);
          return response.status(200).json({
            data: {
              teacherActivityLogs,
              count: teacherActivityLogs.length,
              totalCount,
              totalNumberOfPages,
              page
            },
            statusCode: 200,
            error: false,
            message: "Success!"
          });
        } catch (error) {
          console.log(error.stack);
          console.log(error.message);
          return response.status(400).json({
            message: "Unable to process this request!",
            error: true,
            statusCode: 400,
            data: null
          });
        }
      },
      deleteAll: async function(request, response) {
        try {
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({
            message: "Unable to process this request!",
            error: true,
            statusCode: 400,
            data: null
          });
        }
      }
    };
    exports.metrics = metrics;
    exports.findAll = findAll;
    exports.findOne = findOne;
    exports.updateOne = updateOne;
    exports.activityLogs = activityLogs;
  }
});

// controllers/auth.controller.js
var require_auth_controller = __commonJS({
  "controllers/auth.controller.js"(exports) {
    var jsonwebtoken = require("jsonwebtoken");
    var bcrypt = require("bcrypt");
    var models2 = require_models();
    var studentController = require_student();
    var teacherController = require_teacher();
    var adminController = require_administrator_controller();
    var { administratorModel } = models2;
    exports.signin_deprecated = {
      student: async function(studentID2, password, callback2) {
        studentController.findStudentByID(studentID2, (error, student) => {
          if (error) {
            callback2(error, null);
          } else {
            if (student) {
              bcrypt.compare(password, student.password).then((match) => {
                if (match) {
                  if (student.status === "banned" || student.status === "disabled") {
                    callback2(
                      "This account has been banned, Please contact the administrator.",
                      null
                    );
                  } else {
                    const accessToken = jsonwebtoken.sign(
                      { id: student.id, role: "student" },
                      process.env.TOKEN_SECRET
                    );
                    callback2(null, {
                      accessToken,
                      ...student._doc
                    });
                  }
                } else {
                  callback2("Password and StudentID do not match", null);
                }
              }).catch((error2) => {
                callback2(error2, null);
              });
            } else {
              callback2("Invalid student ID", null);
            }
          }
        });
      },
      teacher: async function(email, password, callback2) {
        teacherController.findTeacherByEmailAddress(email, (error, teacher) => {
          if (error) {
            callback2(error, null);
          } else {
            bcrypt.compare(password, teacher.password).then((match) => {
              if (match) {
                if (teacher.status === "banned" || teacher.status === "disabled") {
                  callback2(
                    "This account has been banned, Please contact the administrator.",
                    null
                  );
                } else {
                  const accessToken = jsonwebtoken.sign(
                    {
                      id: teacher._id,
                      role: teacher.role
                    },
                    process.env.TOKEN_SECRET
                  );
                  teacherController.updateTeacherByID(
                    teacher._id,
                    {
                      $set: { lastSeen: (/* @__PURE__ */ new Date()).getTime() }
                    },
                    (error2) => {
                      if (error2) {
                        callback2(error2, null);
                      } else {
                        callback2(null, {
                          accessToken,
                          ...teacher._doc
                        });
                      }
                    }
                  );
                }
              } else {
                callback2("Invalid email address or password", null);
              }
            }).catch((error2) => {
              callback2(error2, null);
            });
          }
        });
      }
    };
    exports.verifyAccessToken = async function(accessToken, callback2) {
      jsonwebtoken.verify(accessToken, process.env.TOKEN_SECRET, (error, data) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, data);
        }
      });
    };
    var signIn = {
      administrator: async function(request, response) {
        try {
          let administrator;
          administrator = await administratorModel.findOne({
            email: request.body.emailAddress.toLowerCase(),
            isDeleted: false
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
              data: null
            });
          }
          if (administrator.isBanned === true) {
            return response.status(400).json({
              message: `This account has been banned!, Please contact the administrator.`,
              statusCode: 400,
              error: true,
              data: null
            });
          }
          await administratorModel.updateOne(
            { _id: administrator._id },
            {
              $set: { lastSeen: (/* @__PURE__ */ new Date()).getTime() }
            }
          );
          await models2.administratorActivityLogModel.create({
            administrator: administrator._id,
            entity: administrator._id,
            type: "sign_in"
          });
          const accessToken = jsonwebtoken.sign(
            { id: administrator._id, role: administrator.role },
            process.env.TOKEN_SECRET
          );
          await models2.sessionModel.create({
            administrator: administrator._id,
            accessToken
          });
          return response.status(200).json({
            message: "Success!",
            error: false,
            statusCode: 200,
            data: {
              administrator: administrator.toJSON(),
              accessToken
            }
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).send("Unable to process this request!");
        }
      },
      teacher: async function(request, response) {
        try {
          const teacher = await models2.teacherModel.findOne({
            email: request.body.emailAddress,
            isDeleted: false
          }).populate(["class", "classes"]);
          if (!teacher) {
            return response.status(400).json({
              message: "Invalid email address!",
              statusCode: 400,
              error: true,
              data: null
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
              data: null
            });
          }
          if (teacher.isBanned === true) {
            return response.status(400).json({
              message: `This account has been banned!, Please contact the administrator.`,
              statusCode: 400,
              error: true,
              data: null
            });
          }
          await models2.teacherActivityLogModel.create({
            teacher: teacher._id,
            type: "sign_in"
          });
          const accessToken = jsonwebtoken.sign(
            { id: teacher._id, role: teacher.role },
            process.env.TOKEN_SECRET
          );
          await models2.sessionModel.create({
            teacher: teacher._id,
            accessToken
          });
          return response.status(200).json({
            message: "Success!",
            statusCode: 200,
            error: false,
            data: {
              teacher: teacher.toJSON(),
              accessToken
            }
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({
            message: "Unable to process this request!",
            error: true,
            statusCode: 400,
            data: null
          });
        }
      },
      student: async function(request, response) {
        try {
          const student = await models2.studentModel.findOne({
            _id: request.body.id,
            isDeleted: false
          }).populate(["results", "class"]);
          if (!student) {
            return response.status(400).json({
              message: "Invalid id!",
              statusCode: 400,
              error: true,
              data: null
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
              data: null
            });
          }
          if (student.isBanned === true) {
            return response.status(400).json({
              message: `This account has been banned!, Please contact the administrator.`,
              statusCode: 400,
              error: true,
              data: null
            });
          }
          await models2.studentActivityLogModel.create({
            student: student._id,
            type: "sign_in"
          });
          const accessToken = jsonwebtoken.sign(
            { id: student._id, role: student.role },
            process.env.TOKEN_SECRET
          );
          await models2.sessionModel.create({
            student: student._id,
            accessToken
          });
          return response.status(200).json({
            message: "Success",
            error: false,
            statusCode: 400,
            data: {
              student: student.toJSON(),
              accessToken
            }
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({
            message: "Unable to process this request!",
            error: false,
            statusCode: 400,
            data: null
          });
        }
      }
    };
    var signOut = {
      administrator: async function(request, response) {
        try {
          const session = await models2.sessionModel.findOne({
            accessToken: request.header("Authorization").substring(7, request.header("Authorization").length)
          });
          if (!session) {
            return response.status(400).json({
              message: "Invalid session!",
              statusCode: 400,
              error: true,
              data: null
            });
          }
          await models2.sessionModel.deleteOne({ _id: session._id });
          await models2.administratorActivityLogModel.create({
            administrator: request.administrator._id,
            entity: request.administrator._id,
            type: "sign_out"
          });
          return response.status(200).json({
            message: "Session ended successfully!",
            statusCode: 400,
            error: false,
            data: null
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
        }
      }
    };
    exports.signIn = signIn;
    exports.signOut = signOut;
  }
});

// controllers/announcement.js
var require_announcement2 = __commonJS({
  "controllers/announcement.js"(exports) {
    var models2 = require_models();
    var classController = require_class();
    var { announcementModel } = models2;
    exports.findAllAnnouncements = async function(callback2) {
      announcementModel().findAll({}, (error, documents) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, documents);
        }
      });
    };
    exports.findAnnouncements = async function(options, callback2) {
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
    exports.createAnnouncement = async function(data, options, callback2) {
      announcementModel({ ...options }).create({ ...data }).then((document2) => {
        callback2(null, document2);
      }).catch((error) => {
        callback2(error, null);
      });
    };
    exports.findAnnouncementByID = async function(announcementID, callback2) {
      announcementModel().findByID(announcementID, (error, document2) => {
        if (error) {
          callback2(error, null);
        } else {
          callback2(null, document2);
        }
      });
    };
    exports.deleteAnnouncementByID = async function(announcementID, callback2) {
      announcementModel().deleteOne({ _id: announcementID }, (error) => {
        if (error) {
          callback2(error.message);
        } else {
          callback2(null);
        }
      });
    };
    exports.updateAnnouncementByID = async function(announcementID, options, callback2) {
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
  }
});

// controllers/variable.controller.js
var require_variable_controller = __commonJS({
  "controllers/variable.controller.js"(exports) {
    var models2 = require_models();
    var get = async function(request, response) {
      try {
        let variable;
        if (!request.query.key) {
          return response.status(400).json({ message: "Missing query parameter: Key!", statusCode: 400 });
        }
        variable = await models2.variableModel.findOne({
          key: request.query.key
        });
        if (!variable) {
          variable = {
            key: request.query.key,
            value: "n/a"
          };
        }
        return response.status(200).json({ message: "Success!", statusCode: 200, data: { variable } });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    var set = async function(request, response) {
      try {
        let variable;
        if (!request.query.key) {
          return response.status(400).json({ message: "Missing query parameter: Key!", statusCode: 400 });
        }
        if (!request.body.value) {
          return response.status(400).json({ message: "Missing query parameter: Value!", statusCode: 400 });
        }
        variable = await models2.variableModel.findOne({
          key: request.query.key
        });
        if (!variable) {
          await models2.variableModel.create({
            key: request.query.key,
            value: request.body.value
          });
        } else {
          await models2.variableModel.updateOne(
            {
              key: request.query.key
            },
            { $set: { value: request.body.value } }
          );
        }
        return response.status(200).json({ message: "Success!", statusCode: 200 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to process this request!", statusCode: 400 });
      }
    };
    exports.get = get;
    exports.set = set;
  }
});

// controllers/conversation.controller.js
var require_conversation_controller = __commonJS({
  "controllers/conversation.controller.js"(exports) {
    var models2 = require_models();
    var { compileETag } = require("express/lib/utils");
    var create = async function(request, response) {
      try {
        const conversation = await models2.conversation.create({
          ...request.body
        });
        for (const member of request.body.members) {
          if (member.role === "administrator") {
            await models2.administratorModel.updateOne(
              { _id: member.id },
              { $push: { conversations: conversation._id } }
            );
          }
        }
        return response.status(200).json({
          message: "Success!",
          error: false,
          data: { conversation },
          statusCode: 200
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({
          message: "Unable to process this request!",
          error: true,
          data: null,
          statusCode: 400
        });
      }
    };
    var single = {
      find: async function(request, response) {
        try {
          const conversation = await models2.conversation.findOne({
            _id: request.params.conversation_id
          });
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(200).json({
            message: "Unable to process this request",
            error: true,
            data: null,
            statusCode: 400
          });
        }
      }
    };
    exports.create = create;
    exports.single = single;
  }
});

// controllers/index.js
var require_controllers = __commonJS({
  "controllers/index.js"(exports, module2) {
    var invoiceController = require_invoice();
    var notificationController = require_notification2();
    var administratorController = require_administrator_controller();
    var studentController = require_student();
    var classController = require_class();
    var resultController = require_result();
    var feeController = require_fee();
    var termController = require_term();
    var sessionController = require_session();
    var teacherController = require_teacher();
    var authController = require_auth_controller();
    var announcementController = require_announcement2();
    var variableController = require_variable_controller();
    var conversation = require_conversation_controller();
    var student = require_student();
    module2.exports = {
      invoiceController,
      notificationController,
      administratorController,
      studentController,
      classController,
      resultController,
      feeController,
      termController,
      sessionController,
      teacherController,
      authController,
      announcementController,
      variableController,
      conversation,
      student
    };
  }
});

// middlewares/verifyAccessToken.js
var require_verifyAccessToken = __commonJS({
  "middlewares/verifyAccessToken.js"(exports, module2) {
    var jwt = require("jsonwebtoken");
    var models2 = require_models();
    module2.exports = async (request, response, next) => {
      let token;
      if (request.header("Authorization")?.startsWith("Bearer ")) {
        token = request.header("Authorization").substring(7, request.header("Authorization").length);
      } else {
        return response.status(401).json({ message: "Invalid authorization header!", statusCode: 401 });
      }
      if (!token) {
        return response.status(401).json({ message: "Invalid authorization header!", statusCode: 401 });
      }
      try {
        const { role, id } = jwt.verify(token, process.env.TOKEN_SECRET);
        request.payload = {
          ...request.payload,
          id,
          role
        };
        if (role === "administrator" || role === "admin") {
          const administrator = await models2.administratorModel.findOne({
            _id: id,
            isDeleted: false
          });
          if (!administrator) {
            return response.status(401).json({ message: "Invalid Token", error: true, statusCode: 401 });
          }
          request.administrator = administrator;
          return next();
        }
        return response.status(401).json({ message: "Access denied, unknown role", statusCode: 401 });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(401).json({ message: error.message, statusCode: 401 });
      }
      return null;
    };
  }
});

// middlewares/generateStudentID.js
var require_generateStudentID = __commonJS({
  "middlewares/generateStudentID.js"(exports, module2) {
    var uuid = require("uuid");
    function generateStudentID(req, res, next) {
      const studentID2 = `pbs/${(/* @__PURE__ */ new Date()).getFullYear()}/${uuid.v4().split("-")[0]}`;
      req.body._id = studentID2;
      next();
    }
    module2.exports = generateStudentID;
  }
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
          grade = rangeCompare(90, 100, score) && "A+" || rangeCompare(80, 89, score) && "A" || rangeCompare(75, 79, score) && "B+" || rangeCompare(65, 74, score) && "B" || rangeCompare(60, 64, score) && "C+" || rangeCompare(50, 59, score) && "C" || rangeCompare(40, 49, score) && "D" || rangeCompare(0, 39, score) && "F";
          break;
        case "pbs":
          grade = rangeCompare(95, 100, score) && "A+" || rangeCompare(90, 94, score) && "A" || rangeCompare(85, 89, score) && "A-" || rangeCompare(80, 84, score) && "B+" || rangeCompare(75, 79, score) && "B" || rangeCompare(70, 74, score) && "B-" || rangeCompare(65, 69, score) && "C+" || rangeCompare(60, 64, score) && "C" || rangeCompare(56, 59, score) && "C-" || rangeCompare(50, 55, score) && "D" || rangeCompare(40, 49, score) && "E" || rangeCompare(30, 39, score) && "F" || rangeCompare(0, 29, score) && "U";
          break;
        case "prc":
          grade = rangeCompare(95, 100, score) && "A+" || rangeCompare(90, 94, score) && "A" || rangeCompare(85, 89, score) && "A-" || rangeCompare(80, 84, score) && "B+" || rangeCompare(75, 79, score) && "B" || rangeCompare(70, 74, score) && "B-" || rangeCompare(65, 69, score) && "C+" || rangeCompare(60, 64, score) && "C" || rangeCompare(56, 59, score) && "C-" || rangeCompare(50, 55, score) && "D" || rangeCompare(40, 49, score) && "E" || rangeCompare(30, 39, score) && "F" || rangeCompare(0, 29, score) && "U";
          break;
        case "igcse":
          grade = rangeCompare(90, 100, score) && "A*" || rangeCompare(80, 89, score) && "A" || rangeCompare(70, 79, score) && "B" || rangeCompare(60, 69, score) && "C" || rangeCompare(50, 59, score) && "D" || rangeCompare(40, 49, score) && "E" || rangeCompare(30, 39, score) && "F" || rangeCompare(20, 29, score) && "G" || rangeCompare(0, 19, score) && "U";
          break;
        case "waec":
          grade = rangeCompare(80, 100, score) && "A1" || rangeCompare(75, 79, score) && "B2" || rangeCompare(70, 74, score) && "B3" || rangeCompare(60, 69, score) && "C4" || rangeCompare(56, 59, score) && "C5" || rangeCompare(50, 55, score) && "C6" || rangeCompare(45, 49, score) && "D7" || rangeCompare(40, 44, score) && "E8" || rangeCompare(0, 39, score) && "F9";
          break;
        case "aslevel":
          grade = rangeCompare(80, 100, score) && "a" || rangeCompare(70, 79, score) && "b" || rangeCompare(60, 69, score) && "c" || rangeCompare(50, 59, score) && "d" || rangeCompare(40, 49, score) && "e" || rangeCompare(0, 39, score) && "u";
          break;
        default:
          break;
      }
      return grade;
    }
    var average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    function computeGrade(req, res, next) {
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
              )
            });
          }
          if (req.body.type === "endOfTerm") {
            console.log(req.body);
            item.push({
              value: average([
                parseInt(item[item.length - 1].value),
                parseInt(item[item.length - 2].value)
              ])
            });
            scores.push(parseInt(item[item.length - 1].value));
            console.log(item[item.length - 1]);
            item.push({
              value: getGrade(
                req.body.gradingScale,
                parseInt(item[item.length - 1].value)
              )
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
  }
});

// middlewares/generateResultPDF.js
var require_generateResultPDF = __commonJS({
  "middlewares/generateResultPDF.js"(exports, module2) {
    var pdfKit = require("pdfkit");
    var fs = require("fs");
    function generateResultPDF(req, res, next) {
      let result = req.body.result;
      const doc = new pdfKit({ size: "A4" });
      doc.roundedRect(30, 30, 535.28, 781.89, 50).stroke();
      doc.image("static/images/logos/logo.png", 50, 50, { width: 50 });
      doc.image("static/images/logos/logo.png", 495, 50, { width: 50 });
      doc.font("Times-Roman").fontSize(25).text(`${result.school.toUpperCase()}`, {
        bold: true,
        align: "center"
      }).moveDown(0.5);
      doc.fontSize(11).text(`${result.title.toUpperCase()}`, {
        bold: true,
        align: "center"
      }).moveDown();
      doc.fontSize(13).text(`${result.class.name.toUpperCase()}`, {
        bold: true
      }).moveDown();
      doc.lineCap("round").lineWidth(2).moveTo(50, 165).lineTo(545.28, 165).stroke();
      doc.lineCap("round").lineWidth(2).moveTo(50, 205).lineTo(545.28, 205).stroke();
      doc.text("Candidate Name", 70, 175).text("Session", 230, 175).text("Overall Percentage", 320, 175).text("Grade", 470, 175);
      doc.fontSize(9).text(
        `${result.student.firstName.toUpperCase()} ${result.student.lastName.toUpperCase()}`,
        70,
        190
      ).text(result.session, 230, 190).text(`${result.overallPercentage}%`, 320, 190).text(result.overallGrade, 470, 190);
      const scoreSheet = JSON.parse(result.scoreSheet);
      let col = 70;
      let row = 230;
      scoreSheet.shift();
      if (result.type === "midTerm") {
        doc.text("SYLLABUS TITLE", 70, 215).text("SCORE", 320, 215).text("GRADE", 470, 215);
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
            doc.text(item2.value.toString().toUpperCase(), col, row, { bold: true });
            col += 100;
          });
          row += 15;
        });
      }
      if (result.type === "endOfTerm") {
        doc.fontSize(9).text("SYLLABUS TITLE", 70, 215).text("TEST", 300, 215).text("EXAM", 340, 215).text("AVG. PERCENTAGE", 390, 215).text("GRADE", 490, 215);
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
            doc.text(item2.value.toString().toUpperCase(), col, row, { bold: true });
            col += 100;
          });
          row += 15;
        });
      }
      row += 10;
      doc.lineWidth(1).fontSize(11).text("ELECTIVES", 70, row).lineCap("round").lineWidth(1).moveTo(50, row + 15).lineTo(545.28, row + 15).stroke();
      row += 25;
      if (result.electives.length === 0) {
        doc.fontSize(11).text("No electives to show", 70, row);
        row += 15;
      } else {
        result.electives.forEach((elective, index) => {
          doc.fontSize(11).text(elective.title, 73, row + 2);
          doc.fontSize(11).text(elective.grade, 300, row + 2);
          row += 20;
        });
      }
      row += 10;
      let testRow0 = row;
      testRow0 += 50;
      result.teachersRemark.split("\n").forEach((p, index) => {
        testRow0 += Math.ceil(p.length / 110) * 15;
        testRow0 += 5;
      });
      if (testRow0 > 770) {
        doc.addPage();
        row = 50;
      }
      doc.fontSize(11).text("CLASS TEACHER'S REMARK", 70, row, { width: 300 }).lineCap("round").lineWidth(1).moveTo(50, row + 15).lineTo(545.28, row + 15).stroke();
      row += 20;
      result.teachersRemark.split("\n").forEach((p, index) => {
        doc.fontSize(11).text(p, 70, row);
        row += Math.ceil(p.length / 110) * 15;
        row += 5;
      });
      row += 20;
      let testRow1 = row;
      testRow1 += 50;
      result.comments.split("\n").forEach((p, index) => {
        testRow1 += Math.ceil(p.length / 110) * 15;
        testRow1 += 5;
      });
      if (testRow1 > 770) {
        doc.addPage();
        row = 50;
      }
      doc.fontSize(11).text("EXTRA CURRICULAR ACTIVITIES", 70, row, { width: 300 }).lineCap("round").lineWidth(1).moveTo(50, row + 15).lineTo(545.28, row + 15).stroke();
      row += 25;
      result.comments.split("\n").forEach((p, index) => {
        doc.fontSize(11).text(p, 70, row);
        row += Math.ceil(p.length / 110) * 15;
        row += 5;
      });
      row += 20;
      let testRow = row;
      testRow += 50;
      result.principalsRemark.split("\n").forEach((p, index) => {
        testRow += Math.ceil(p.length / 110) * 15;
        testRow += 5;
      });
      if (testRow > 770) {
        doc.addPage();
        row = 50;
      }
      doc.text("PRINCIPAL'S REMARK AND SIGNATURE", 70, row, { bold: true }).lineCap("round").lineWidth(1).moveTo(50, row + 15).lineTo(545.28, row + 15).stroke();
      row += 25;
      result.principalsRemark.split("\n").forEach((p, index) => {
        doc.fontSize(11).text(p, 70, row);
        row += Math.ceil(p.length / 110) * 15;
        row += 5;
      });
      row += 20;
      if (result.isApproved) {
        doc.font("Helvetica-BoldOblique").fontSize(13).text("AMA", 480, row, { bold: true });
      }
      doc.end();
      res.setHeader("Content-Disposition", "attachment; result.pdf");
      doc.pipe(res);
    }
    module2.exports = generateResultPDF;
  }
});

// middlewares/verifySession.js
var require_verifySession = __commonJS({
  "middlewares/verifySession.js"(exports, module2) {
    var models2 = require_models();
    module2.exports = async function(request, response, next) {
      try {
        let session;
        session = await models2.sessionModel.findOne({
          accessToken: request.header("Authorization").substring(7, request.header("Authorization").length)
        });
        if (!session) {
          return response.status(400).json({
            message: "No session! Please sign in again!",
            statusCode: 400
          });
        }
        next();
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({ message: "Unable to verify session!", statusCode: 400 });
      }
    };
  }
});

// middlewares/index.js
var require_middlewares = __commonJS({
  "middlewares/index.js"(exports, module2) {
    var verifyAccessToken = require_verifyAccessToken();
    var generateStudentID = require_generateStudentID();
    var aggregateScores = require_aggregateScores();
    var generateResultPDF = require_generateResultPDF();
    var verifySession = require_verifySession();
    module2.exports = {
      verifyAccessToken,
      generateStudentID,
      aggregateScores,
      generateResultPDF,
      verifySession
    };
  }
});

// routers/student.router.js
var require_student_router = __commonJS({
  "routers/student.router.js"(exports, module2) {
    var router = require("express").Router();
    var multer2 = require("multer");
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var models2 = require_models();
    var { studentController } = controllers;
    var { generateStudentID } = middlewares;
    router.param("student_id", async (request, response, next) => {
      try {
        const student = await models2.student.findOne({
          _id: request.params.student_id.replaceAll("-", "/")
        });
        if (!student) {
          return response.status(400).json({
            message: "Student not found!",
            error: true,
            data: null,
            statusCode: 400
          });
        }
        request.payload = { ...request.payload, student };
        next();
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({
          message: "Unable to process this request!",
          error: true,
          data: null,
          statusCode: 400
        });
      }
    });
    router.get("/metrics", controllers.studentController.metrics);
    router.get("/count-all", (request, response) => {
      studentController.countAllStudents((error, count) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).send(count.toString());
        }
      });
    });
    router.post("/find", controllers.studentController.find);
    router.get("/find-all", controllers.studentController.findAll);
    router.get("/find-one", controllers.studentController.findOne);
    router.post("/update-one", controllers.studentController.updateOne);
    router.get("/search", controllers.studentController.search);
    router.get(
      "/activity-logs/find-all",
      controllers.studentController.activityLogs.findAll
    );
    router.get("/find-one-deprecated", (request, response) => {
      if (request.query.by) {
        switch (request.query.by) {
          case "ID":
            studentController.findStudentByID(
              request.query.ID.replaceAll("-", "/"),
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
    router.get(
      "/:student_id/results/find",
      controllers.student.single.results.find
    );
    router.get("/:studentID/results-deprecated", (request, response) => {
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
        (error, notifications) => {
        }
      );
    });
    router.get("/:studentID/notifications", studentController.getAllNotifications);
    router.post("/:studentID/profile/edit", studentController.editProfile);
    router.get("/activate/:studentID", studentController.activate);
    router.get("/deactivate/:studentID", studentController.deactivate);
    router.get("/delete/:studentID", studentController._delete);
    module2.exports = router;
  }
});

// routers/teacher.router.js
var require_teacher_router = __commonJS({
  "routers/teacher.router.js"(exports, module2) {
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
    router.get("/find-all-deprecated", (request, response) => {
      teacherController.findAllTeachers({}, (error, teachers) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(teachers);
        }
      });
    });
    router.get("/find-one-deprecated", (request, response) => {
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
              response.status(400).send("Teacher with this e-mail address already exists!");
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
                    teacherController.deleteTeacherByID(teacher._id, (error2) => {
                      if (error2) {
                        response.status(400).send(error2);
                      } else {
                        response.status(200).end();
                      }
                    });
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
    router.get("/metrics", controllers.teacherController.metrics);
    router.get("/find-all", controllers.teacherController.findAll);
    router.get("/find-one", controllers.teacherController.findOne);
    router.post("/update-one", controllers.teacherController.updateOne);
    router.get(
      "/activity-logs/find-all",
      controllers.teacherController.activityLogs.findAll
    );
    router.get(
      "/activity-logs/delete-all",
      controllers.teacherController.activityLogs.deleteAll
    );
    router.get("/:id", teacherController.getTeacher);
    module2.exports = router;
  }
});

// routers/class.router.js
var require_class_router = __commonJS({
  "routers/class.router.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var { classController } = controllers;
    router.get("/metrics", controllers.classController.metrics);
    router.get("/find-all", controllers.classController.findAll);
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
    router.get("/find-all-deprecated", (request, response) => {
      classController.findAllClasses(
        {
          paginate: request.query.paginate === "true" ? true : false,
          count: request.query.count ? parseInt(request.query.count) : 10,
          page: request.query.page ? parseInt(request.query.page) : 1
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
            classController.findClassByName(request.query.name, (error, _class) => {
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
  }
});

// routers/result.router.js
var require_result_router = __commonJS({
  "routers/result.router.js"(exports, module2) {
    var router = require("express").Router();
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var { resultController } = controllers;
    var { aggregateScores, generateResultPDF } = middlewares;
    router.get("/metrics", controllers.resultController.metrics);
    router.get("/search", controllers.resultController.search);
    router.post(
      "/upload",
      middlewares.aggregateScores,
      controllers.resultController.upload
    );
    router.get("/find-all", controllers.resultController.findAll);
    router.post("/find", controllers.resultController.find);
    router.get("/find-one", controllers.resultController.findOne);
    router.get("/delete-one", controllers.resultController.deleteOne);
    router.post(
      "/update-one",
      middlewares.aggregateScores,
      controllers.resultController.updateOne
    );
    router.get("/", resultController.getAllResults);
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
    router.get("/:id", resultController.getResult);
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
  }
});

// middlewares/imageUpload.js
var require_imageUpload = __commonJS({
  "middlewares/imageUpload.js"(exports, module2) {
    var multer2 = require("multer");
    var storage = multer2.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./");
      },
      filename: function(req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `uploads/${req.body.fileName}.jpeg`);
      }
    });
    var upload = multer2({
      storage
    });
    module2.exports = upload;
  }
});

// routers/image.js
var require_image = __commonJS({
  "routers/image.js"(exports, module2) {
    var router = require("express").Router();
    var multer2 = require("multer");
    var imageUpload = require_imageUpload();
    router.post("/upload", imageUpload.single("image"), (req, res) => {
      try {
        console.log(req.body);
      } catch (err) {
        res.status(400).send(err);
      }
    });
    module2.exports = router;
  }
});

// routers/administrator.router.js
var require_administrator_router = __commonJS({
  "routers/administrator.router.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var models2 = require_models();
    var { Router } = express2;
    var administratorRouter = Router();
    administratorRouter.get(
      "/metrics",
      middlewares.verifyAccessToken,
      middlewares.verifySession,
      controllers.administratorController.metrics
    );
    administratorRouter.get(
      "/find-all",
      middlewares.verifyAccessToken,
      middlewares.verifySession,
      controllers.administratorController.findAll
    );
    administratorRouter.post(
      "/create",
      middlewares.verifyAccessToken,
      middlewares.verifySession,
      controllers.administratorController.create
    );
    administratorRouter.get(
      "/find-one",
      middlewares.verifyAccessToken,
      controllers.administratorController.findOne
    );
    administratorRouter.post(
      "/update-one",
      controllers.administratorController.updateOne
    );
    administratorRouter.get(
      "/delete-one",
      controllers.administratorController.deleteOne
    );
    administratorRouter.all(
      "/:administrator_id/find",
      controllers.administratorController.single.find
    );
    administratorRouter.all(
      "/:administrator_id/update",
      controllers.administratorController.single.update
    );
    administratorRouter.all(
      "/:administrator_id/ban",
      controllers.administratorController.single.ban
    );
    administratorRouter.all(
      "/:administrator_id/unban",
      controllers.administratorController.single.unban
    );
    administratorRouter.all(
      "/:administrator_id/delete",
      controllers.administratorController.single.delete
    );
    administratorRouter.all(
      "/activity-logs/find-all",
      middlewares.verifyAccessToken,
      middlewares.verifySession,
      controllers.administratorController.activityLogs.findAll
    );
    administratorRouter.all(
      "/activity-logs/delete-all",
      controllers.administratorController.activityLogs.deleteAll
    );
    administratorRouter.param(
      "administrator_id",
      async function(request, response, next, id) {
        try {
          const administrator = await models2.administratorModel.findOne({
            _id: id,
            isDeleted: false
          });
          if (!administrator) {
            return response.status(400).json({
              message: "Administrator not found!",
              error: true,
              statusCode: 400
            });
          }
          request.payload = { ...request.payload };
          request.payload.administrator = administrator;
          next();
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
          return response.status(400).json({
            message: "Unable to process this request!",
            statusCode: 400,
            error: true
          });
        }
      }
    );
    module2.exports = administratorRouter;
  }
});

// routers/term.js
var require_term2 = __commonJS({
  "routers/term.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var { termController } = controllers;
    var { Router } = express2;
    var router = Router();
    router.get("/", termController.getTerm);
    router.post("/set-deprecated", termController.setTerm);
    module2.exports = router;
  }
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
  }
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
      create
    } = invoiceController;
    var invoiceRouter2 = Router();
    invoiceRouter2.get("/find-all", (request, response) => {
      invoiceController.findAllInvoices(
        {
          paginate: request.query.paginate === "true" ? true : false
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
          invoiceController.findInvoiceByID(request.query.ID, (error, invoice) => {
            if (error) {
              response.status(400).send(error);
            } else {
              if (invoice) {
                response.status(200).json(invoice);
              } else {
                response.status(400).send("Invoice not found!");
              }
            }
          });
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
      invoiceController.templates.createInvoice({ ...request.body }, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    invoiceRouter2.get("/templates/:ID/update", (request, response) => {
      invoiceController.templates.updateInvoiceByID(request.params.ID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    invoiceRouter2.get("/templates/:ID/delete", (request, response) => {
      invoiceController.templates.deleteInvoiceByID(request.params.ID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
    });
    module2.exports = invoiceRouter2;
  }
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
  }
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
  }
});

// routers/auth.router.js
var require_auth_router = __commonJS({
  "routers/auth.router.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var middlewares = require_middlewares();
    var { Router } = express2;
    var { authController } = controllers;
    var authRouter2 = Router();
    authRouter2.post("/sign-in/student-deprecated", (request, response) => {
      authController.signin_deprecated.student(
        request.body.studentID || "",
        request.body.password || "",
        (error, accessToken) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).send(accessToken);
          }
        }
      );
    });
    authRouter2.post("/sign-in/teacher-deprecated", (request, response) => {
      authController.signin_deprecated.teacher(
        request.body.email,
        request.body.password,
        (error, data) => {
          if (error) {
            response.status(400).send(error);
          } else {
            response.status(200).json(data);
          }
        }
      );
    });
    authRouter2.get("/verify-access-token", (request, response) => {
      authController.verifyAccessToken(request.query.accessToken, (error, data) => {
        if (error) {
          response.status(400).send(error.message);
        } else {
          response.status(200).json(data);
        }
      });
    });
    authRouter2.post("/sign-in/admin", authController.signIn.administrator);
    authRouter2.post(
      "/sign-in/administrator",
      controllers.authController.signIn.administrator
    );
    authRouter2.post("/sign-in/teacher", controllers.authController.signIn.teacher);
    authRouter2.post(
      "/sign-in/student",
      controllers.authController.signIn.student
    );
    authRouter2.post(
      "/sign-out/administrator",
      middlewares.verifyAccessToken,
      controllers.authController.signOut.administrator
    );
    module2.exports = authRouter2;
  }
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
          visibility: request.body.visibility || "all"
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
          visibility: request.body.visibility || "general"
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
      announcementController.deleteAnnouncementByID(request.query.ID, (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      });
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
  }
});

// routers/variable.router.js
var require_variable_router = __commonJS({
  "routers/variable.router.js"(exports, module2) {
    var express2 = require("express");
    var router = express2.Router();
    var controllers = require_controllers();
    router.get("/get", controllers.variableController.get);
    router.all("/set", controllers.variableController.set);
    module2.exports = router;
  }
});

// routers/conversation.router.js
var require_conversation_router = __commonJS({
  "routers/conversation.router.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers();
    var router = express2.Router();
    router.post("/create", controllers.conversation.create);
    router.get("/:conversation_id/find", controllers.conversation.single.find);
    module2.exports = router;
  }
});

// routers/index.js
var require_routers = __commonJS({
  "routers/index.js"(exports, module2) {
    var studentRouter2 = require_student_router();
    var teacherRouter2 = require_teacher_router();
    var classRouter2 = require_class_router();
    var resultRouter2 = require_result_router();
    var imageRouter2 = require_image();
    var administratorRouter = require_administrator_router();
    var termRouter2 = require_term2();
    var sessionRouter2 = require_session2();
    var invoiceRouter2 = require_invoice2();
    var feeRouter2 = require_fee2();
    var notificationRouter2 = require_notification3();
    var authRouter2 = require_auth_router();
    var announcementRouter2 = require_announcement3();
    var variableRouter = require_variable_router();
    var conversation = require_conversation_router();
    module2.exports = {
      studentRouter: studentRouter2,
      teacherRouter: teacherRouter2,
      classRouter: classRouter2,
      resultRouter: resultRouter2,
      imageRouter: imageRouter2,
      administratorRouter,
      termRouter: termRouter2,
      sessionRouter: sessionRouter2,
      invoiceRouter: invoiceRouter2,
      feeRouter: feeRouter2,
      notificationRouter: notificationRouter2,
      authRouter: authRouter2,
      announcementRouter: announcementRouter2,
      variableRouter,
      conversation
    };
  }
});

// v2/controllers/students.controller.js
var require_students_controller = __commonJS({
  "v2/controllers/students.controller.js"(exports, module2) {
    var speakeasy = require("speakeasy");
    var models2 = require_models();
    var controller = {
      single: {
        authorize: async function(request, response) {
          try {
            let student;
            student = await models2.student.findOne({
              _id: request.params.id.replaceAll("-", "/")
            });
            if (!student) {
              return response.status(400).json({
                message: "Student not found",
                error: true,
                data: null,
                statusCode: 400
              });
            }
            if (request.query.pin !== student.pin) {
              return response.status(400).json({
                message: "Pin mismatch",
                error: true,
                data: null,
                statusCode: 400
              });
            }
            return response.status(200).json({
              message: "Success",
              error: false,
              data: null,
              statusCode: 200
            });
          } catch (error) {
            console.log(error.message);
            console.log(error.stack);
            return response.status(400).json({
              message: "Unable to process this request"
            });
          }
        }
      },
      pins: {
        scramble: async function(request, response) {
          try {
            response.status(200).json({
              message: "Success",
              error: false,
              data: null,
              statusCode: 200
            });
            try {
              let students = await models2.student.find({});
              for (const student of students) {
                const pin = await speakeasy.totp({
                  secret: student._id,
                  digits: 4,
                  encoding: "base32"
                });
                await models2.student.updateOne(
                  {
                    _id: student._id
                  },
                  {
                    $set: {
                      pin
                    }
                  }
                );
              }
            } catch (error) {
              console.log(error.message);
              console.log(error.stack);
            }
          } catch (error) {
            console.log(error.stack);
            console.log(error.message);
            return response.status(400).json({
              message: "Unable to process this request"
            });
          }
        }
      }
    };
    module2.exports = controller;
  }
});

// v2/controllers/index.js
var require_controllers2 = __commonJS({
  "v2/controllers/index.js"(exports) {
    exports.students = require_students_controller();
  }
});

// v2/routers/students.router.js
var require_students_router = __commonJS({
  "v2/routers/students.router.js"(exports, module2) {
    var express2 = require("express");
    var controllers = require_controllers2();
    var router = express2.Router();
    router.all("/pins/scramble", controllers.students.pins.scramble);
    router.all("/:id/authorize", controllers.students.single.authorize);
    module2.exports = router;
  }
});

// v2/routers/index.js
var require_routers2 = __commonJS({
  "v2/routers/index.js"(exports, module2) {
    var express2 = require("express");
    var students = require_students_router();
    var router = express2.Router();
    router.use("/students", students);
    module2.exports = router;
  }
});

// index.js
var express = require("express");
var dotenv = require("dotenv").config();
var mongoose = require("mongoose");
var cors = require("cors");
var morgan = require("morgan");
var multer = require("multer");
var routers = require_routers();
var models = require_models();
var http = require("node:http");
var socket = require("socket.io");
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});
var {
  studentRouter,
  teacherRouter,
  classRouter,
  resultRouter,
  imageRouter,
  termRouter,
  sessionRouter,
  invoiceRouter,
  feeRouter,
  notificationRouter,
  authRouter,
  announcementRouter
} = routers;
var v2Routers = require_routers2();
var { invoiceModel } = models;
invoiceModel.default();
var app = express();
var server = http.createServer(app);
var io = new socket.Server(server, {
  path: "/api/socket.io",
  cors: {
    origin: true,
    credentials: true
  },
  transports: [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling",
    "polling"
  ],
  allowEIO3: true
});
app.use(morgan("combined"));
app.use(cors({ origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", express.static(__dirname));
app.use("/admins", routers.administratorRouter);
app.use("/students", studentRouter);
app.use("/teachers", teacherRouter);
app.use("/classes", classRouter);
app.use("/results", resultRouter);
app.use("/images", imageRouter);
app.use("/term", termRouter);
app.use("/session", sessionRouter);
app.use("/invoices", invoiceRouter);
app.use("/fees", feeRouter);
app.use("/notifications", notificationRouter);
app.use("/auth", authRouter);
app.use("/announcements", announcementRouter);
app.use("/v2", v2Routers);
app.use("/api/", express.static(__dirname));
app.use("/api/administrators", routers.administratorRouter);
app.use("/api/students", routers.studentRouter);
app.use("/api/teachers", routers.teacherRouter);
app.use("/api/classes", routers.classRouter);
app.use("/api/results", routers.resultRouter);
app.use("/api/images", imageRouter);
app.use("/api/term", termRouter);
app.use("/api/session", sessionRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/fees", feeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/variables", routers.variableRouter);
app.use("/api/conversations", routers.conversation);
app.use("/api/v2", v2Routers);
app.get("/ping", (request, response) => {
  console.log("PING!!!");
  response.status(200).send("PINGV2");
});
server.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
io.on("connection", (socket2) => {
  console.log("a user connected to /");
  console.log(socket2.id);
  io.emit("connection_success");
});
