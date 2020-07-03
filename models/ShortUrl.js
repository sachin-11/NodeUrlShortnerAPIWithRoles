const mongoose = require('mongoose')
const shortId = require('shortid')
const Roles = require('./../models/Roles');
const User =  require('./../models/User');

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
   required: true
  },
  short: {
    type: String,
     required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
})

shortUrlSchema.pre("save", async  function(next) {
  var self = this;  
  console.log('self.user : ', self.user);
  
  const userId =  await User.findById(self.user).populate('roles').exec();
  console.log('-----------userId/n',userId);
  
  const isAdmin = userId.roles.map((role) => role.name).includes('admin');
  if(!isAdmin) {
     console.log('------------- All ');   
     const shortId = await mongoose.model('ShortUrl').findOne({ user: self.user._id})   
     if(shortId) {
        console.log('------------- One ');
        return next(new Error("URL already created by this user"));
    } 
  } 
  next();
})




module.exports = mongoose.model('ShortUrl', shortUrlSchema, 'shorturls')