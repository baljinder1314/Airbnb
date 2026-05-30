const Listing = require("../models/listing");
const Review = require("../models/review");

const { listing, review } = require("../validationSchema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.currUrl = req.originalUrl;
    req.flash("error", "You must be Login to Create Post");
    return res.redirect("/login");
  }
  next();
};

module.exports.currUrlIs = (req, res, next) => {
  if (req.session.currUrl) {
    res.locals.currUrl = req.session.currUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing?.owner?.equals(res.locals.currUser?._id)) {
    req.flash("error", "You are not owner of this Listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validationListingData = (req, res, next) => {
  let result = listing.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      400,
      result.error.details.map((el) => el.message).join(", "),
    );
  } else {
    next();
  }
};

module.exports.validationReview = (req, res, next) => {
  let result = review.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      400,
      result.error.details.map((el) => el.message).join(", "),
    );
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review?.author?.equals(res.locals.currUser?._id)) {
    req.flash("error", "You are not author of this Review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
