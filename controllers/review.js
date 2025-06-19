const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id); // ✅ Fetch the parent listing
  const newReview = new Review(req.body.review); // Create new review
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  console.log(newReview);
  await newReview.save(); // 
  // 
  // ave review
  await listing.save();   //
  req.flash("success","new review created");
  res.redirect(`/listings/${listing._id}`); // Redirect to show page
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","require deleted");
  res.redirect(`/listings/${id}`);
};