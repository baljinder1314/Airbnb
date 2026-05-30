const { Router } = require("express");
const asyncWrap = require("../utils/asyncWrap");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {
  isLoggedIn,
  isOwner,
  validationListingData,
} = require("../middleware/isLoggedIn.js");
const listingControllers = require("../controllers/listing.js");

const router = Router();

router.get("/", asyncWrap(listingControllers.index));
// add new listing form route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});
// add listing route
router.post(
  "/",
  validationListingData,
  asyncWrap(listingControllers.addListing),
);
// show in detail
router.get("/:id", asyncWrap(listingControllers.showInDetailListing));

//Edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrap(listingControllers.editFormPage),
);

//update listing
router.put(
  "/:id",
  validationListingData,
  asyncWrap(listingControllers.editListing),
);
//Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  asyncWrap(listingControllers.deleteListing),
);

module.exports = router;
