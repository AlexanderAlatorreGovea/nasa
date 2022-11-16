const {
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchWithId,
  getAllLaunches,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches({
    skip,
    limit,
  });

  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    const error = "Launch not found.";

    return res.status(400).json({ error });
  }

  const aborted = await abortLaunchById(+launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
