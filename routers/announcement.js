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
      by: request.query.by || "",
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

announcementRouter.post("/create", (request, response) => {
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

announcementRouter.get("/delete-one", (request, response) => {
  announcementController.deleteAnnouncementByID(request.query.ID, (error) => {
    if (error) {
      response.status(400).send(error);
    } else {
      response.status(200).end();
    }
  });
});

announcementRouter.get("/update-one", (request, response) => {
  announcementController.updateAnnouncementByID(
    request.query.ID,
    { action: request.query.action || null },
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
