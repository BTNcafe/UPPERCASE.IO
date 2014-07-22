require('./UPPERCASE.IO/BOOT.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'Sample',
		isDevMode : true
	},
	NODE_CONFIG : {
		isNotRequiringDBAuth : true
	}
});
