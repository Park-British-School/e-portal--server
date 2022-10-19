const Term = require("../models/termModel");

exports.getTerm = async function (req, res) {
  const data = await Term.findOne({});
  if (!data) {
    await new Term({ name: "Not Set" }).save();
    res.status(200).json({ term: "Not Set" });
  } else {
    res.status(200).json({ term: data.name });
  }
};

exports.setTerm = async function (req, res) {
  await Term.updateOne({}, { name: req.body.term });
  res.status(200).send({});
};
