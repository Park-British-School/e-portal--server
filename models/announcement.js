const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const announcementSchema = new Schema(
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
      default: new Date().getTime(),
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

announcementSchema.static("findAll", function (options, callback) {
  this.find({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
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

module.exports = (options) => {
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
