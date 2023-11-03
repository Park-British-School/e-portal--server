const bcrypt = require("bcrypt");
const uid = require("uid");
const models = require("../models");
const utils = require("../utils");
const services = require("../services");
const { cloudinary } = require("../services");

const metrics = async function (request, response) {
  try {
    let totalNumberOfAdministrators = 0;
    let totalNumberOfBannedAdministrators = 0;
    let totalNumberOfDeletedAdministrators = 0;

    totalNumberOfAdministrators = parseInt(
      await models.administratorModel.countDocuments({ isDeleted: false })
    );

    totalNumberOfBannedAdministrators = parseInt(
      await models.administratorModel.countDocuments({
        isDeleted: false,
        isBanned: true,
      })
    );

    totalNumberOfBannedAdministrators = parseInt(
      await models.administratorModel.countDocuments({
        isDeleted: true,
      })
    );

    return response.status(200).json({
      message: "Success!",
      statusCode: 200,
      data: {
        totalNumberOfDeletedAdministrators,
        totalNumberOfBannedAdministrators,
        totalNumberOfAdministrators,
      },
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};
const create = async function (request, response) {
  try {
    let administrator;

    administrator = await models.administratorModel.findOne({
      email: request.body.emailAddress,
      isDeleted: false,
    });

    if (administrator) {
      return response.status(400).json({
        message: "Administrator with this email address already exists!",
        statusCode: 400,
      });
    }

    //UPLOAD AVATAR
    if (request.body.image) {
      const result = await services.cloudinary.v2.uploader.upload(
        `data:image/jpg;base64,${request.body.image}`,
        {
          folder: "uploads/administrators/images",
        }
      );
      request.body.image = result.secure_url;
    } else {
      if (request.body.gender === "male") {
        request.body.image =
          "https://res.cloudinary.com/dpdlmetwd/image/upload/v1692557699/assets/images/undraw_male_avatar_g98d_xxrdqz.svg";
      }
      if (request.body.gender === "female") {
        request.body.image =
          "https://res.cloudinary.com/dpdlmetwd/image/upload/v1692557699/assets/images/undraw_female_avatar_efig_kvzx8p.svg";
      }
    }

    const salt = await bcrypt.genSalt(3);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);
    administrator = await models.administratorModel.create({
      ...request.body,
      password: hashedPassword,
      email: request.body.emailAddress,
    });

    return response.status(200).json({
      message: "Administrator created successfully!",
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

const findAll = async function (request, response) {
  try {
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(await models.administratorModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const administrators = await models.administratorModel
      .find(
        { isDeleted: false },
        {},
        { limit: count, skip: (page - 1) * count }
      )
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
    administrator = await models.administratorModel
      .findOne({
        _id: request.query.id,
      })
      .populate(["conversations"]);
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

const single = {
  find: async function (request, response) {
    try {
      return response.status(200).json({
        message: "Success!",
        data: { administrator: request.payload.administrator },
        statusCode: 200,
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
  update: async function (request, response) {
    try {
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
        case "update_image":
          // CHECK FOR THE IMAGE ON THE REQUEST BODY
          if (!request.body.image) {
            return response.status(400).json({
              message: "Please select image for upload!",
              statusCode: 400,
            });
          }
          // UPLOAD THE IMAGE
          const result = await services.cloudinary.v2.uploader.upload(
            `data:image/jpg;base64,${request.body.image}`,
            {
              folder: "uploads/administrators/images",
            }
          );
          request.body.image = result.secure_url;
          await models.administratorModel.updateOne(
            { _id: request.payload.administrator._id },
            {
              $set: {
                image: request.body.image,
                updatedAt: new Date().getTime(),
              },
            }
          );
          return response.status(200).json({
            message: "Image updated successfully!",
            statusCode: 200,
          });
        default:
          return response
            .status(400)
            .json({ message: "Unknown operation!", statusCode: 400 });
      }
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
  ban: async function (request, response) {
    try {
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },

  unban: async function (request, response) {
    try {
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
  delete: async function (request, response) {
    try {
      // ENSURE THAT THE ADMINISTRATOR MAKING THIS REQUEST IS THE SUPER_ADMINISTRATOR
      // if (request.administrator.secondaryRole !== "super_administrator") {
      //   return response.status(400).json({
      //     message: "Access denied! This resource requires super administrator privileges.",
      //     error: true,
      //     statusCode: 400,
      //   });
      // }

      //RESTRICT SUPER ADMINISTRATOR FROM BEING DELETED
      if (
        request.payload.administrator.secondaryRole === "super_administrator"
      ) {
        return response
          .status(400)
          .json({ message: "Super administrator cannot be deleted!" });
      }

      // DELETE THE ADMINISTRATOR
      await models.administratorModel.updateOne(
        { _id: request.payload.administrator._id },
        { $set: { isDeleted: true } }
      );

      // LOG THE ACTIVITY
      await models.administratorActivityLogModel.create({
        type: "delete_administrator",
        entity: request.payload.administrator._id,
        administrator: request.administrator._id,
      });

      // RESPONSE
      return response.status(200).json({
        message: "Administrator deleted successfully!",
        error: false,
        statusCode: 200,
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
};

const activityLogs = {
  findAll: async function (request, response) {
    try {
      const count = parseInt(request.query.count) || 10;
      const page = parseInt(request.query.page) || 1;
      let totalCount = 0;
      let totalNumberOfPages = 1;

      totalCount = await models.administratorActivityLogModel.countDocuments(
        {}
      );
      totalNumberOfPages = Math.ceil(totalCount / count);

      const administratorActivityLogs =
        await models.administratorActivityLogModel
          .find({}, {}, { limit: count, skip: (page - 1) * count })
          .sort({ createdAt: -1 })
          .populate(["entity", "administrator"]);

      return response.status(200).json({
        data: {
          count: administratorActivityLogs.length,
          totalCount,
          totalNumberOfPages,
          page: page,
          administratorActivityLogs,
        },
        statusCode: 200,
        error: false,
        message: "Success!",
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
  deleteAll: async function (request, response) {
    try {
      await models.administratorActivityLogModel.deleteMany({});
      return response.status(200).json({
        message: "Administrator activity logs deleted successfully!",
        statusCode: 400,
      });
    } catch (error) {
      console.log(error.message);
      console.log(error.stack);
      return response
        .status(400)
        .json({ message: "Unable to process this request!", statusCode: 400 });
    }
  },
};

exports.metrics = metrics;
exports.create = create;
exports.findAll = findAll;
exports.updateOne = updateOne;
exports.deleteOne = deleteOne;
exports.findOne = findOne;
exports.activityLogs = activityLogs;
exports.single = single;
