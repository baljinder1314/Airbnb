const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { data: sampleData } = require("../sample.js");

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("DB Connected Successfully");
    initializeData();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

async function initializeData() {
  await Listing.deleteMany({});

  const updatedData = sampleData.map((obj) => ({
    ...obj,
    owner: "6a16c167fb7ffbbe3f6f11cb",
  }));
  console.log(updatedData)

  await Listing.insertMany(updatedData);

  console.log("Initialize data ok");
}