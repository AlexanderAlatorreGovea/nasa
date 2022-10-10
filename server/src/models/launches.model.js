const launches = require("./launches.mogo");
const planets = require("./planets.mongo");

const launch = {
  target: "Kepler-442 b",
  flightNumber: 100,
  mission: "Keppler exploration X",
  rocket: "Explore IS1",
  launchDate: new Date("December 27, 2030"),
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getLatestFlightNumber() {
  const DEFAULT_FLIGHT_NUMBER = 100;
  const latestLaunchStored = await launches.findOne({}).sort("-flightNumber");
  const latestFlightNumberOrDefault =
    latestLaunchStored.flightNumber || DEFAULT_FLIGHT_NUMBER;

  return latestFlightNumberOrDefault;
}

async function saveLaunch(launch) {
  const planetExistInDatabase = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planetExistInDatabase) {
    throw new Error("No matching planet was found!");
  }

  try {
    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function getAllLaunches() {
  try {
    return await launches.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  try {
    return await launches.findOne({
      flightNumber: +launchId,
    });
  } catch (error) {
    console.error(error);
  }
}

async function abortLaunchById(launchId) {
  try {
    const aborted = await launches.updateOne(
      {
        flightNumber: +launchId,
      },
      {
        upcoming: false,
        success: false,
      }
    );

    return aborted.modifiedCount === 1 && aborted.acknowledged === true;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  getAllLaunches,
};
