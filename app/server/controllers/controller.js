'use strict'

const User = require('../models/user');
const Image = require('../models/image');

function controller () {

  this.getAllEsques = (req, res) => {
    // need socket if I want to push the changes not just to myself but to others
    // but if that seems like something that is not necessary, then traditional ajax will do
    // methodology seems to be to fetch 
    // I can pass all the information down, but how to render?
    // or do I ajax from the client side script based on the page?
    if (req.isAuthenticated()) {
      res.render('esques', { loggedIn: true, path: 'index' });
    }
    else res.render('esques', { loggedIn: false, path: 'index' });
  };

  this.getAddEsque = (req, res) => {
    res.render('form', { loggedIn: true });
  };
  
  this.postEsque = (req, res) => {
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

  this.getMyEsques = (req, res) => {
    res.render('esques', { loggedIn: true, path: 'myesques' });
  };

  this.getHeartedEsques = (req, res) => {
    res.render('esques', { loggedIn: true, path: 'heartedesques' });
  };


  this.getUserEsques = (req, res) => {
    if (req.isAuthenticated()) {
      res.render('esques', { loggedIn: true, path: 'useresques' });
    }
    else res.render('esques', { loggedIn: false, path: 'useresques' });
  };


  this.ajaxEsques = (req, res) => {
    // match https://timolawl-imgesque.herokuapp.com/
    // but in dev, match localhost:x000/
    // referer can be spoofed but this is a public get call
    const sanitizedReferer = sanitizeString(req.headers.referer);
    
    const path = sanitizedReferer.match(/^https:\/\/timolawl-pinteresque\.herokuapp\.com(.*)$/i) && sanitizedReferer.match(/^https:\/\/timolawl-pinteresque\.herokuapp\.com(.*)$/i)[1].toLowerCase();
/*
    const path = sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i) && 
      sanitizedReferer.match(/^http:\/\/localhost:[35]000(.*)$/i)[1].toLowerCase();
*/
    let dbQuery = null;

    if (path) {

      if (path.match(/^\/$/)) {
        dbQuery = {};
      } else if (path.match(/^\/myesques\/?$/i)) {
        dbQuery = { linker: req.user.id };
      } else if (path.match(/^\/heartedesques\/?$/i)) {
        User.findOne({ _id: req.user.id }).then(user => {
            Image.find({ _id: { $in: user.heartedEsques }}).lean().then(images => {
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
                if (user.heartedEsques.indexOf(image._id) > -1) { // exists as a hearted esque
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
    User.findOne({ $and: [{ _id: req.user.id }, { heartedEsques: { $nin: [req.body.id] }}]}).exec().then(user => {
      if (user) {
        user.heartedEsques.push(req.body.id); // add the image to be hearted by user
        user.save();
        Image.findOneAndUpdate({ _id: req.body.id }, { $inc: { hearts: 1 }}, { new: true }).then(image => res.json(image))
        .catch(err => console.error(err));
      }
      else { // user has already hearted the esque
        User.findOneAndUpdate({ _id: req.user.id }, { $pull: { heartedEsques: req.body.id }}, { returnNewDocument: true }, err => {
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
      User.update({ heartedEsques: { $in: [req.body.id] }}, { $pull: { heartedEsques: req.body.id}}, { multi: true }, (err) => {
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
