var test = require("test42");
var view = require("view42");
var assert = test.assert;

var Promise = require("bluebird");


var Route = require("./index");
var Page = require("./Page");
// var Router = Route.Router;

test("initialize router", function(){
	var route = Route();
	var page = Page();

	// route.activate();
	// page.activate();
});

test("bluebird", function(){
	var p, o = {};

	console.dir(Promise)

	p = new Promise(function(resolve, reject){
		console.log("creating promise");
		o.resolve = resolve;
	});

	p.resolve = o.resolve;
	console.log(p);

	p.then(function(){
		console.log("resolved");
	});

	window.p = p;
});

var log = console.log.bind(console);

test("bluebird delay", function(){
	var delay = Promise.delay(100, [1,true,"three", Promise.delay(3000, 4), 5, Promise.delay(5000, [1, 2, Promise.delay(8000, 3)]) ]);

	delay.each(function(){
		console.log(arguments);
	});
});

test("bluebird stacking", function(){
	var delay = Promise.delay(1000, 5)

	delay.then(Promise.delay.bind(Promise, 2000, 10)).then(log) ;

	delay.then(console.log.bind(console));
	var count = 0, int;
	int = setInterval(function(){
		console.log(count += 1000);
		if (count > 9000)
			clearInterval(int);
	}, 1000);
});