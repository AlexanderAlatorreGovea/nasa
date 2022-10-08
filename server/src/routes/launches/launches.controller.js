const {
  addNewLaunch,
  abortLaunchById,
  getAllLaunches,
  existsLaunchId,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    const error = "Missing required launch property";

    return res.status(400).json({ error });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    const error = "Invalid launch Date";
    return res.status(400).json({ error });
  }

  addNewLaunch(launch);

  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (existsLaunchId(launchId)) {
    const error = "Launch not found.";

    return res.status(400).json({ error });
  }
  
  const aborted = abortLaunchById(launchId);

  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
