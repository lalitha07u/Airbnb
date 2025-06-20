const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to access :id from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// POST route to create a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE route to remove a review
router.delete("/:reviewId",isLoggedIn, isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
