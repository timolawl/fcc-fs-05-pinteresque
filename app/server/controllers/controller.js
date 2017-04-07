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
    // save the new image information to image collection
    const newImage = new Image();
    newImage.link = req.body.link;
    newImage.linker = req.user.id;
    newImage.linkerScreenName = req.user.twitterScreenName;
    newImage.linkerProfileImage = req.user.twitterProfileImage;
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
    // referer can be spoofed but this is a public get call
    const sanitizedReferer = sanitizeString(req.headers.referer);
    /*
    if (sanitizedReferer.match(/^https:\/\/timolawl-imgbrick\.herokuapp\.com\//) ||
      sanitizedReferer.match(/^http:\/\/localhost:[35]000\//)) {
      
    }*/

    const path = sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i) && 
      sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i)[1].toLowerCase();

    let dbQuery = null;

    if (path) {

      if (path.match(/^\/$/)) {
        dbQuery = {};
      } else if (path.match(/^\/mybricks\/?$/i)) {
        dbQuery = { linker: req.user.id };
      } else if (path.match(/^\/heartedbricks\/?$/i)) {
        User.findOne({ _id: req.user.id }).then(user => {
            Image.find({ _id: { $in: user.heartedBricks }}).lean().then(images => {
              res.json(images.map(image => { image.userHearted = true; return image; }));
            });
        });
      } else if (path.match(/^\/user\/.*/i)) {
        let user = path.match(/^\/user\/(.*)/i) && path.match(/^\/user\/(.*)/i)[1];
        if (user) {
          dbQuery = { linkerScreenName: user };
        }
      }

      // if path is not the hearted path:
      if (dbQuery) {
        // if user is logged in:
        if (req.user) {
          User.findOne({ _id: req.user.id }).then(user => {
            Image.find(dbQuery).lean().then(images => {
              res.json(images.map(image => {
                if (user.heartedBricks.indexOf(image._id) > -1) { // exists as a hearted brick
                  image.userHearted = true;
                }
                return image;
              }));
            });
          });
        }
        // user is not logged in:
        else {
          Image.find(dbQuery).then(images => res.json(images));
        }
      }

    }
  };

  this.ajaxHeart = (req, res) => {
    User.findOne({ $and: [{ _id: req.user.id }, { heartedBricks: { $nin: [req.body.id] }}]}).exec().then(user => {
      if (user) {
        user.heartedBricks.push(req.body.id); // add the image to be hearted by user
        user.save();
        Image.findOneAndUpdate({ _id: req.body.id }, { $inc: { hearts: 1 }}, { new: true }).then(image => res.json(image))
        .catch(err => console.error(err));
      }
      else { // user has already hearted the brick
        User.findOneAndUpdate({ _id: req.user.id }, { $pull: { heartedBricks: req.body.id }}, { returnNewDocument: true }, err => {
          if (err) throw err;
            Image.findOneAndUpdate({ _id: req.body.id }, { $inc: { hearts: -1 }}, { new: true }).then(image => res.json(image));
        });
      }
    })
    .catch(err => console.error(err));
  };

  this.ajaxDelete = (req, res) => {
    // validate user ability to remove image first
    Image.findOneAndRemove({ $and: [{ _id: req.body.id }, { linker: req.user.id }]}).exec().then(image => {
      // go through all users and remove their hearts from this item since it no longer exists
      User.update({ heartedBricks: { $in: [req.body.id] }}, { $pull: { heartedBricks: req.body.id}}, { multi: true }, (err) => {
        if (err) throw err;
        else res.json({ message: 'success'});
      });
    })
    .catch(err => console.error(err)); 
  };


}


function sanitizeString (str) {
  return str.replace(/\$/g, '');
}


module.exports = controller;
