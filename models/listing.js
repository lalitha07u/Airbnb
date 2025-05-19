const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews.js");
const { reviewSchema } = require("../schema.js");


const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    type:Object,
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
module.exports = Listing;