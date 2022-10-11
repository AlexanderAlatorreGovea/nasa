const http = require("http");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const { mongoConnect } = require("./services/mongo");

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}

startServer();
