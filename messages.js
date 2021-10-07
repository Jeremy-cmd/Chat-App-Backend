require('dotenv').config();
const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true
  },

  to: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  created: {
    type: Date,
    default: Date.now
  },
  updated: Date

});

// export default mongoose.model("Message", messageSchema);
const Message = mongoose.model("Message", messageSchema);
module.exports = { Message };
