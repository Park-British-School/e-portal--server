const Term = require("../models/termModel");
const models = require("../models");

exports.getTerm = async function (req, res) {
  const data = await models.variableModel.findOne({ key: "term" });
  if (!data) {
    res.status(200).json({ term: "Not Set" });
  } else {
    res.status(200).json({ term: data.value });
  }
};

exports.setTerm = async function (req, res) {
  await Term.updateOne({}, { name: req.body.term });
  res.status(200).send({});
};
