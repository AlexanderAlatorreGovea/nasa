const express = require("express");

const {
  httpAddNewLaunch,
  httpGetAllLaunches,
  httpRemoveLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/", httpRemoveLaunch);

module.exports = launchesRouter;
