var rivets = require('rivets');
var Die = require('./die');
var sampleJSON = require('../json/sample');
var storage = window.localStorage;

// Add forEach support to NodeList objects.
NodeList.prototype.forEach = Array.prototype.forEach;

// Load previously created characters.
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

rivets.binders['select'] = {
  publishes: true,
  bind: function (el) {
    var publish = this.publish;
    el.addEventListener('change', publish);
  },
  unbind: function (el) {
    var publish = this.publish;
    el.removeEventListener('change', publish);
  },
  routine: function (el, value) {
    el.selectedIndex = value;
  },
  getValue: function (el) {
    return el.selectedIndex;
  }
};

// DEBUG
console.log(char);

// Bind UI to Data.
rivets.bind(document.body, char);

// A convenient way to clear out character data while testing.
var CLEAR_DATA = false;
document.querySelector('#btn-clear-data').addEventListener('click', function () {
  storage.removeItem('char');
  CLEAR_DATA = true;
});

document.querySelector('#btn-output-json').addEventListener('click', function () {
  document.querySelector('#txt-output-json').value = JSON.stringify(char);
});

window.onbeforeunload = function () {
  // TODO: Remove this awful debug code.
  if(!CLEAR_DATA) storage.setItem('char', JSON.stringify(char));
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