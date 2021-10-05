require('dotenv').config();
const express = require("express");
const bcrypt  = require("bcrypt");

const router = express.Router();
const User = require("./user.js");

router.route("/auth/signin")
.post(async (req, res) => {
  let user = await User.findOne({ "email": req.body.email });
  if(!user){
    return res.status('401').json({ error: "User not found" });
  }
  let password = req.body.password;
  if(bcrypt.compareSync(password, user.password)){
    // correct password

  }
  else{
    // wrong password
  }
});

router.route("/auth/signout")
.get(async (req, res) =>{

});

export default router;
