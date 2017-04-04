'use strict';

const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../../models/user');

module.exports = passport => {
  //serialization/deserialization of user for session..
  // serialize called when user logs in
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // deserialize the opposite, though explanation somewhat confusing:
  // takes the id stored in the session and we use that id to retrieve our user.
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    },
    function (token, tokenSecret, profile, cb) {
      process.nextTick(() => {
        User.findOrCreate(profile, function (err, user) {
          return cb(err, user);
        });
      });
    }
  ));
};
