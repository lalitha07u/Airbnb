const mongoose = require("mongoose");
const Review = require("./review.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: {
      type: String,
      required: false   // ✅ Optional
    },
    filename: {
      type: String,
      required: false   // ✅ Optional
    }
  }, // ✅ <-- Comma added here

  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Middleware: Cascade delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Export the model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
