!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";function loadImages(data){console.log(data);for(var i=0;i<data.length;i++)createBrick(data[i])}function createBrick(datum){var newBrick=document.querySelector(".masonry-element").cloneNode(!0);console.log(newBrick);var counter=newBrick.querySelector(".brick__counter"),heartFill=newBrick.querySelector(".brick__heart--fill");newBrick.firstChild.setAttribute("data-id",datum._id),newBrick.querySelector(".brick__image").src=datum.link,newBrick.querySelector(".brick__image").title=datum.title,newBrick.querySelector(".brick__image").alt=datum.title,newBrick.querySelector(".brick__title").textContent=datum.title,newBrick.querySelector(".brick__user").src=datum.linkerProfileImage,newBrick.querySelector(".brick__user").title="@"+datum.linkerScreenName,newBrick.querySelector(".brick__user").alt="@"+datum.linkerScreenName,counter.textContent=datum.hearts,newBrick.querySelector(".brick__favorite").addEventListener("click",function(){fetch("/api/bricks",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:datum._id})}).then(function(res){return res.json()}).then(function(json){counter.textContent=json.hearts,heartFill.classList.toggle("is-hearted")}).catch(function(err){return console.error(err)})}),newBrick.querySelector(".brick__close")&&newBrick.querySelector(".brick__close").addEventListener("click",function(){fetch("/api/bricks",{method:"DELETE",credentials:"same-origin",headers:{"Content-Type":"application/json","Access-Control-Allow-Methods":"POST, GET, DELETE"},body:JSON.stringify({id:datum._id})}).then(function(res){return res.json()}).then(function(json){"success"===json.message&&newBrick.parentNode.removeChild(newBrick)}).catch(function(err){return console.error(err)})}),document.querySelector(".wrapper--bricks").insertBefore(newBrick,document.querySelector(".masonry-element-sizer")),newBrick.classList.remove("is-not-displayed")}window.onload=function(){location.pathname.match(/^\/addbrick\/?$/i)||fetch("/api/bricks",{credentials:"same-origin"}).then(function(res){return res.json()}).then(function(json){return loadImages(json)}).catch(function(err){return console.error(err)})}},{}]},{},[1]);
//# sourceMappingURL=post.bundle.js.map
