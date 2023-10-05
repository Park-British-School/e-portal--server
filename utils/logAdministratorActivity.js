const models = require("../models")

module.exports = async function (administratorId, activityType, entityId){
  await models.administratorActivityLogModel.create({})
}