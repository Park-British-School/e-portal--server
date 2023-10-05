const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "dpdlmetwd",
  api_key: "625683892699238",
  api_secret: "aEV37HPSkXiXhbf2cDQkTpAwxeU",
  secure: true
});

module.exports = cloudinary;
