const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const asyncWrap = require("./utils/asyncWrap");
const listingValidation = require("./validationSchema.js");

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

const validationListingData = (req, res, next) => {
  let result = listingValidation.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      400,
      result.error.details.map((el) => el.message).join(", "),
    );
  } else {
    next();
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("I am root");
});
//index route
app.get(
  "/listings",
  asyncWrap(async (req, res) => {
    let allListing = await Listing.find();
    if (!allListing) {
      return next(new ExpressError(404, "Listing is not found"));
    }
    res.render("listing/index.ejs", { allListing });
  }),
);
// add new listing form route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
// add listing route
app.post(
  "/listings",
  validationListingData,
  asyncWrap(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    if (!newListing) {
      return next(new ExpressError(401, "Listing is not create"));
    }
    await newListing.save();
    res.redirect("/listings");
  }),
);
// show in detail
app.get(
  "/listings/:id",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing is not found"));
    }
    res.render("listing/show.ejs", { listing });
  }),
);

//Edit form route
app.get(
  "/listings/:id/edit",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      return next(
        new ExpressError(404, "Listing not found while getting edit form page"),
      );
    }
    res.render("listing/edit.ejs", { listing });
  }),
);

//update listing
app.put(
  "/listings/:id",
  validationListingData,
  asyncWrap(async (req, res) => {
    let { id } = req.params;

    let data = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true, returnDocument: "after" },
    );
    if (!data) {
      return next(new ExpressError(500, "Listing is not updated"));
    }

    res.redirect(`/listings/${id}`);
  }),
);

app.delete(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    if (!deleteListing) {
      return next(new ExpressError(500, "Listing is not deleted"));
    }
    res.redirect("/listings");
  }),
);

app.all("*splat", (req, res, next) => {
  return next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some went wrong" } = err;
  res.status(status).render("listing/error.ejs", { message });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`);
});
