const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { data } = require("../sample.js");

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOOSE_URL);
  return "DB Connected Successfully";
}

async function initializeData() {
  await Listing.deleteMany();

  await Listing.insertMany(data);
  console.log("Initialize data ok");
}

initializeData();
