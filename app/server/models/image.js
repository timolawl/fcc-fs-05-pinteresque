'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const imageSchema = new mongoose.Schema({
  link: { type: String, required: true },
  linker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  hearts: { type: Number, default: 0 };
});

module.exports = mongoose.model('Image', imageSchema);
