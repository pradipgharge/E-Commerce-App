const mongoose = require("mongoose");

const connectToMongoDb = async (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Mongodb connected");
    })
    .catch((error) => {
      console.log("Mongo error", error);
    });
};

module.exports = { connectToMongoDb };
