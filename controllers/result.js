const Result = require("../models/resultModel");
const Student = require("../models/studentModel");
const models = require("../models");

exports.getAllResults = async function (req, res) {
  const results = await Result.find({})
    .populate([
      { path: "class", select: "-image -password" },
      { path: "student", select: "-image -password" },
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
    ])
    .exec();
  res.status(200).json(results);
};

exports.getResult = async function (req, res) {
  const result = await Result.findById(req.params.id).populate([
    "class",
    "student",
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

exports.downloadResult = async function (req, res, next) {
  try {
    const resultID = req.params.resultID;
    const result = await Result.findById(resultID).populate([
      "class",
      "student",
    ]);
    if (!result) {
      throw "Result not found";
    } else {
      req.body.result = result;
      next();
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

// REFACTRING STARTS HERE
exports.countAllResults = function (callback) {
  Result.countDocuments({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};

exports.findAllResults = async function (options, callback) {
  if (options.paginate) {
    Result.find({})
      .populate([
        { path: "class", select: "-image -password" },
        { path: "student", select: "-image -password" },
      ])
      .limit(options.count)
      .skip(options.count * (options.page - 1))
      .exec(function (error, results) {
        if (error) {
          console.log(error);
          callback(error, null);
        } else {
          callback(null, results);
        }
      });
  } else {
    Result.findAll((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    });
  }
};

exports.findResultbyID = async function (ID, callback) {
  Result.findByID(ID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findResultsByStudentID = async function (studentID, callback) {
  Result.findResultByStudentID(studentID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.uploadResult = async function (data, callback) {
  Student.findById(data.student, (error, student) => {
    if (student) {
      Result.create({ ...data })
        .then((result) => {
          Student.updateOne(
            { _id: data.student },
            { $push: { results: result._id } },
            (error) => {
              if (error) {
                callback(error);
              } else {
                callback(null);
              }
            }
          );
        })
        .catch((error) => {
          callback(error);
        });
    } else {
      callback(
        "This student does not exist!, Please check the ID and try again"
      );
    }
  });
};

exports.approveResult = async function (resultID, callback) {
  Result.updateOne(
    { _id: resultID },
    { $set: { isApproved: true } },
    (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  );
};

exports.deleteResult = async function (resultID, callback) {
  Result.deleteOne({ _id: resultID }, (error) => {
    if (error) {
      callback(error);
    } else {
      Student.find()
        .where("results")
        .in(resultID)
        .exec((error, students) => {
          console.log(students);
          if (error) {
            console.log(error);
          } else {
            students.forEach((student, index) => {
              Student.updateOne(
                { _id: student._id },
                { $pull: { results: resultID } },
                (error) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            });
            callback(null);
          }
        });
    }
  });
};

const findAll = async function (request, response) {
  try {
    let count = parseInt(request.query.count) || 10;
    let page = parseInt(request.query.page) || 1;
    let totalCount = 0;
    let totalNumberOfPages = 1;

    totalCount = parseInt(await models.resultModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const results = await models.resultModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .sort({ uploadedAt: -1, isApproved: "asc" })
      .populate(["class", "student", "teacher"]);

    return response.status(200).json({
      data: {
        results,
        count: results.length,
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
      .json({ message: "Unable to process this request!", statusCode: 200 });
  }
};

exports.findAll = findAll;

// REFACTRING ENDS HERE
