var Mod4 = require("mod42/Mod4");

// should this just be called something generic, like "item"
// do we need separate classes for the trunk vs branch vs leaf/node?

var Tree = module.exports = Mod4.extend({
	children: [],

}).assign({
	mixin: function(){
		var ret = {};
		for (var i in this.prototype){
			if (this.prototype.hasOwnProperty(i)){
				// maybe clone sub modules, pojos, and arrays?
				// yea, we need to run some protection here...
				ret[i] = this.prototype[i];
			}
		}
		return ret;
	}
});

var Activator = Mod4.extend({
	// base: .activeNode, .activeChild
	// nodes: .isActiveNode, .activeChild, .active
});