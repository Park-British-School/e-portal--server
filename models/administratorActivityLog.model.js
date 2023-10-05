const mongoose = require("mongoose");

const administratorActivityLogSchema = new mongoose.Schema(
  {
    administrator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Administrator",
    },
    type: {
      type: "String",
      required: true,
    },
    entity: {
      type: mongoose.Types.ObjectId,
      ref: function (doc) {
        if (
          [
            "sign_in",
            "sign_out",
            "create_administrator",
            "ban_administrator",
            "unban_administrator",
            "delete_administrator",
          ].indexOf(doc.type) > -1
        ) {
          return "Administrator";
        }
        if (["ban_student", "unban_student"].indexOf(doc.type) > -1) {
          return "User";
        }
        if (["approve_result", "delete_result"].indexOf(doc.type) > -1) {
          return "Result";
        }
      },
    },
    createdAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    collection: "administrator_activity_logs",
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const administratorActivityLogModel = mongoose.model(
  "AdministratorActivityLog",
  administratorActivityLogSchema
);

module.exports = administratorActivityLogModel;
