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
      res.render('bricks', { loggedIn: true, path: 'index' });
    }
    else res.render('bricks', { loggedIn: false, path: 'index' });
  };

  this.getAddBrick = (req, res) => {
    res.render('form', { loggedIn: true });
  };
  
  this.postBrick = (req, res) => {
    console.log(req.user.twitterScreenName);
    // save the new image information to image collection
    const newImage = new Image();
    newImage.link = req.body.link;
    newImage.linker = req.user.id;
    newImage.title = req.body.title;
    
    newImage.save(err => {
      if (err) throw err;
      else {
        res.redirect('/');
      }
    });
  };

  this.getMyBricks = (req, res) => {
    res.render('bricks', { loggedIn: true, path: 'mybricks' });
  };

  this.getHeartedBricks = (req, res) => {
    res.render('bricks', { loggedIn: true, path: 'heartedbricks' });
  };


  this.getUserBricks = (req, res) => {
    if (req.isAuthenticated()) {
      res.render('bricks', { loggedIn: true, path: 'userbricks' });
    }
    else res.render('bricks', { loggedIn: false, path: 'userbricks' });
  };


  this.ajaxBricks = (req, res) => {
    // match https://timolawl-imgbrick.herokuapp.com/
    // but in dev, match localhost:x000/
    // validate the referrer first?
    console.log(req.headers.referer);
    const sanitizedReferer = req.headers.referer.replace(/\$/g, '');
    /*
    if (sanitizedReferer.match(/^https:\/\/timolawl-imgbrick\.herokuapp\.com\//) ||
      sanitizedReferer.match(/^http:\/\/localhost:[35]000\//)) {
      
    }*/

    const path = sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i) && 
      sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i)[1].toLowerCase();

    console.log(path);

    if (path) {
      if (path.match(/^\/$/)) {
        Image.find({}).then(images => res.json(images));
      } else if (path.match(/^\/mybricks\/?$/i)) {
        Image.find({ linker: req.user.id }).then(images => res.json(images));
      } else if (path.match(/^\/heartedbricks\/?$/i)) {
        User.findOne({ _id: req.user.id }).then(user => {
            Image.find({ _id: { $in: user.heartedBricks }}).then(images => res.json(images));
        });
      } else if (path.match(/^\/user\/.*/i)) {
        let user = path.match(/^\/user\/(.*)/i) && path.match(/^\/user\/(.*)/i)[1];
        if (user) {
          User.findOne({ twitterScreenName: user }).then(user => {
            Image.find({ linker: user._id }).then(images => res.json(images));
          });
        }
      }
    }
  };


  // api paths for ajax calls
  this.ajaxAllBricks = (req, res) => {
    console.log(req);
    // this call needs to return all bricks
    // actually, i don't it's needed is it?
    // I mean I could potentially highlight which ones belong to the user
    /*
    if (req.isAuthenticated()) {
      User.findOne({ _id: req.user.id }).exec().then(user => {
        res.json(user);
      });
    } 
    */
    Image.find({}).then(images => {
      // provide only the needed information:
      // image, hearts, and linker screen_name and profile picture
      // clicking on the linker picture will go to the user's images
      // at /screen_name
      res.json(images);
    });

  };

  this.ajaxMyBricks = (req, res) => {
    console.log(req.headers.referer);
  
  };

  this.ajaxHeartedBricks = (req, res) => {
    
  };

  this.ajaxUserBricks = (req, res) => {    
    // sanitize this first then use it:
    const sanitizedId = req.params.id.replace(/\$/g, '');
    User.findOne({ twitterScreenName: sanitizedId }).then(user => {
      Image.find({ linker: user }).then(images => {
        res.json(images);
      });
    });
  };
  

}

module.exports = controller;
