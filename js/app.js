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
// DEBUG
window.C = char;
console.log(C);

// Create a place to store UI controllers
rivets.controllers = {};

// A character sheet
rivets.controllers['character-sheet'] = function (el, model) {
  this.character = model.character;
  this.removeItem = function (event, item) {
    for(var i=0; i<model.characters.length; i++) {
      if(model.characters[i] === item.character) {
        model.characters.splice(i, 1);
      }
    }
    event.preventDefault();
  };
};

// An editable text field
rivets.controllers['editable-text'] = function (el, model) {
  this.character = model.character;
  
  // Flag for whether or not the text is currently being edited by the used.
  var editing = false;

  // Shortcuts to inner elements.
  var inputEl  = el.querySelector('input');
  var outputEl = el.querySelector('span');

  function startEditMode () {
    if(editing) return;
    editing = true;
    inputEl.style.display = 'block';
    outputEl.style.display = 'none';
    inputEl.focus(); 
  }

  function endEditMode () {
    editing = false;
    inputEl.style.display = 'none';
    outputEl.style.display = 'block';
  }

  // Assign UI event handlers.
  outputEl.addEventListener('click', startEditMode);
  inputEl.addEventListener('blur', endEditMode);
  inputEl.addEventListener('focus', startEditMode);

  el.tabIndex = 0;
  el.addEventListener('focus', startEditMode);

  // Set initial visual state.
  endEditMode();
};

// An editiable list view
rivets.controllers['list'] = function (el, model) {
  this.listItems = model.listItems;
  this.addItem = function (event) {
    // TODO: Should templates for new list items be defined elsewhere?
    model.listItems.push({
      name: "",
      die: "1d4"
    });
    event.preventDefault();
  };
  this.removeItem = function (event, item) {
    model.listItems.splice(item.index, 1);
    event.preventDefault();
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

rivets.components['character-sheet'] = {
  template: function () {
    return document.querySelector('#tpl-character-sheet').innerHTML;
  },
  initialize: function (el, model) {
    return new rivets.controllers['character-sheet'](el, model);
  }
};

rivets.components['editable-text'] = {
  template: function () {
    return document.querySelector('#tpl-editable-text').innerHTML;
  },
  initialize: function (el, model) {
    return new rivets.controllers['editable-text'](el, model);
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
  alert('Data cleared!');
});

document.querySelector('#btn-output-json').addEventListener('click', function () {
  document.querySelector('#txt-output-json').value = JSON.stringify(char);
});

document.querySelector('#btn-import-json').addEventListener('click', function () {
  char = JSON.parse(document.querySelector('#txt-import-json').value);
});

document.querySelector('#btn-add-character').addEventListener('click', function () {
  char.characters.push(
    JSON.parse(JSON.stringify(char.characterTemplate))
  );
});

function saveOnExit () {
  // TODO: Remove this awful debug code.
  if(!CLEAR_DATA) saveData(userName, char);
}

window.addEventListener('beforeunload', saveOnExit);

// iOS doesn't support "beforeunload" for some reason.
if(navigator.userAgent.match('iPad')) {
  window.addEventListener('unload', saveOnExit);
}



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