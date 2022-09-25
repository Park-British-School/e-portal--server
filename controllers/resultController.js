const Result = require("../models/resultModel");
const Student = require("../models/studentModel");

exports.getAllResults = async function (req, res) {
  const results = await Result.find({})
    .populate([
      { path: "class", select: "-image -password" },
      { path: "student", select: "-image -password" },
      { path: "uploadedBy", select: "-image -password" },
    ])
    .exec();
  res.status(200).json(results);
};

exports.getResultsByClass = async function (req, res) {
  const classID = req.params.classID;
  const results = await Result.find({})
    .where("class")
    .equals(classID)
    .populate([
      { path: "class", select: "-password" },
      { path: "student", select: "-password" },
      { path: "uploadedBy", select: "-password" },
    ])
    .exec();
  res.status(200).json(results);
};

exports.getResult = async function (req, res) {
  const result = await Result.findById(req.params.id).populate([
    "class",
    "student",
    "uploadedBy",
  ]);
  res.status(200).json(result);
};

exports.addResult = async function (req, res) {
  const studentID = req.body.student;
  try {
    const student = Student.findById(studentID);
    if (student) {
      const newResult = await new Result({
        ...req.body,
      }).save();

      await Student.updateOne(
        { _id: req.body.student },
        { $push: { results: newResult._id } }
      );
    } else {
      throw "This student does not exist!, Please check the ID and try again";
    }

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.deleteResult = async function (req, res) {
  const resultID = req.params.resultID;
  try {
    const result = await Result.findByIdAndDelete(resultID);
    await Student.updateOne(
      { _id: result.student },
      { $pull: { results: result._id } }
    );
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.editResult = async function (req, res) {
  try {
    const resultID = req.params.resultID;
    await Result.updateOne(
      { _id: resultID },
      { ...req.body, isApproved: false }
    );

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.approveResult = async function (req, res) {
  try {
    const resultID = req.params.resultID;
    console.log(resultID);
    await Result.updateOne({ _id: resultID }, { isApproved: true });
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: {
        message: err,
      },
    });
  }
};

exports.downloadResult = async function (req, res, next) {
  try {
    const resultID = req.params.resultID;
    const result = await Result.findById(resultID).populate([
      "class",
      "student",
      "uploadedBy",
    ]);
    if (!result) {
      throw "Result not found";
    } else {
      req.body.result = result;
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.countAllResults = function (callback) {
  Result.count({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};
