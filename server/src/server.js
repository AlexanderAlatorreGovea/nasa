const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  if (!err) return;
  console.error(err);
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL);

  await loadPlanetsData();

  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}

startServer();
