const mongoose = require("mongoose");
const Class = require("../models/classModel");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");

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
  Class.findAll((error, document) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, document);
    }
  });
};

//REFACTORING ENDS HERE
