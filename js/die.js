// define([], function () {

function _verifySides (sides) {
	for(var i=0; i<Die.prototype.defaultOptions.validSides.length; i++) {
		if(sides == Die.prototype.defaultOptions.validSides[i]) return true;
	}
	return false;
}

function _randomInt (max) {
	return Math.ceil(Math.random() * max);
}

function _indexOfSmallest(list) {
	if(list.length == 1) return list[0];

	var smallest = 0;
	for(i=1; i<list.length; i++) {
		if(list[i] < list[smallest]) smallest = i;
	}
	return smallest;
}

function _replaceSmallest(list, replaceWith) {
	var i = _indexOfSmallest(list);
	return list.splice(i, 1, replaceWith);
}

function _getTotal(list) {
	var total = 0;
	for(var i=0; i<list.length; i++) {
		if(typeof list[i] === 'string') total += list[i];
	}
	return total;
}

function _roll(times, sides, canAce) {
	var i = 0, 
		aced = false,
		results = [],
		current;

	while(i<times || aced) {
		current = _randomInt(sides);
		results.push(current);
		aced = current == sides && canAce ? true : false;
		i++;
	}
	console.log(results);
	return results;
}

function Die(options) {
	this.number     = this.defaultOptions.number;
	this.sides      = this.defaultOptions.sides;
	this.aces       = this.defaultOptions.aces;
	this.useWildDie = this.defaultOptions.useWildDie;

	if(typeof options === 'string') {
		this.parseDie(options);
	}
}

Die.prototype.defaultOptions = {
	number    : 1,
	sides     : 4,
	aces      : false,
	useWild   : false,
	validSides: [4, 6, 8, 10, 12, 20]
};

Die.prototype.parseDie = function (die) {
	var split = die.split('d');
	if(split.length != 2) throw('Die parse error.');

	var aces    = /a/.test(split[1]) ? true : false,
		useWild = /w/.test(split[1]) ? true : false,
		number  = parseInt(split[0], 10),
		sides   = parseInt(split[1], 10);

	this.aces = aces;
	this.useWild = useWild;
	this.number = number;
	if(_verifySides(sides)) this.sides = sides;
};

Die.prototype.roll = function (useWild) {
	var results = _roll(this.number, this.sides, this.aces),
		total   = 0,
		wildTotal;

	// If specified, use a wild die.
	if(useWild || this.useWild) {
		wildTotal = _getTotal( _roll(1, this.sides, this.aces) );

		if(wildTotal < results[_indexOfSmallest(results)]) {
			results = _replaceSmallest(results, wildTotal);
		}
	}

	console.log('final results: ', results);

	total = _getTotal(results) + wildTotal;

	return _getTotal(results);
};

Die.prototype.upgrade = function () {
	// TODO
};

Die.prototype.downgrade = function () {
	// TODO
};

// });