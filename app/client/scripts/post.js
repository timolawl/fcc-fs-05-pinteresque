'use strict';

window.onload = function () {
  if (!location.pathname.match(/^\/addesque\/?$/i)) {
    fetch('/api/esques', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(json => loadImages(json))
      .catch(err => console.error(err));
  }
};

// load images from json
function loadImages (data) {
  const esques = new DocumentFragment();

  for (let i = 0; i < data.length; i++) {
    createEsque(data[i], esques);
  }

  const allImages = esques.querySelectorAll('.esque__image, .esque__user');
  imagesLoaded(allImages, () => {
    const container = document.querySelector('.wrapper--esquewall');
    container.appendChild(esques);

    const msnry = new Masonry(container, {
      itemSelector: '.masonry-element',
      columnWidth: '.masonry-element-sizer',
      percentPosition: true
    });

  });
}

function createEsque (datum, fragment) {
  const newEsque = document.querySelector('.masonry-element').cloneNode(true);

  const counter = newEsque.querySelector('.esque__counter');
  const heartFill = newEsque.querySelector('.esque__heart--fill');
  const image = newEsque.querySelector('.esque__image');
  const user = newEsque.querySelector('.esque__user');

  newEsque.firstChild.setAttribute('data-id', datum._id);
  image.src = datum.link;
  image.title = datum.title;
  image.alt = datum.title;
  newEsque.querySelector('.esque__title').textContent = datum.title;
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

  // send: the id of the esque, the user can be inferred from the req itself.
  newEsque.querySelector('.esque__favorite').addEventListener('click', () => {
    fetch('/api/esques', { method: 'POST', credentials: 'same-origin' , headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: datum._id }) })
      .then(res => res.json())
      .then(json => {
        counter.textContent = json.hearts;
        heartFill.classList.toggle('is-hearted');
      })
      .catch(err => console.error(err));
  });


  if (newEsque.querySelector('.esque__close')) { // or check if path is myesques
    newEsque.querySelector('.esque').addEventListener('mouseover', () => {
      newEsque.querySelector('.esque__close').classList.add('is-displayed');
    });

    newEsque.querySelector('.esque').addEventListener('mouseout', () => {
      newEsque.querySelector('.esque__close').classList.remove('is-displayed');
    });

    newEsque.querySelector('.esque__close').addEventListener('click', () => {
      fetch('/api/esques', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'POST, GET, DELETE' }, body: JSON.stringify({ id: datum._id }) })
        .then(res => res.json())
        .then(json => {
          // remove the entire element from the displayi
          if (json.message === 'success') {
            newEsque.parentNode.removeChild(newEsque);
          }
        })
        .catch(err => console.error(err));
    });
  }

  fragment.appendChild(newEsque);

  

  //document.querySelector('.wrapper--esques').insertBefore(newEsque, document.querySelector('.masonry-element-sizer'));
  newEsque.classList.remove('is-not-displayed');
}

