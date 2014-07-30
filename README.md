Sudoku.Web
==========

A sudoku app that's touch friendly. It's designed so that you select a square and then the valid moves pop up, so it's easy to play on your phone. (A lot of other approaches use `<input>` which requires popping up the keyboard)

This is built without using any constraining frameworks that make assumptions for you. Simple JQuery plugin with some basic click functionality. :D

Live Version: http://freeqaz.com/public/sudoku/

Install Instructions
===============

1. Install node.js and npm (just google it)
2. Install bower: `npm install -g bower`
2. Install gulp: `npm install -g gulp`
3. Clone repo and open shell in directory
  * `npm install`
  * `bower install`
4. Build app by invoking gulp: `gulp`
5. Run web server (simple node file server): `node server.js`
6. Connect to `localhost:8080`
7. Get some iced tea and chill out, because sudoku is hard!

Screenshot
==========
![Alt text](/sudokuscreenshot.png?raw=true "Screenshot")

Todo Wishlist
===============
* ~~Fully responsive layout (Swap CSS, probably)~~ (Could still be better though)
* Save game state to local storage when you move
* Switch to using a templating engine and replace the `<table>`

Technical Notes
===============
I chose to use JQuery's plugin capability to populate the sudoku grid. It's pretty easy and allows you to have a clear structure to your code.

There are two files:

* sudoku.js, which holds all of the logic for the board. This is a fork of robatron's sudoku repo. Used his implementation to generate the puzzle (why roll my own?) which I built on top of by adding a few utility functions. He's an obvious non-JS guy so I had to clean up a few things.
* app.js, this is the juicy bit. This actually creates the HTML and contains the UI interaction logic. It uses JQuery and Underscore. I might switch to Jade or Handlebars for the board's HTML, since doing it in pure JS is a bit of a hassle.

For the CSS, it's pretty basic. There's some media query bits for handling a responsive layout and otherwise... It's just CSS. This app isn't complicated enough that SASS/LESS would really provide tangible benefits.
