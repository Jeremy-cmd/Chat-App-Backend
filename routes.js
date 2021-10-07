require('dotenv').config();
const express = require("express");
const User = require("./user.js");
const Message = require("./messages.js");
const extend = require("lodash/extend");

const router = express.Router();
const authorize = require("./authRoutes.js");


router.route("/users")


  // lists all users
.get(async (req, res) => {

  try{
    const users = await User.find().select('name email updated created');
    res.json(users);

  }catch(err){
    return res.status(400).json({
      error: "error getting all users"
    });

  }

})


  // create new user and register
.post(async (req, res) => {

  if(req.body.password.length < 6){
    return res.status(400).json({
      message: "password must be at least a length of 6"
    });
  }

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  try{
    await user.save();
    return res.status(200).json({
      message: "Succesfully signed up!"
    })
  }catch(err){
    return res.status(400).json({
      error: "error signing in"
    })
  }

});

router.route("/users/:userId")


// get a specific user by their id
.get(authorize.jwtRequirement, (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
})


// update a specific user by their id
.put(authorize.jwtRequirement, authorize.isAuthorized, async (req, res) => {
  try{
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.password = undefined;
    res.json(user);

  }catch(err){
    return res.status(400).json({
      error: "error updating user"
    });

  }

})


// deletes a user
.delete(authorize.jwtRequirement, authorize.isAuthorized, async (req, res) => {
  try{
    let user = req.profile;
    let removedUser = await user.remove();
    removedUser.password = undefined;
    res.json(removedUser);


  }catch(err){
    res.status(400).json({
      error: "Couldn't remove user"
    })

  }

});

// gets a user by their id
const getUserId = async (req, res, next, id) => {

  try{
    console.log(id);

    let user = await User.findById(id);
    console.log("user: " + user);
    if(!user){
      return res.status(400).json({
        error: "user not found"
      });
    }
    
      req.profile = user;
      console.log("req.profile: " + req.profile);
      next();


  }catch(err){
    return res.status(400).json({
      error: "couldn't get user"
    })
  }


};

router.param('userId', getUserId);

// export default router;
module.exports = router;
