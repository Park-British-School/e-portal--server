const speakeasy = require("speakeasy");

const models = require("../../models");

const controller = {
  single: {
    authorize: async function (request, response) {
      try {
        let student;

        student = await models.student.findOne({
          _id: request.params.id.replaceAll("-", "/"),
        });

        if (!student) {
          return response.status(400).json({
            message: "Student not found",
            error: true,
            data: null,
            statusCode: 400,
          });
        }

        if (request.query.pin !== student.pin) {
          return response.status(400).json({
            message: "Pin mismatch",
            error: true,
            data: null,
            statusCode: 400,
          });
        }

        return response.status(200).json({
          message: "Success",
          error: false,
          data: null,
          statusCode: 200,
        });
      } catch (error) {
        console.log(error.message);
        console.log(error.stack);
        return response.status(400).json({
          message: "Unable to process this request",
        });
      }
    },
  },
  pins: {
    scramble: async function (request, response) {
      try {
        response.status(200).json({
          message: "Success",
          error: false,
          data: null,
          statusCode: 200,
        });
        try {
          let students = await models.student.find({});
          for (const student of students) {
            const pin = await speakeasy.totp({
              secret: student._id,
              digits: 4,
              encoding: "base32",
            });

            await models.student.updateOne(
              {
                _id: student._id,
              },
              {
                $set: {
                  pin: pin,
                },
              }
            );
          }
        } catch (error) {
          console.log(error.message);
          console.log(error.stack);
        }
      } catch (error) {
        console.log(error.stack);
        console.log(error.message);
        return response.status(400).json({
          message: "Unable to process this request",
        });
      }
    },
  },
};

module.exports = controller;
