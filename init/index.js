require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => { console.log("connected to DB"); })
  .catch((err) => { console.log(err); });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"];

const initDB = async () => {
  await Listing.deleteMany({});

  const formattedData = initData.data.map((obj, index) => ({
    ...obj,
    image: {
      url: typeof obj.image === "string" ? obj.image : obj.image?.url,
      filename: "listingimage",
    },
    category: categories[index % categories.length],
  }));

  await Listing.insertMany(formattedData);
  console.log("data was initialized ✅");
};

initDB();