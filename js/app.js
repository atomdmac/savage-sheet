var rivets = require('rivets');
var Die = require('./die');
var sampleJSON = require('../json/sample');
var storage = window.localStorage;
var userName = 'atom';

// Add forEach support to NodeList objects.
NodeList.prototype.forEach = Array.prototype.forEach;

function loadData (name) {
  var data = localStorage.getItem('savage-worlds-' + name);
  if(data) {
    return JSON.parse(data);
  }

  // There is no existing data to load.  Let's return a fresh save template.
  else {
    return sampleJSON;
  }
}

function saveData (name, json) {
  localStorage.setItem('savage-worlds-' + name, JSON.stringify(json));
}

// Load previously created characters.
var char = loadData(userName);

// Create a place to store UI controllers
rivets.controllers = {};

// An editiable list view
rivets.controllers['list'] = function (el, model) {
  this.listItems = model.listItems;
  this.addItem = function (event) {
    // TODO: Should templates for new list items be defined elsewhere?
    model.listItems.push({
      name: "",
      die: "1d4"
    });
  };
  this.removeItem = function (e, o) {
    model.listItems.splice(o.index, 1);
  };
};

rivets.components['list'] = {
  template: function () {
    return document.querySelector('#tpl-list').innerHTML;
  },
  initialize: function (el, model) {
    return new rivets.controllers['list'](el, model);
  }
};

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

// Bind UI to Data.
rivets.bind(document.body, char);

// A convenient way to clear out character data while testing.
var CLEAR_DATA = false;
document.querySelector('#btn-clear-data').addEventListener('click', function () {
  storage.removeItem('savage-worlds-' + userName);
  CLEAR_DATA = true;
});

document.querySelector('#btn-output-json').addEventListener('click', function () {
  document.querySelector('#txt-output-json').value = JSON.stringify(char);
});

document.querySelector('#btn-import-json').addEventListener('click', function () {
  char = JSON.parse(document.querySelector('#txt-import-json').value);
});

window.onbeforeunload = function () {
  // TODO: Remove this awful debug code.
  if(!CLEAR_DATA) saveData(userName, char);
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