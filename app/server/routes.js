'use strict';

const Controller = require('./controllers/controller');

module.exports = (app, passport) => {

  const controller = new Controller();

  app.route('/')
    .get(controller.getAllBricks);
 
  app.route('/addbrick')
    .get(isLoggedIn, controller.getAddBrick)
    .post(isLoggedIn, controller.postBrick);

  app.route('/mybricks')
    .get(isLoggedIn, controller.getMyBricks);

  app.route('/heartedbricks')
    .get(isLoggedIn, controller.getHeartedBricks);

  // bricks of other users
  app.route('/user/:id')
    .get(controller.getUserBricks);


  // ajax endpoint
  app.route('/api/bricks')
    .get(controller.ajaxBricks)
    .post(isLoggedIn, controller.ajaxHeart)
    .delete(isLoggedIn, controller.ajaxDelete);



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

