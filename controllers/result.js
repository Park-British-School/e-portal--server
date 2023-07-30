const models = require("../models");

exports.getAllResults = async function (req, res) {
  const results = await models.resultModel
    .find({})
    .populate([
      { path: "class", select: "-image -password" },
      { path: "student", select: "-image -password" },
    ])
    .exec();
  res.status(200).json(results);
};

exports.getResultsByClass = async function (req, res) {
  const classID = req.params.classID;
  const results = await models.resultModel
    .find({})
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
  const result = await models.resultModel
    .findById(req.params.id)
    .populate(["class", "student"]);
  res.status(200).json(result);
};

exports.addResult = async function (req, res) {
  const studentID = req.body.student;
  try {
    const student = models.studentModel.findById(studentID);
    if (student) {
      const newResult = await models.resultModel({
        ...req.body,
      });

      await models.studentModel.updateOne(
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

exports.downloadResult = async function (req, res, next) {
  try {
    const resultID = req.params.resultID;
    const result = await models.resultModel
      .findById(resultID)
      .populate(["class", "student"]);
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
  models.resultModel.countDocuments({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};

exports.findAllResults = async function (options, callback) {
  if (options.paginate) {
    models.resultModel
      .find({})
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
    models.resultModel.findAll((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents);
      }
    });
  }
};

exports.findResultbyID = async function (ID, callback) {
  models.resultModel.findByID(ID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findResultsByStudentID = async function (studentID, callback) {
  models.resultModel.findResultByStudentID(studentID, (error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

const upload = async function (request, response) {
  console.log("REQUEST BODY FOR RESULT", request.body);
  try {
    const student = await models.studentModel.findOne({
      _id: request.body.student,
    });
    if (!student) {
      return response
        .status(400)
        .json({ message: "Student not found!", statusCode: 400 });
    }
    const result = await models.resultModel.create({ ...request.body });
    await models.studentModel.updateOne(
      { _id: request.body.student },
      { $push: { results: result._id } }
    );

    return response
      .status(200)
      .json({ message: "Result uploaded successfully!", statusCode: 200 });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 200 });
  }
};

exports.approveResult = async function (resultID, callback) {
  models.resultModel.updateOne(
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
  models.resultModel.deleteOne({ _id: resultID }, (error) => {
    if (error) {
      callback(error);
    } else {
      models.studentModel
        .find()
        .where("results")
        .in(resultID)
        .exec((error, students) => {
          console.log(students);
          if (error) {
            console.log(error);
          } else {
            students.forEach((student, index) => {
              models.studentModel.updateOne(
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

const search = async function (request, response) {
  try {
    let students = [];
    let results = [];
    if (
      !request.query.search ||
      request.query.search.trim() === "" ||
      request.query.search.trim().length < 3
    ) {
      return response.status(400).json({
        message: "Search query must 3 or more letters!",
        statusCode: 400,
      });
    }
    students = await models.studentModel.find({
      $or: [
        { firstName: new RegExp(request.query.search, "i") },
        { lastName: new RegExp(request.query.search, "i") },
        { emailAddress: new RegExp(request.query.search, "i") },
      ],
    });
    results = await models.resultModel
      .find({
        student: [...students.map((student) => student._id)],
      })
      .populate(["student", "class"]);

    return response.status(200).json({
      message: `${results.length} results found`,
      statusCode: 400,
      data: { results },
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

    totalCount = parseInt(await models.resultModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const results = await models.resultModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .sort({ uploadedAt: -1, isApproved: "asc" })
      .populate(["class", "student"]);

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

const findOne = async function (request, response) {
  try {
    let result;
    result = await models.resultModel
      .findOne({ _id: request.query.id })
      .populate(["class", "student"]);
    if (!result) {
      return response
        .status(400)
        .json({ message: "Result not found!", statusCode: 400 });
    }
    return response
      .status(200)
      .json({ message: "Success", data: { result: result }, statusCode: 200 });
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
    switch (request.query.operation) {
      case "update":
        await models.resultModel.updateOne(
          { _id: request.body._id },
          { $set: { ...request.body } }
        );
        return response
          .status(200)
          .json({ message: "Success", statusCode: 200 });

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
};

const deleteOne = async function (request, response) {
  try {
    const result = await models.resultModel.findOne({ _id: request.query.id });
    if (!result) {
      return response
        .status(400)
        .json({ message: "Result not found!", statusCode: 400 });
    }

    await models.resultModel.deleteOne({ _id: request.query.id });

    await models.studentModel.updateOne(
      { _id: result.student },
      { $pull: { results: request.query.id } }
    );
    return response
      .status(200)
      .json({ message: "Result deleted successfully!", statusCode: 200 });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response
      .status(400)
      .json({ message: "Unable to process this request!", statusCode: 400 });
  }
};

exports.search = search;
exports.findAll = findAll;
exports.findOne = findOne;
exports.updateOne = updateOne;
exports.deleteOne = deleteOne;
exports.upload = upload;

// REFACTORING ENDS HERE
