const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListing = await Listing.find();
  if (!allListing) {
    return next(new ExpressError(404, "Listing is not found"));
  }
  res.render("listing/index.ejs", { allListing });
};

module.exports.addListing = async (req, res, next) => {
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user?._id;
  if (!newListing) {
    return next(new ExpressError(401, "Listing is not create"));
  }
  await newListing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

module.exports.showInDetailListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.editFormPage = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;

  let data = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, returnDocument: "after" },
  );
  if (!data) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  if (!deleteListing) {
    return next(new ExpressError(500, "Listing is not deleted"));
  }
  req.flash("success", "Listing Deleted successfully");
  res.redirect("/listings");
};
