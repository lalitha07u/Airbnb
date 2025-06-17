const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

// SIGNUP FORM
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SIGNUP LOGIC
router.post("/signup", wrapAsync(async (req, res) => {  
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
            return next(err);
            }
        })
         req.flash("success", "Welcome to Wanderlust!");
         res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// LOGIN LOGIC
router.post("/login", saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    console.log("login successfull!");
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.login(registeredUser, (err) => {
    if (err) {
        return next(err);
    }
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
});
   
});

module.exports = router;  