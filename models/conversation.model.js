const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  members: [
    {
      id: {
        type: String,
      },
      role: {
        type: String,
        enum: ["student", "teacher", "administrator", "admin"],
      },
    },
  ],
  messages: [
    {
      id: {
        type: String,
      },
      body: {
        type: String,
      },
      sender: {
        role: {
          type: String,
          enum: ["administrator", "student", "teacher", "admin"],
        },
        id: {
          type: String,
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
  },
});

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;
