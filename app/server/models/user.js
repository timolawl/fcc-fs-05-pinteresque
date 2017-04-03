'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const userSchema = new mongoose.Schema({
  twitterID: { type: String, required: true },
  twitterDisplayName: { type: String, required: true },
  twitterProfileImage: { type: String, required: true }
});

userSchema.statics.findOrCreate = function (profile, cb) {
  var newUser = new this();

  this.findOne({ twitterID: profile.id }, function (err, result) {
    if (err) throw err;
    if (!result) {
      newUser.twitterID = profile.id; // do I need to save token and token secret?
      newUser.twitterDisplayName = profile.displayName;
      
      newUser.save(cb); // interesting statement
    }
    else cb(err, result);
  });
};





module.exports = mongoose.model('User', userSchema);
