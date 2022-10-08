const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", httpGetAllPlanets);
//planetsRouter.post("/", () => {});

module.exports = planetsRouter;
