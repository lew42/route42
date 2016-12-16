var app = new App({
	init: function(){
		this.set({
			router: new Router()
		})
		// or
		this.router = new Router({
			parent: this || false // --> false will still pass the "hasOwn" check, and not get adopted...
		})
		// or
		// Router can set orphan: false, so .set doesn't try to set its parent, ever.
	}
});

tests.forEach(function(test){
	var page = new Page({
		route: test.route
	});

	// this part could be within the page.
	page.route.then(function(){
		page.activate();
	});
});

// this could be anything that follows the route's api.. like a page?  it just needs a few methods... like activate?

app.router.activate();