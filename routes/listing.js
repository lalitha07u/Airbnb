const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

// Index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New listing form
router.get("/new",isLoggedIn, (req, res) => {
  console.log(req.user);
  
  res.render("listings/new.ejs");
});

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing) {
    req.flash("error","listing you requested doesn't exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

// Create listing
router.post("/",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
}));
//delete
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("deleted listing");
  req.flash("success","listing deleted");
  res.redirect("/listings");
}));

// Edit form
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","listing you requested doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error","you don't have permission to edit");
    return redirect(`/listings/${id}`);

  }
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  req.flash("success","listing updated");
  res.redirect(`/listings/${updatedListing._id}`);
}));

module.exports = router;
