var View = require("view42");


var Page = module.exports = View.extend({
	name: "Page",
	app: {}, // must be passed in
	// active: CSSBool(true), // auto binds add/removeClass to this boolean value
	deactivate: function(until, cb){
		// until is passed along until we match it, and stop there...
		if (until && this === until){
			// deactivations finished...
			cb();
			this.route.router.firstPush = true; // this resets some state
			return false;
		}
		if (this.active){
			// do this first - it prevents recursion
			this.active = false; // could be tied to the CSS class automatically
			this.removeClass("active");

			if (this.route.active)
				this.route.deactivate();

			if (until){
				var page = this;
				this.out(function(){
					page.parent.deactivate(until, cb);
				});
			} else {
				this.out(cb);
			}
		}
		// maybe have deactivate() with no args, and .deactivateUntil(commonBasePage);
	},
	out: function(cb){
		this.addClass("t-out").slideUp(function(){
			this.removeClass("t-out").addClass("out");
			cb();
		});
	},
	deactivateToCommonBasePage: function(cb){
		var commonBasePage;
		if (this.app.activePage){
			commonBasePage = this.commonBasePage(this.app.activePage);
			this.app.activePage.deactivate(commonBasePage, cb);
		} else {
			cb();
		}
	},
	activate: function(){
		var page = this;
		if (!this.active){
			this.active = true;

			this.deactivateToCommonBasePage(function(){
				if (!page.route.active)
					page.route.activate();

				// page.
			});

			if (!this.route.active)
				this.route.activate();
			// this.addClass("active");
		} else {
			// reactivate
			// this.animate("grow-bounce");
		}
	},
	activateUntil: function(until, cb){
		var page = this;
		if (!this.active){
			this.active = true;
		} else {
			// even if we're already active, we can reactivate - and rematch...
			this.activateChildren();
		}
	},
	getAncestors: function(page){
		var ancestor, ancestors;
		page = page || this;
		
		if (page.ancestors)
			return page.ancestors;

		ancestor = page.parent;
		ancestors = [];
	
		// "deepest" ancestors are pushed first, and app (page) is pushed last, so these will be in reverse order
			// root.com/one/two/three/
			// ==> [three, two, one, app]

		while (ancestor){
			ancestors.push(ancestor);
			ancestor = ancestor.parent;
		}

		page.ancestors = ancestors;
		return ancestors;
	},
	/*
	if we're on page /one/, and try to activate page /one/two/three/, then we basically want to return /one/ as the common parent - which isn't really a "parent" of /one/, but includes itself, so we can accurately deactivate all sub routes until then.

	For example, if we were on /one/four/five/, and activate /one/two/three/, then we want to return /one/ as the common parent, so we can deactivate five, then four, and not deactivate one.  Then, we activate two, then three.
	*/
	commonBasePage: function(page){
		var myAncestors = this.getAncestors();
		var commonPage;

		while (page){
			if (myAncestors.indexOf(page) > -1){
				commonPage = page;
				break;
			} else {
				page = page.parent;
			}
		}

		if (!commonPage)
			console.error("root page should always be returned, at the very least");
		return commonPage;
	}
});