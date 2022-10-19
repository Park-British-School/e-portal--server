const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const Admin = require("../models/adminModel");

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
