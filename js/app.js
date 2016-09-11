var Bind = require('bind.js');
var Die = require('./die');
var sampleJSON = require('../json/sample');
var storage = window.localStorage;

var char = storage.getItem('char');
if(char !== null) {
  char = JSON.parse(char);
} else {
  char = sampleJSON;
}
// Bind UI to Data.
var uiBinding = Bind(char, {
  name: '.character-profile .name',
  profession: '.character-profile .profession',
  concept: '.character-profile .concept',
  setting: '.character-profile .setting',
  quote: '.character-profile .quote',
  rank: {
    dom: '.character-profile .rank',
    transform: function (value) {
      var el = document.querySelectorAll('.rank option[value="' + value + '"]')[0];
      var rnk = document.querySelectorAll('.rank')[0];
      var indx = el.index;

      // HACK: Using a timeout so we can allow this func to return markup.
      setTimeout(function () {
        rnk.selectedIndex = indx;
      }, 1);

      return document.querySelectorAll('.rank')[0].innerHTML;
    }
  }
});

window.onbeforeunload = function () {
  storage.setItem('char', JSON.stringify(uiBinding));
};

// Die test.
var die = new Die('2d12wa'),
  total = 0, current;
for(var i=0; i<100; i++) {
  current = die.roll(true);
  total += current;
  // console.log(current);
}
// console.log('avg: ', Number(total / i));
// console.log(die.number, 'd', die.sides);