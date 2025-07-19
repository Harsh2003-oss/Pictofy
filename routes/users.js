const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Pintrest")


const userSchema = new mongoose.Schema({
 
  username: {
    type: String,
    required: true,
    unique: true,
  
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],

  dp: {
    type: String, // could be a URL or path to an image
  
  },
  email: {
    type: String,
   
    unique: true,
  
  },
  fullname: {
    type: String,
    required: true,
   
  }

});

userSchema.plugin(plm)

module.exports  = mongoose.model('User', userSchema);

