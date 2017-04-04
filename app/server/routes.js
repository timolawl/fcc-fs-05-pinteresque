'use strict';

const Controller = require('./controllers/controller');

module.exports = (app, passport) => {

  const controller = new Controller();

  app.route('/')
    .get(controller.getAllBricks);
  /*
    .get((req, res) => {
      if (req.isAuthenticated())
      // join main socket io room (this room is needed as at this level, polls can be added and deleted at will) and any previous room
        res.render('bricks', { loggedIn: true, path: 'index' }); //loggedIn still needed to not display the 'sign up' button
      else res.render('bricks', { path: 'index' });
    });
    */

  app.route('/addbrick')
    .get(isLoggedIn, controller.getAddBrick)
    .post(isLoggedIn, controller.postBrick);

  app.route('/mybricks')
    .get(isLoggedIn, controller.getMyBricks);

  app.route('/heartedbricks')
    .get(isLoggedIn, controller.getHeartedBricks);

  // api paths for ajax calls

  app.route('/api/allbricks') // login status matters, as own img can be deleted and all hearted
    .get(controller.ajaxAllBricks);
  
  app.route('/api/mybricks')
    .get(controller.ajaxMyBricks);

  app.route('/api/heartedbricks')
    .get(controller.ajaxHeartedBricks);



  app.route('/login/twitter')
    .get(passport.authenticate('twitter'));

  app.route('/login/twitter/callback')
    .get(passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));
  
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });


  app.use((req, res) => {
    if (req.isAuthenticated())
      res.render('404', { loggedIn: true, path: '404' });
    else res.render('404', { loggedIn: false, path: '404' });
  });
  //app.use((req, res) => { res.status(400).send('Bad request.'); });
};

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) // isAuthenticated is a passport JS add-on method
    return next();
  res.redirect('/');
}
/*
function isNotLoggedIn (req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/mybookshelf');
  else return next();
}
*/

