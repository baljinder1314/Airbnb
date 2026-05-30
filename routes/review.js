const { Router } = require("express");
const asyncWrap = require("../utils/asyncWrap");
const { listing, review } = require("../validationSchema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {
  validationReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/isLoggedIn.js");
const  reviewControllers  = require("../controllers/review.js");

const reviewRouter = Router({ mergeParams: true });

// Add review
reviewRouter.post(
  "/",
  isLoggedIn,
  validationReview,
  asyncWrap(reviewControllers.showReviews),
);

//DELETE review
reviewRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewControllers.deleteReview),
);

module.exports = reviewRouter;
