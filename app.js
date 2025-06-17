const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// ✅ Setup view engine
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); // fix here
  res.locals.currUser = req.user;
  next();
});

//app.get("/demouser", async (req,res) => {
//  let fakeUser = new User({
   // email: "student@gmail.com",
   // username: "delta-student",
  //});

 // let registeredUser = await User.register(fakeUser, "hellouser");
  //res.send(registeredUser);

//});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// Routes
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//app.get("/listings", wrapAsync(async (req, res) => {
//  const allListings = await Listing.find({});
//  res.render("listings/index", { allListings });
//}));

//app.get("/listings/new", (req, res) => {
//res.render("listings/new");
//});

//app.post(
  //"/listings",
  //validateListing,
  //wrapAsync(async (req, res) => {
    //const newListing = new Listing(req.body.listing);
    //await newListing.save();
    //res.redirect("/listings");
  //})
//);



//show route
//app.get("/listings/:id", wrapAsync(async (req, res) => {
 // const { id } = req.params;
  //const listing = await Listing.findById(id).populate("reviews");
  //res.render("listings/show.ejs", { listing });
//}));



//app.put(
//  "/listings/:id",
  //validateListing,
  //wrapAsync(async (req, res) => {
    //const { id } = req.params;
    //const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    //res.redirect(`/listings/${updatedListing._id}`);
  //})
//);


//reviews
//post route


// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on 8080");
});

