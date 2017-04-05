'use strict';

window.onload = function () {
  if (!location.pathname.match(/^\/addbrick\/?$/i)) {
    fetch('/api/bricks', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => loadImages(json))
      .catch(err => console.error(err));
  }
};

// load images from json
function loadImages (data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    createBrick(data[i]);
  }
}

function createBrick (datum) {
  const newBrick = document.querySelector('.masonry-element').cloneNode(true);
  console.log(newBrick);

  const counter = newBrick.querySelector('.brick__counter');
  const heartFill = newBrick.querySelector('.brick__heart--fill');

  newBrick.firstChild.setAttribute('data-id', datum._id);
  newBrick.querySelector('.brick__image').src = datum.link;
  newBrick.querySelector('.brick__image').title = datum.title;
  newBrick.querySelector('.brick__image').alt = datum.title;
  newBrick.querySelector('.brick__title').textContent = datum.title;
  newBrick.querySelector('.brick__user').src = datum.linkerProfileImage;
  newBrick.querySelector('.brick__user').title = '@' + datum.linkerScreenName;
  newBrick.querySelector('.brick__user').alt = '@' + datum.linkerScreenName;
  counter.textContent = datum.hearts;

  // send: the id of the brick, the user can be inferred from the req itself.
  newBrick.querySelector('.brick__favorite').addEventListener('click', () => {
    fetch('/api/bricks', { method: 'POST', credentials: 'same-origin' , headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: datum._id }) })
      .then(res => res.json())
      .then(json => {
        counter.textContent = json.hearts;
        heartFill.classList.toggle('is-hearted');
      })
      .catch(err => console.error(err));
  });


  if (newBrick.querySelector('.brick__close')) { // or check if path is mybricks
    newBrick.querySelector('.brick__close').addEventListener('click', () => {
      fetch('/api/bricks', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'POST, GET, DELETE' }, body: JSON.stringify({ id: datum._id }) })
        .then(res => res.json())
        .then(json => {
          // remove the entire element from the displayi
          if (json.message === 'success') {
            newBrick.parentNode.removeChild(newBrick);
          }
        })
        .catch(err => console.error(err));
    });
  }

  document.querySelector('.wrapper--bricks').insertBefore(newBrick, document.querySelector('.masonry-element-sizer'));
  newBrick.classList.remove('is-not-displayed');
}

