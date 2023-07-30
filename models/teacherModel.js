const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
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
      default: () => new Date().getTime(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
    lastSignInAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    collection: "teachers",
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// REFACTORING STARTS HERE
teacherSchema.static("findAll", function (callback) {
  return this.find({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
});

teacherSchema.static("findByID", function (ID, callback) {
  return this.find({ _id: ID }, (error, documents) => {
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

teacherSchema.static("findByName", function (name, callback) {
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

teacherSchema.static("findByEmailAddress", function (email, callback) {
  return this.find({ email: email }, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents[0]);
    }
  });
});

teacherSchema.virtual("class", {
  ref: "Class",
  foreignField: "teachers",
  localField: "_id",
  justOne: true,
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
