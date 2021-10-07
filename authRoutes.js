require('dotenv').config();
const express = require("express");
const bcrypt  = require("bcrypt");
const router = express.Router();
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const User = require("./user.js");

router.route("/auth/signin")
.post(async (req, res) => {

  try{
    let user = await User.findOne({ "email": req.body.email });
    if(!user){
      return res.status('401').json({ error: "User not found" });
    }
    let password = req.body.password;
    if(!bcrypt.compareSync(password, user.password)){
      // wrong password
      return res.status(400).json({
        error: "Password does not match"
      });
    }
    // correct Password
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.cookie('t', token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  }catch(err){
    return res.status(400).json({
      error: "Could not sign in"
    });

  }


});

router.route("/auth/signout")
.get((req, res) =>{
  res.clearCookie("t");
  return res.status(200).json({
    message: "User is signed out"
  });

});

const jwtRequirement = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
});

const isAuthorized = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!authorized){
    return res.status(403).json({
      error: "user is not authorized"
    });
  }
  next();

}

// export default router;
module.exports = { router, jwtRequirement, isAuthorized };
