const mongoose = require("mongoose");

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

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URL);
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};
