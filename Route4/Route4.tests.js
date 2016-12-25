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

	var router = window.router = Router("/test/route42/Route3/Route3/");
	// router.useCurrent();

	var a = router.add("a");
	var a1 = a.add("a1");
	var a2 = a.add("a2");

	var a2x = a2.add("a2x");
	var a2y = a2.add("a2y");
	var a2z = a2.add("a2z");

	var a3 = a.add("a3");
	var b = router.add("b");
	var c = router.add("c");

	router.activate();
	router.render()

	// view("one").click(function(){
	// 	one.activate();
	// });
	// view("one/one").click(function(){
	// 	one1.activate();
	// });
	// view("one/two").click(function(){
	// 	one2.activate();
	// });
	// view("one/three").click(function(){
	// 	one3.activate();
	// });
	// view("two").click(function(){
	// 	two.activate();
	// });
	// view("three").click(function(){
	// 	three.activate();
	// });
	// route.activate();
	// page.activate();
