const jwt = require("jsonwebtoken");
const controllers = require("../controllers");

const { authController } = controllers;

const verify = (request, response, next) => {
  const token = request.header("access-token");
  if (!token) return res.status(401).json({ msg: "Access Denied" });

  try {
    jsonwebtoken.verify(
      accessToken,
      process.env.TOKEN_SECRET,
      (error, data) => {
        if (error) {
          response.status(400).send(error.message);
        } else {
          request.payload = {
            ...request.payload,
            role: data.role,
            id: data.id,
          };
          next();
        }
      }
    );
    next();
  } catch (error) {
    response.status(400).send(error.message);
  }
};

module.exports = verify;
