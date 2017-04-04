'use strict';

const mongoose = require('mongoose');

const Image = require('./image');

const userSchema = new mongoose.Schema({
  twitterID: { type: String, required: true },
  twitterScreenName: { type: String, required: true },
  twitterProfileImage: { type: String, required: true },
  heartedBricks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});

userSchema.statics.findOrCreate = function (profile, cb) {
  var newUser = new this();

  this.findOne({ twitterID: profile.id }, function (err, result) {
    if (err) throw err;
    if (!result) {
      newUser.twitterID = profile.id; // do I need to save token and token secret?
      newUser.twitterScreenName = profile.username;
      newUser.twitterProfileImage = profile._json.profile_image_url_https;
      
      newUser.save(cb); // interesting statement
    }
    else cb(err, result);
  });
};





module.exports = mongoose.model('User', userSchema);
