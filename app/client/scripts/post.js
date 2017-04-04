'use strict';

var socket = io();

window.onload = function () {
  // socket io logic:
  if (location.pathname.match(/^\/$/)) // if home path
    socket.emit('change room', { room: location.pathname }); // '/'

  else socket.emit('change room', { room: location.pathname.toLowerCase().slice(1) });

/****************/   

  if (location.pathname.match(/^\/$/)) {
    // make an ajax call to load all images?
    fetch('/api/allbricks', { method: 'GET' })
      .then(res => res.json())
      .then(json => {

        console.log('hi');
        console.log(json);
        // load images with masonry
      })
      .catch(err => console.log(err));
  }

};


