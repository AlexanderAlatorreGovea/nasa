const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Keppler exploration X",
  rocket: "Explore IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
};
