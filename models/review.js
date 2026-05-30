const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: String,
  rating: {
    type: String,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
