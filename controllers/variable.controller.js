const models = require("../models");
const get = async function (request, response) {
  try {
    let variable;
    if (!request.query.key) {
      return response
        .status(400)
        .json({ message: "Missing query parameter: Key!", statusCode: 400 });
    }
    variable = await models.variableModel.findOne({
      key: request.query.key,
    });
    if (!variable) {
      variable = {
        key: request.query.key,
        value: "n/a",
      };
    }
    return response
      .status(200)
      .json({ message: "Success!", statusCode: 200, data: { variable } });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const set = async function (request, response) {
  try {
    let variable;
    if (!request.query.key) {
      return response
        .status(400)
        .json({ message: "Missing query parameter: Key!", statusCode: 400 });
    }
    if (!request.body.value) {
      return response
        .status(400)
        .json({ message: "Missing query parameter: Value!", statusCode: 400 });
    }
    variable = await models.variableModel.findOne({
      key: request.query.key,
    });
    if (!variable) {
      await models.variableModel.create({
        key: request.query.key,
        value: request.body.value,
      });
    } else {
      await models.variableModel.updateOne(
        {
          key: request.query.key,
        },
        { $set: { value: request.body.value } }
      );
    }

    return response.status(200).json({ message: "Success!", statusCode: 200 });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

exports.get = get;
exports.set = set;
