var rivets = require('rivets');
var Die = require('./die');
var sampleJSON = require('../json/sample');
var storage = window.localStorage;

var char = storage.getItem('char');
if(char !== null) {
  char = JSON.parse(char);
} else {
  char = sampleJSON;
}

rivets.binders['die-list'] = {
  publishes: true,
  bind: function(el) {
    var publish = this.publish;
    el.querySelectorAll('input[type=radio]').forEach(function (radio) {
      radio.addEventListener('change', publish);
    });
  },

  unbind: function(el) {
    var publish = this.publish;
    el.querySelectorAll('input[type=radio]').forEach(function (radio) {
      radio.removeEventListener('change', publish);
    });
  },

  routine: function(el, value) {
    var radios = el.querySelectorAll('input[type=radio]');
    for(var i=0; i<radios.length; i++) {
      if(radios[i].value === value) radios[i].checked = true;
    }
  },

  getValue : function(el) {
    var radios = el.querySelectorAll('input[type=radio]');
    for(var i=0; i<radios.length; i++) {
      if(radios[i].checked)  {
        console.log(radios[i].value);
        return radios[i].value;
      }
    }
  }
};

// DEBUG
console.log(char);

// Bind UI to Data.
rivets.bind(document.body, char);

window.onbeforeunload = function () {
  storage.setItem('char', JSON.stringify(char));
};

window.C = char;
console.log(C);

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