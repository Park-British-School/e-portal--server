const models = require("../models");
const Session = require("../models/sessionModel");

exports.getSession = async function (req, res) {
  const data = await models.variableModel.findOne({ key: "session" });
  if (!data) {
    res.status(200).send({ session: "Not Set" });
  } else {
    res.status(200).send({ session: data.value });
  }
};

exports.setSession = async function (req, res) {
  await Session.updateOne({}, { name: req.body.session });
  res.status(200).send({});
};
