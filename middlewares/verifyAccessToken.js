const jwt = require("jsonwebtoken");
const models = require("../models");

module.exports = async (request, response, next) => {
  let token;
  if (request.header("Authorization")?.startsWith("Bearer ")) {
    token = request
      .header("Authorization")
      .substring(7, request.header("Authorization").length);
  } else {
    return response
      .status(401)
      .json({ message: "Invalid authorization header!", statusCode: 401 });
  }
  if (!token) {
    return response
      .status(401)
      .json({ message: "Invalid authorization header!", statusCode: 401 });
  }
  try {
    const { role, id } = jwt.verify(token, process.env.TOKEN_SECRET);

    request.payload = {
      ...request.payload,
      id,
      role,
    };

    if (role === "administrator" || role === "admin") {
      const administrator = await models.administratorModel.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!administrator) {
        return response
          .status(401)
          .json({ message: "Invalid Token", error: true, statusCode: 401 });
      }
      request.administrator = administrator;
      return next();
    }
    return response
      .status(401)
      .json({ message: "Access denied, unknown role", statusCode: 401 });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(401)
      .json({ message: error.message, statusCode: 401 });
  }
  return null;
};
