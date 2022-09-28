const mongoose = require("mongoose");
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
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

// REFACTORING STARTS HERE
classSchema.static("findAll", function (callback) {
  return this.find({}, (error, documents) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, documents);
    }
  });
});
//REFACTORING ENDS HERE

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
