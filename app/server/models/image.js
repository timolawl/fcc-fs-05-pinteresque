'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const imageSchema = new mongoose.Schema({
  link: { type: String, required: true },
  linker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  linkerScreenName: { type: String, required: true },
  linkerProfileImage: { type: String, required: true },
  title: { type: String, required: true },
  hearts: { type: Number, default: 0 } // need to specify uniqueness of hearts
  // but it's better to have the save on the user because then exposure of a brick
  // will not compromise multiple users.
  // hearting once means it cannot be hearted again by the same user
});

module.exports = mongoose.model('Image', imageSchema);
