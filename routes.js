require('dotenv').config();
const express = require("express");
const User = require("./user.js");
const Message = require("./messages.js")

const router = express.Router();

router.route("/users")

.get(async (req, res) => {

});

.post((req, res) => {
  

});

router.route("/users/:userId")

.get((req ,res) => {

})

.put((req, res) => {

})


.delete((req, res) => {

});

export default router;
