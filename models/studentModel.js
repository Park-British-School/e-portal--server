const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      index: false,
    },
    image: {
      type: String,
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
    pin: {
      type: String,
      required: true,
      default: "0000",
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
      default: () => new Date().getTime(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
    lastSeen: {
      type: Date,
      default: () => new Date().getTime(),
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      required: true,
      default: false,
    },
    isArchived: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    collection: "students",
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.virtual("class", {
  ref: "Class",
  localField: "_id",
  foreignField: "students",
  justOne: true,
});

studentSchema.virtual("results", {
  ref: "Result",
  localField: "_id",
  foreignField: "student",
});
// REFACTORING STARTS HERE
studentSchema.static("findAll", function (callback) {
  return this.find({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
});

studentSchema.static("findByID", function (ID, callback) {
  return this.find({ _id: ID })
    .populate(["results", "invoices"])
    .exec((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        if (documents.length === 0) {
          callback(null, null);
        } else {
          callback(null, documents[0]);
        }
      }
    });
});

studentSchema.static("findByName", function (name, callback) {
  return this.find(
    {
      $or: [{ firstName: name }, { lastName: name }],
    },
    (error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents[0]);
      }
    }
  );
});
studentSchema.static("findBySearch", function (search, callback) {
  return this.find(
    {
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
      ],
    },
    (error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    }
  );
});
//REFACTORING ENDS HERE

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
