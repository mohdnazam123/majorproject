const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,  
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ 
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
   },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",

  },
 geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"   // default rakho
  },
  category: {
  type: String,
  enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
  default: "Trending",
},
  coordinates: {
    type: [Number],
    default: [0, 0]    // default rakho
  },
},


});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
