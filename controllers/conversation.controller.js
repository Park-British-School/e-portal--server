const models = require("../models");
const { compileETag } = require("express/lib/utils");
const create = async function (request, response) {
  try {
    const conversation = await models.conversation.create({
      ...request.body,
    });
    for (const member of request.body.members) {
      if (member.role === "administrator") {
        await models.administratorModel.updateOne(
          { _id: member.id },
          { $push: { conversations: conversation._id } }
        );
      }
    }
    return response.status(200).json({
      message: "Success!",
      error: false,
      data: { conversation: conversation },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response.status(400).json({
      message: "Unable to process this request!",
      error: true,
      data: null,
      statusCode: 400,
    });
  }
};

const single = {
  find: async function (request, response) {
    try {
      const conversation = await models.conversation.findOne({
        _id: request.params.conversation_id,
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response.status(200).json({
        message: "Unable to process this request",
        error: true,
        data: null,
        statusCode: 400,
      });
    }
  },
};

exports.create = create;
exports.single = single;
