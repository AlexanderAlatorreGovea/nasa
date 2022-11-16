const axios = require('axios');
const launches = require("./launches.mogo");
const planets = require("./planets.mongo");

async function getLatestFlightNumber() {
  const DEFAULT_FLIGHT_NUMBER = 100;
  const latestLaunchStored = await launches.findOne({}).sort("-flightNumber");
  const latestFlightNumberOrDefault =
    latestLaunchStored.flightNumber || DEFAULT_FLIGHT_NUMBER;

  return latestFlightNumberOrDefault;
}

async function saveLaunch(launch) {
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

async function getAllLaunches({ skip, limit }) {
  try {
    return await launches
      .find(
        {},
        {
          _id: 0,
          __v: 0,
        }
      )
      .sort({
        flightNumber: 1,
      })
      .skip(skip)
      .limit(limit);
  } catch (error) {
    console.error(error);
  }
}

async function scheduleNewLaunch(launch) {
  const planetExistInDatabase = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planetExistInDatabase) {
    throw new Error("No matching planet was found!");
  }

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
    return await findLaunch({
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

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
async function loadLaunchData() {
  try {
    const existingLaunch = await findLaunch({
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat",
    });

    if (existingLaunch) {
      console.log("Downloading launch Data");
      return;
    }

    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    if (response.status !== 200) {
      console.error("Problem downloading launch data");
      throw new Error("Launch data download failed");
    }

    await response.data.docs.map(async (launch) => {
      const customers = launch.payloads.flatMap((payload) => payload.customers);

      await saveLaunch({
        flightNumber: launch.flight_number,
        mission: launch.name,
        rocket: launch.rocket.name,
        launchDate: launch.date_local,
        upcoming: launch.upcoming,
        success: launch.success,
        target: "",
        customers,
      });
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  loadLaunchData,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  getAllLaunches,
};
