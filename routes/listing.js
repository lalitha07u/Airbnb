const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ ADD THIS MISSING ROUTE
router.get("/", wrapAsync(listingController.index));

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create a new listing
router.post(
  "/",
  isLoggedIn,
  upload.single("image"), // ✅ input name should be "image"
  validateListing,
  wrapAsync(listingController.createListing)
);

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Show, update, delete routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"), // ✅ file input must use name="image"
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

module.exports = router;
