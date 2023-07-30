const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const uid = require("uid");
const models = require("../models");
const utils = require("../utils");
const services = require("../services");

exports.createAdmin = async function (data, callback) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  models.administratorModel
    .create({ ...data, password: hashedPassword })
    .then((document) => {
      callback(null, document);
    })
    .catch((error) => {
      callback(error, null);
    });
};

const findAll = async function (request, response) {
  try {
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(await models.administratorModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const administrators = await models.administratorModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .sort({ createdAt: -1 });

    return response.status(200).json({
      data: {
        administrators,
        count: administrators.length,
        totalCount,
        totalNumberOfPages,
        page: page,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const findOne = async function (request, response) {
  try {
    let administrator;
    administrator = await models.administratorModel.findOne({
      _id: request.query.id,
    });
    if (!administrator) {
      return response
        .status(400)
        .json({ message: "Administrator not found!", statusCode: 400 });
    }

    return response
      .status(200)
      .json({ message: "Success!", data: { administrator }, statusCode: 200 });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const updateOne = async function (request, response) {
  try {
    let administrator;

    administrator = await models.administratorModel.findOne({
      _id: request.query.id,
    });

    if (!administrator) {
      return response
        .status(400)
        .json({ message: "Administrator not found!", statusCode: 400 });
    }

    switch (request.query.operation) {
      case "update":
        await models.administratorModel.updateOne(
          { _id: request.query.id },
          { $set: { ...request.body } }
        );
        return response.status(200).json({
          message: "Administrator updated successfully!",
          statusCode: 200,
        });

      case "ban":
        await models.administratorModel.updateOne(
          { _id: administrator._id },
          { $set: { status: "banned" } }
        );
        return response
          .status(200)
          .json({ message: "Administrator banned successfully!" });

      case "unban":
        await models.administratorModel.updateOne(
          { _id: administrator._id },
          { $set: { status: "active" } }
        );
        return response
          .status(200)
          .json({ message: "Administrator unbanned successfully!" });
      default:
        return response
          .status(400)
          .json({ message: "Invalid operation!", statusCode: 400 });
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

const deleteOne = async function (request, response) {
  try {
    let administrator;
    administrator = await models.administratorModel.findOne({
      _id: request.query.id,
    });
    if (!administrator) {
      return response
        .status(400)
        .json({ message: "Administrator not found!", statusCode: 400 });
    }

    await models.administratorModel.deleteOne({ _id: administrator._id });

    return response.status(200).json({
      message: "Administrator deleted successfully!",
      statusCode: 400,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

exports.password = {
  reset: async function (request, response) {
    try {
      const administrator = models.administratorModel.findOne({
        email: request.query.emailAddress,
      });
      if (!administrator) {
        return response
          .status(400)
          .json(
            utils.responseGenerator(
              null,
              "Account with this email address was not found!",
              true,
              400
            )
          );
      }
      if (!administrator.allowPasswordReset) {
        return response
          .status(400)
          .json(
            utils.responseGenerator(
              null,
              "You can't reset the password on this account without a reset token",
              true,
              400
            )
          );
      }
      const passwordMatch = await bcrypt.compare(
        request.body.password,
        administrator.password
      );
      if (passwordMatch) {
        return response
          .status(400)
          .json(
            utils.responseGenerator(
              null,
              "You can't old password as new password",
              true,
              400
            )
          );
      }
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      await models.administratorModel.updateOne(
        { _id: administrator._id },
        { $set: { password: hashedPassword } }
      );
      await services.postmark;
      return response
        .status(200)
        .json(
          utils.responseGenerator(
            null,
            "Password updated successfully!",
            false,
            200
          )
        );
    } catch (error) {
      return response
        .status(400)
        .json(
          utils.responseGenerator(
            null,
            "An error occurred while processing this request",
            true,
            400
          )
        );
    }
  },

  resetPin: {
    generate: async function (request, response) {
      try {
        const administrator = models.administratorModel.findOne({
          email: request.query.emailAddress,
        });
        if (!administrator) {
          return response
            .status(400)
            .json(
              utils.responseGenerator(
                null,
                "Account with this email address was not found!",
                true,
                400
              )
            );
        }

        const pin = uid.uid(8);
        await models.passwordResetPinModel.create({
          administrator: administrator._id,
          pin: pin,
        });
        if (process.env.NODE_ENV !== "test") {
          await services.postmark.serverClient.sendEmailWithTemplate(
            {
              TemplateId: 30682589,
              From: "Park British School no-reply@parkbritishschool.com",
              To: request.query.emailAddress,
              TemplateModel: {
                email_address: request.query.emailAddress,
                reset_pin: pin,
                last_name: administrator.lastName,
              },
            },
            (error) => {
              if (error) {
                console.log(error.message);
              }
            }
          );
        }
        return response
          .status(200)
          .json(utils.responseGenerator(null, "Success", false, 200));
      } catch (error) {
        return response
          .status(400)
          .json(
            utils.responseGenerator(
              null,
              "An error occurred while processing this request",
              true,
              400
            )
          );
      }
    },
    verify: async function (request, response) {
      try {
        const pin = await models.passwordResetPinModel.findOne({
          pin: request.query.pin,
        });
        if (!pin) {
          return response
            .status(400)
            .json(utils.responseGenerator(null, "Invalid pin!", true, 400));
        }
        const administrator = models.administratorModel.findOne({
          email: request.query.emailAddress,
        });
        if (!administrator) {
          return response
            .status(400)
            .json(
              utils.responseGenerator(
                null,
                "Account with this email address was not found!",
                true,
                400
              )
            );
        }
        if (pin.administrator !== administrator._id) {
          return response
            .status(400)
            .json(utils.responseGenerator(null, "Invalid pin!", true, 400));
        }
        await models.administratorModel.updateOne(
          { _id: administrator._id },
          { $set: { allowPasswordReset: true } }
        );
        return response
          .status(200)
          .json(utils.responseGenerator(null, "Success", false, 200));
      } catch (error) {
        return response
          .status(400)
          .json(
            utils.responseGenerator(
              null,
              "An error occurred while processing this request",
              true,
              400
            )
          );
      }
    },
  },
};

exports.findAll = findAll;
exports.updateOne = updateOne;
exports.deleteOne = deleteOne;
exports.findOne = findOne;
