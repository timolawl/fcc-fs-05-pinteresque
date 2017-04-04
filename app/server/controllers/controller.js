'use strict'

const User = require('../models/user');
const Image = require('../models/image');

function controller () {

  this.getAllBricks = (req, res) => {
    // need socket if I want to push the changes not just to myself but to others
    // but if that seems like something that is not necessary, then traditional ajax will do
    // methodology seems to be to fetch 
    // I can pass all the information down, but how to render?
    // or do I ajax from the client side script based on the page?
    if (req.isAuthenticated()) {
      console.log('wut wut');
      console.log(req);
      res.render('bricks', { loggedIn: true, path: 'index' });
    }
    else res.render('bricks', { loggedIn: false, path: 'index' });
  };

  this.getAddBrick = (req, res) => {
    res.render('form', { loggedIn: true });
  };
  
  this.postBrick = (req, res) => {
    // save the new image information to image collection
    //const newImage = new Image();
    //newImage.link = req.body.
    console.log(req.body);
    res.redirect('/', { loggedIn: true });
  };

  this.getMyBricks = (req, res) => {
    res.render('bricks', { loggedIn: true, path: 'mybricks' });
  };

  this.getHeartedBricks = (req, res) => {
    res.render('bricks', { loggedIn: true, path: 'heartedbricks' });
  };

  // api paths for ajax calls
  this.ajaxAllBricks = (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log('hello?');
      User.findOne({ _id: req.user.id }).exec().then(user => {
        res.json(user);
        //document.querySelector('.bricks').textContent = user.twitterScreenName;
      });
    }
    console.log('wut');
   // console.log(req);
  
  };

  this.ajaxMyBricks = (req, res) => {
  
  };

  this.ajaxHeartedBricks = (req, res) => {
    
  };

}

module.exports = controller;
