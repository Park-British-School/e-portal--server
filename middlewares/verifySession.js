const models = require("../models");

module.exports = async function (request, response, next) {
  try {
    let session;
    session = await models.sessionModel.findOne({
      accessToken: request
        .header("Authorization")
        .substring(7, request.header("Authorization").length),
    });
    if (!session) {
      return response.status(400).json({
        message: "No session! Please sign in again!",
        statusCode: 400,
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to verify session!", statusCode: 400 });
  }
};
