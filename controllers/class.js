const mongoose = require("mongoose");
const Class = require("../models/classModel");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const models = require("../models");

exports.getAllClasses = async function (req, res) {
  try {
    const classes = await Class.find({})
      .populate([
        { path: "students", select: "-image -password" },
        { path: "teachers", select: "-image -password" },
      ])
      .exec();
    res.status(200).json(classes);
  } catch (err) {
    res.status(404).json({
      error: {
        message: err,
      },
    });
  }
};

exports.getClass = async function (req, res) {
  try {
    const _class = await Class.findOne({ _id: req.params.classID })
      .populate([
        { path: "students", select: "-image -password" },
        { path: "teachers", select: "-image -password" },
      ])
      .exec();
    if (_class) {
      res.status(200).json(_class);
    } else {
      throw "Class does not exist";
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.addClass = async (req, res) => {
  const newClass = await new Class({
    ...req.body,
  }).save();
  res.json(newClass);
};

exports.assignStudent = async function (req, res) {
  const studentID = req.body.studentID;
  const classID = req.body.classID;
  try {
    const student = await Student.findById(studentID);
    if (student) {
      const _class = await Class.findById(classID);
      if (_class.students.indexOf(studentID) < 0) {
        await Class.updateOne(
          { _id: classID },
          { $push: { students: studentID } }
        );
      } else {
        throw `${student.firstName} ${student.lastName} has already been added to ${_class.name}`;
      }
    } else {
      throw "Student does not exist!, Please check the ID";
    }
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.removeStudent = async function (req, res) {
  const studentID = req.body.studentID;
  const classID = req.params.classID;
  try {
    const student = await Student.findById(studentID);
    if (student) {
      const _class = await Class.findById(classID);
      if (_class.students.indexOf(studentID) >= 0) {
        await Class.updateOne(
          { _id: classID },
          { $pull: { students: studentID } }
        );
      } else {
        throw `${student.firstName} ${student.lastName} does not exist in ${_class.name}`;
      }
    } else {
      throw "Student does not exist!, Please check the ID";
    }
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.assignTeacher = async function (req, res) {
  const teacherID = req.body.teacherID;
  const classID = req.body.classID;
  try {
    const teacher = await Teacher.findById(teacherID);
    if (teacher) {
      await Class.updateOne(
        { _id: classID },
        { $push: { teachers: teacherID } }
      );
    } else {
      throw "Teacher does not exist!";
    }

    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.removeTeacher = async function (req, res) {
  const teacherID = req.body.teacherID;
  const classID = req.params.classID;
  try {
    const teacher = await Teacher.findById(teacherID);
    if (teacher) {
      const _class = await Class.findById(classID);
      if (_class.teachers.indexOf(teacherID) >= 0) {
        await Class.updateOne(
          { _id: classID },
          { $pull: { teachers: teacherID } }
        );
      } else {
        throw `${teacher.firstName} ${teacher.lastName} does not exist in ${_class.name}`;
      }
    } else {
      throw "Teacher does not exist!, Please check the ID";
    }
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.getAllSubjects = async function (req, res) {};

exports.addSubject = async function (req, res) {
  const subject = req.body.subject;
  console.log(subject);
  const classID = req.params.classID;
  try {
    const _class = await Class.findById(classID);
    if (_class) {
      console.log(_class.subjects.indexOf(subject));
      if (_class.subjects.indexOf(subject) < 0) {
        await Class.updateOne(
          { _id: classID },
          { $push: { subjects: subject } }
        );
      } else {
        throw "subject already exists";
      }
    } else {
      throw "class does not exist!";
    }

    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

exports.deleteSubject = async function (req, res) {
  const subject = req.body.subject;
  const classID = req.params.classID;
  try {
    const _class = await Class.findById(classID);
    if (_class) {
      console.log(_class.subjects.indexOf(subject));
      const updatedClass = await Class.findOneAndUpdate(
        { _id: classID },
        { $pull: { subjects: subject } },
        { useFindAndModify: false }
      );
      res.status(200).json(updatedClass);
      console.log(updatedClass.subjects);
    } else {
      throw "class does not exist!";
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: {
        message: error,
      },
    });
  }
};

// REFACTORING STARTS HERE

exports.countAllClasses = async function (callback) {
  Class.countDocuments({}, (error, count) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, count);
    }
  });
};

exports.findAllClasses = async function (options, callback) {
  if (options.paginate) {
    Class.find()
      .limit(options.count)
      .skip(options.count * (options.page - 1))
      .exec((error, classes) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, classes);
        }
      });
  }
  Class.findAll((error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

exports.findClassByID = async function (ID, callback) {
  Class.find({ _id: ID })
    .populate(["students", "teachers"])
    .exec((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents[0]);
      }
    });
};

exports.findClassByName = async function (name, callback) {
  Class.find({ name: name })
    .populate(["students", "teachers"])
    .exec((error, documents) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, documents[0]);
      }
    });
};

exports.createClass = async function (data, callback) {
  Class.create({ ...data })
    .then((document) => {
      callback(null, document);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.students = {
  assign(classID, studentID, callback) {
    Student.findById(studentID, (error, student) => {
      if (error) {
        callback(error);
      } else {
        if (student) {
          Class.findById(classID, (error, _class) => {
            if (_class) {
              if (_class.students.indexOf(studentID) < 0) {
                Class.updateOne(
                  { _id: classID },
                  { $push: { students: studentID } },
                  (error) => {
                    if (error) {
                      callback(error);
                    } else {
                      callback(null);
                    }
                  }
                );
              } else {
                callback(`Cannot assign a student twice!`);
              }
            } else {
              callback("Class does not exist!");
            }
          });
        } else {
          callback("Student does not exist!");
        }
      }
    });
  },
  deassign(classID, studentID, callback) {
    Student.findById(studentID, (error, student) => {
      if (error) {
        callback(error);
      } else {
        if (student) {
          Class.findById(classID, (error, _class) => {
            if (_class) {
              if (_class.students.indexOf(studentID) >= 0) {
                Class.updateOne(
                  { _id: classID },
                  { $pull: { students: studentID } },
                  (error) => {
                    if (error) {
                      callback(error);
                    } else {
                      callback(null);
                    }
                  }
                );
              } else {
                callback(`Student does not exist in this class`);
              }
            } else {
              callback("Class does not exist!");
            }
          });
        } else {
          callback("Student does not exist!");
        }
      }
    });
  },
};

exports.teachers = {
  assign(classID, emailAddress, callback) {
    console.log(emailAddress);
    Teacher.findOne({ email: emailAddress }, (error, teacher) => {
      if (error) {
        callback(error);
      } else {
        if (teacher) {
          Class.findById(classID, (error, _class) => {
            if (_class) {
              if (_class.teachers.indexOf(teacher._id) < 0) {
                Class.updateOne(
                  { _id: classID },
                  { $push: { teachers: teacher._id } },
                  (error) => {
                    if (error) {
                      callback(error);
                    } else {
                      callback(null);
                    }
                  }
                );
              } else {
                callback(`Cannot assign a teacher twice!`);
              }
            } else {
              callback("Class does not exist!");
            }
          });
        } else {
          callback("teacher does not exist!");
        }
      }
    });
  },
  deassign(classID, teacherID, callback) {
    Teacher.findById(teacherID, (error, teacher) => {
      if (error) {
        callback(error);
      } else {
        if (teacher) {
          Class.findById(classID, (error, _class) => {
            if (_class) {
              if (_class.teachers.indexOf(teacherID) >= 0) {
                Class.updateOne(
                  { _id: classID },
                  { $pull: { teachers: teacherID } },
                  (error) => {
                    if (error) {
                      callback(error);
                    } else {
                      callback(null);
                    }
                  }
                );
              } else {
                callback(`Teacher does not exist in this class`);
              }
            } else {
              callback("Class does not exist!");
            }
          });
        } else {
          callback("Teacher does not exist!");
        }
      }
    });
  },
};

exports.subjects = {
  add(classID, subject, callback) {
    Class.findById(classID, (error, _class) => {
      if (_class) {
        if (_class.subjects.indexOf(subject) < 0) {
          Class.updateOne(
            { _id: classID },
            { $push: { subjects: subject } },
            (error) => {
              if (error) {
                callback(error);
              } else {
                callback(null);
              }
            }
          );
        } else {
          callback(`Cannot add a subject twice!`);
        }
      } else {
        callback("Class does not exist!");
      }
    });
  },
  remove(classID, subject, callback) {
    Class.findById(classID, (error, _class) => {
      if (_class) {
        if (_class.subjects.indexOf(subject) >= 0) {
          Class.updateOne(
            { _id: classID },
            { $pull: { subjects: subject } },
            (error) => {
              if (error) {
                callback(error);
              } else {
                callback(null);
              }
            }
          );
        } else {
          callback(`Subject does not exist in this class`);
        }
      } else {
        callback("Class does not exist!");
      }
    });
  },
};

const metrics = async function (request, response) {
  try {
    let totalNumberOfClasses = 0;
    let totalNumberOfDeletedClasses;
    totalNumberOfClasses = parseInt(
      await models.classModel.countDocuments({ isDeleted: false })
    );
    totalNumberOfDeletedClasses = parseInt(
      await models.classModel.countDocuments({ isDeleted: true })
    );

    return response.status(200).json({
      message: "Success!",
      statusCode: 200,
      data: { totalNumberOfDeletedClasses, totalNumberOfClasses },
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

    totalCount = parseInt(await models.classModel.countDocuments({}));
    totalNumberOfPages = Math.ceil(totalCount / count);

    const classes = await models.classModel
      .find({}, {}, { limit: count, skip: (page - 1) * count })
      .populate(["students", "teachers"]);

    return response.status(200).json({
      data: {
        classes,
        count: classes.length,
        totalCount,
        totalNumberOfPages,
        page: page,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    return response.status(400).json({
      message: "Unable to process this request!",
      statusCode: 400,
      error: false,
    });
  }
};

exports.metrics = metrics;
exports.findAll = findAll;
