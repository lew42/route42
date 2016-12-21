var test = require("test42");
var view = require("view42");
var assert = test.assert;
var util = require("util42");
var is = util.is;

var Promise = require("bluebird");


var Route = require("./index");
var Router = require("./Router3");
var Page = require("./Page");
// var Router = Route.Router;

test("initialize router", function(){
	var router = Router();
	router.useCurrent();

	var one = router.add("one");
	var one1 = one.add("one");
	var one2 = one.add("two");
	var one3 = one.add("three");
	var two = router.add("two");
	var three = router.add("three");

	view("one").click(function(){
		one.activate();
	});
	view("one/one").click(function(){
		one1.activate();
	});
	view("one/two").click(function(){
		one2.activate();
	});
	view("one/three").click(function(){
		one3.activate();
	});
	view("two").click(function(){
		two.activate();
	});
	view("three").click(function(){
		three.activate();
	});
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

var promisify = function(arr){
	return arr.map(function(v){
		if (is.fn(v)){
			return v();
		} else {
			return v;
		}
	});
};

test("bb array to promise", function(){
	var cbs = [];

	Promise.all([1, 2, Promise.delay(1000, 3)]).then(log);
});

test("bb promisify", function(){
	// if the fn doesn't return a promise, it shouldn't have an effect...
	var cbs = [];

	cbs.push(function(){
		console.log("normal cb");
	});

	cbs.push(function(){
		// don't return, and we won't wait for you
		Promise.delay(5000, 5000).then(log);
	});

	cbs.push(function(){
		// return, and we'll wait
		return Promise.delay(10000, 10000).then(log);
	});

	Promise.all(promisify(cbs)).then(log);
});

test("bb resolve", function(){
	Promise.resolve().then(function(){
		console.log("yep");
	});
});