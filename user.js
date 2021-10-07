require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({

      name: {
       type: String,
       trim: true,
       required: true
     },

     email: {
       type: String,
       trim: true,
       unique: 'Email already exists',
       match: [/.+\@.+\..+/, 'Please fill a valid email address'],
       required: true
    },

    created: {
       type: Date,
       default: Date.now
    },
    updated: Date,

    password: {
       type: String,
       trim: true,
       required: true
    }

});

userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});



// export default mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);
module.exports = User;
