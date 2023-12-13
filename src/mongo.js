const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("connected to database.");
  } catch (error) {
    console.log(error, "could not connect database.");
  }
};
module.exports = { connect };
