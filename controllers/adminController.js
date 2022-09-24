const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jsonwebtoken = require("jsonwebtoken")
const Admin = require('../models/adminModel')

exports.getAllAdmins = async function (req, res) {
  const admins = await Admin.find({})
  res.status(200).json(admins)
}
exports.getAdmin = async function (req, res) {
  const admin = await Admin.findOne({ _id: req.params.id })
  res.status(200).json(admin)
}
exports.addAdmin = async function (req, res) {
  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newAdmin = await new Admin({
    ...req.body,
    password: hashedPassword
  }).save()
  res.status(200).json(newAdmin)
}

exports.login = async function (req, res) {
  try {
    //CHECK IF THE ADMIN EXISTS
    const admin = await Admin.findOne({ email: req.body.email }).populate('class')
    if (admin) {
      //CHECK IF THE PASSWORD MATCHES
      const isPasswordMatched = await bcrypt.compare(
        req.body.password,
        admin.password
      );
      if (isPasswordMatched) {
        //SIGN THE ADMIN ID AND ROLE WITH JSONWEBTOKEN
        const token = jsonwebtoken.sign(
          { _id: admin._id, role: admin.role },
          process.env.TOKEN_SECRET
        );
        res.status(200).json({ authToken: token, ...admin._doc });
      }
      else {
        //THROW ERROR FOR INCORRECT PASSWORD
        throw "Invalid Email or Password"
      }
    }
    else {
      //THROW ERROR FOR INVALID EMAIL ADDRESS
      throw "Invalid Email or Password"
    }

  }
  catch (err) {
    res.status(400).json({
      error: {
        message: err
      }
    })
  }
}