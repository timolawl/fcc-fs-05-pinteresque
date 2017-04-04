'use strict';

const mongoose = require('mongoose');

module.exports = io => {

  // acting as route and controller here.
  // the structured formatting would help for sure..
  

  io.on('connection', function (socket) {
    // this only works if the user is already registered and logged in:
    let userID;

    if (socket.request.session.passport) {
      userID = socket.request.session.passport.user;
    }

    // socket rooms
    socket.on('leave room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
    });

    socket.on('change room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
      socket.room = data.room;
      socket.join(socket.room);
    });
  });
};
