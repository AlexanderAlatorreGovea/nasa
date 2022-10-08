const { planets } = require("../../models/planets.model");

function httpGetAllPlanets(req, res) {
  return res.status(200).json(planets);
}

module.exports = {
  httpGetAllPlanets,
};
