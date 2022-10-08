const express = require('express');
const controllers = require('../controllers')

const { Router } = express
const { attendanceController } = controllers

const attendanceRouter = Router()



attendanceRouter.param("attendanceID", (request, response, next) => {
  const attendanceID = request.params.attendanceID
  attendanceController.findAttendanceByID(
    attendanceID,
    (error, attendance) =>{
      if(error) {
        response.status(400).send(error)
      }
      else {
        request.payload = { attendance: attendance }
        next()
      }
    }
  )
})

attendanceRouter.get("/", (request, response) => {
  attendanceController.findAllAttendances(
    (error, attendances) => {
      if (error) {
        response.status(400).send(error)
      }
      else {
        response.status(200).json(attendances)
      }
    }
  )
})

attendanceRouter.post("/", (request, response) => {
  attendanceController.createAttendance(
    { ...request.body },
    (error, attendance) => {
      if (error) {
        response.status(400).send(error)
      }
      else {
        response.status(200).json(attendance)
      }
    }
  )
})

attendanceRouter.get("/:attendanceID", (request, response) => {

})

module.exports = attendanceRouter