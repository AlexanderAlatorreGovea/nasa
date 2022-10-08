const planets = [];

function getAllPlanets(req, res) {
  return res.status(200).json(planets);
}
