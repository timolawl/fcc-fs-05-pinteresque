'use strict';

const Controller = require('./controllers/controller');

module.exports = (app, passport) => {

  const controller = new Controller();

  app.route('/')
    .get(controller.getAllEsques);
 
  app.route('/addesque')
    .get(isLoggedIn, controller.getAddEsque)
    .post(isLoggedIn, controller.postEsque);

  app.route('/myesques')
    .get(isLoggedIn, controller.getMyEsques);

  app.route('/heartedesques')
    .get(isLoggedIn, controller.getHeartedEsques);

  // esques of other users
  app.route('/user/:id')
    .get(controller.getUserEsques);


  // ajax endpoint
  app.route('/api/esques')
    .get(controller.ajaxEsques)
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

