'use strict';

window.onload = function () {

  if (!location.pathname.match(/^\/addbrick\/?$/i)) {
    fetch('/api/bricks', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => loadImages(json))
      .catch(err => console.error(err));
  }
  


/*
  if (location.pathname.match(/^\/$/)) {
    // make an ajax call to load all images?
    fetch('/api/allbricks', { method: 'GET', credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        loadImages(json);
      })
      .catch(err => console.log(err));
  }

  if (location.pathname.match(/^\/mybricks\/?$/i)) {
    fetch('/api/mybricks', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => {
        loadImages(json);
      });
  }


  if (location.pathname.match(/^\/heartedbricks\/?$/i)) {
    fetch('/api/heartedbricks', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => {
        loadImages(json);
      });
  }


  if (location.pathname.match(/^\/user\/.*$/i)) {
    // extract pathname user screen name:
    const screenName = location.pathname.match(/^\/user\/(.*)$/)[1];

    fetch('/api/userbricks/' + screenName, { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => {
        loadImages(json);
      });
  }
*/
};


// load images from json
function loadImages (data) {
  console.log(data); 
}


//function create

