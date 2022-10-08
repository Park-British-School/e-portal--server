const express = require("express");
const controllers = require("../controllers");

const { Router } = express;
const { announcementController } = controllers;

const announcementRouter = Router();

announcementRouter.get("/find-all", (request, response) => {
  announcementController.findAllAnnouncements((error, announcements) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).json(announcements);
    }
  });
});

announcementRouter.get("/find", (request, response) => {
  announcementController.findAnnouncements(
    {
      by: request.query.by ? request.query.by : "",
      visibility: request.body.visibility || "all",
    },
    (error, announcements) => {
      if (error) {
        response.status(400).send(error);
      } else {
        response.status(200).json(announcements);
      }
    }
  );
});

announcementRouter
  .route("")
  .get((request, response) => {
    announcementController.findAllAnnouncements(
      {
        visibility: request.body.visibility || "general",
      },
      (error, announcements) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(announcements);
        }
      }
    );
  })
  .post((request, response) => {
    announcementController.createAnnouncement(
      { ...request.body },
      {
        visibility: request.body.visibility || "general",
      },
      (error, announcement) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(announcement);
        }
      }
    );
  });

announcementRouter
  .route("/:announcementID")
  .get((request, response) => {
    announcementController.findAnnouncementByID(
      request.params.announcementID,
      (error, announcement) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).json(announcement);
        }
      }
    );
  })
  .delete((request, response) => {
    announcementController.deleteAnnouncementByID(
      request.params.announcementID,
      (error) => {
        if (error) {
          response.status(400).send(error);
        } else {
          response.status(200).end();
        }
      }
    );
  });

module.exports = announcementRouter;
