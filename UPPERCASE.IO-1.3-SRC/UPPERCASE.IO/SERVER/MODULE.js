FOR_BOX(function(box) {'use strict';

	/**
	 * Load 3rd party module.
	 */
	box.MODULE = METHOD({

		run : function(name) {
			//REQUIRED: name

			var
			// root
			root = __dirname + '/../..';

			return require(root + '/' + box.boxName + '/SERVER/node_modules/' + name);
		}
	});
});
