const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.showReviews = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const addReview = new Review(req.body.review);
  addReview.author = req.user._id;

  listing.reviews.push(addReview);

  await addReview.save();
  await listing.save();

  req.flash("success", "Review created successfully");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { returnDocument: "after" },
  );

  const deleteReview = await Review.findByIdAndDelete(reviewId);

  if (!listing || !deleteReview) {
    return next(new ExpressError(500, "Review is not deleted"));
  }

  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
