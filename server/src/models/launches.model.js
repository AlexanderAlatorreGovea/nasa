const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber += 1;

  const newlyCreatedLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true,
    costumers: ["Zero to Mastery", "NASA"],
  });

  return launches.set(launch.flightNumber, newlyCreatedLaunch);
}

module.exports = {
  addNewLaunch,
  getAllLaunches,
};
