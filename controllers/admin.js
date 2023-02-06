const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const uid = require("uid");
const models = require("../models");
const utils = require("../utils");
const services = require("../services");

exports.getAdmin = async function (req, res) {
  const admin = await Admin.findOne({ _id: req.params.id });
  res.status(200).json(admin);
};

exports.createAdmin = async function (data, callback) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  Admin.create({ ...data, password: hashedPassword })
    .then((document) => {
      callback(null, document);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.findAllAdmins = async function (options, callback) {
  if (options.paginate) {
    Admin.find()
      .sort({
        firstName: "asc",
      })
      .limit(options.count)
      .skip(options.count * (options.page - 1))
      .exec(function (error, admins) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, admins);
        }
      });
  } else {
    Admin.findAll((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    });
  }
};

exports.findAdminByEmailAddress = async function (emailAddress, callback) {
  Admin.findByEmailAddress(emailAddress, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
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
