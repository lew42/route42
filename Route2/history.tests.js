var test = require("test42");
var history = require("history").createBrowserHistory();

var view = require("view42");

window.h2 = history;


test("history", function(){
	history.listen(function(location, action){
		console.log(window.location);
		console.log(location, action);
	});

	view({tag: "button", content: "push"}).click(function(){
		console.log(window.location);
		history.push("some-pushed-path");
		console.log(window.location);
	});

	view({tag: "button", content: "pop"}).click(function(){
		console.log(window.location);
		history.goBack();
		console.log(window.location);
	});

	view({tag: "button", content: "replace"}).click(function(){
		console.log(window.location);
		history.replace("some-replaced-path");
		console.log(window.location);
	});
	
});

