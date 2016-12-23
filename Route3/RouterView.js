var View = require("view42");

var RouterView = module.exports = View.extend({
	name: "RouterView",
	content: function(){
		this.header.render();
		this.body.render();
	},
	header: View.Item.x({
		content: function(){
			var router = this.parent.parent;
			this.set({
				icon: "code-fork",
				label: router.path
			});

			this.icon.render();
			this.label.render();
		}
	}),
	body: View.x(function(){
		var router = this.parent.parent;
		router.each(function(route){
			route.render();
		});
	}),
	sync: function(){
		var route = this.parent;

		if (route.active){
			this.addClass("active");
		} else {
			this.removeClass("active");
		}

		if (route.isActiveRoute){
			this.addClass("isActiveRoute");
		} else {
			this.removeClass("isActiveRoute");
		}
	}
});