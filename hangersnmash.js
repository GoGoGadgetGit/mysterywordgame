const express = require('express');
const mustache = require('mustache-express');
const session = require('express-session');
const fs = require('fs');
const bodyparser = require('body-parser');


const server = express();

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

server.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

server.use(bodyparser.urlencoded({ extended: false }));

server.get('/', function (req, res) {
  // Initial setup for the user
  if (req.session.word === undefined) {
    req.session.word = words[Math.floor(Math.random() * words.length)];
    req.session.mystery = [];
    req.session.tries = 0;
    // let tries = 0;

      console.log(req.session.word);

    for (let i = 0; i < req.session.word.length; i++){
      req.session.mystery.push('_');
    }
  }

  res.render('home', {
    letters: req.session.mystery,
    theGuesses: req.session.tries,
    guessedLetters: req.body.letter,
  });
});

server.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
});

server.post('/guess', function (req, res) {

  let correct = false;

for (let i = 0; i < req.session.word.length; i++){
  // Is the guess the same as each letter in the word?
  if (req.body.letter === req.session.word[i]){
    req.session.mystery[i] = req.body.letter;
    correct = true;
  }
};

if (correct === false){
  req.session.tries ++
};

if (req.session.tries === 8){
  req.session.destroy()
};

// console.log(req.session.tries);
  res.redirect('/');
});

server.listen(4040, function () {
  console.log('No more wire hangers')
});
