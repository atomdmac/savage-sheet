var Bind = require('bind.js');
var Die = require('./die');
var sampleJSON = require('../json/sample');
var storage = window.localStorage;

var char = storage.get('char');
if(char !== undefined) {
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
  quote: '.character-profile .quote'//,
  // skills: {
  //   dom: '.character-profile .skills',
  //   transform: function () {}
  // }
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