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
        type: mongoose.Types.ObjectId,
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
      default: () => new Date().getTime(),
    },
    lastSeen: {
      type: Date,
      default: () => new Date().getTime(),
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
