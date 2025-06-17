const express = require("express");
const router = express.Router();
const users = require("./routes/user.js");

//index-users
router.get("/users", (req,res) => {
    res.send("get for users");
});

//show-users
router.get("/users/:id", (req,res) => {
    res.send("get for users id");
});
//post-users
router.get("/users", (req,res) => {
    res.send("post for users");
});
//delete
router.get("/users/:id", (req,res) => {
    res.send("delete for users");
});
 
module.exports=router;