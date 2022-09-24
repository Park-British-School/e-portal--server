const Class = require("../models/classModel")
const Session = require("../models/sessionModel")

exports.getSession = async function (req, res) {
  const data = await Session.findOne({})
  if (!data) {
    await new Session({ name: "Not Set" }).save()
    res.status(200).send({ session: "Not Set" })
  }
  else {
    res.status(200).send({ session: data.name })
  }
}

exports.setSession = async function (req, res) {
  await Session.updateOne({}, { name: req.body.session })
  res.status(200).send({})
}