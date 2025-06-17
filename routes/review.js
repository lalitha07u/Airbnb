const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to access :id from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js");

// POST route to create a review
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id); // ✅ Fetch the parent listing
  const newReview = new Review(req.body.review); // Create new review
  listing.reviews.push(newReview); // Push into listing.reviews array
  await newReview.save(); // Save review
  await listing.save();   //
  req.flash("success","new review created");
  res.redirect(`/listings/${listing._id}`); // Redirect to show page
}));

// DELETE route to remove a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","require deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
