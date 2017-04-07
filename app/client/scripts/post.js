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
  const bricks = new DocumentFragment();

  for (let i = 0; i < data.length; i++) {
    createBrick(data[i], bricks);
  }

  const allImages = bricks.querySelectorAll('.brick__image, .brick__user');
  imagesLoaded(allImages, () => {
    const container = document.querySelector('.wrapper--bricks');
    container.appendChild(bricks);

    const msnry = new Masonry(container, {
      itemSelector: '.masonry-element',
      columnWidth: '.masonry-element-sizer',
      percentPosition: true
    });

  });
}

function createBrick (datum, fragment) {
  const newBrick = document.querySelector('.masonry-element').cloneNode(true);

  const counter = newBrick.querySelector('.brick__counter');
  const heartFill = newBrick.querySelector('.brick__heart--fill');
  const image = newBrick.querySelector('.brick__image');
  const user = newBrick.querySelector('.brick__user');

  newBrick.firstChild.setAttribute('data-id', datum._id);
  image.src = datum.link;
  image.title = datum.title;
  image.alt = datum.title;
  newBrick.querySelector('.brick__title').textContent = datum.title;
  user.src = datum.linkerProfileImage;
  user.title = '@' + datum.linkerScreenName;
  user.alt = '@' + datum.linkerScreenName;
  counter.textContent = datum.hearts;

  if (datum.userHearted) {
    heartFill.classList.add('is-hearted');
  }

  user.addEventListener('click', () => {
    location.href = `${location.protocol}//${location.host}/user/${datum.linkerScreenName}`;
  });

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
    newBrick.querySelector('.brick').addEventListener('mouseover', () => {
      newBrick.querySelector('.brick__close').classList.add('is-displayed');
    });

    newBrick.querySelector('.brick').addEventListener('mouseout', () => {
      newBrick.querySelector('.brick__close').classList.remove('is-displayed');
    });

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

  fragment.appendChild(newBrick);

  

  //document.querySelector('.wrapper--bricks').insertBefore(newBrick, document.querySelector('.masonry-element-sizer'));
  newBrick.classList.remove('is-not-displayed');
}

