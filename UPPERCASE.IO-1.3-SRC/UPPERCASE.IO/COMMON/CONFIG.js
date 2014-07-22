/**
 * Default common config
 */
OVERRIDE(CONFIG, function(origin) {'use strict';

	global.CONFIG = CONFIG = COMBINE_DATA({
		origin : origin,
		extend : {
			isDevMode : false,
			port : 8888,
			defaultBoxName : 'UPPERCASE.IO',
			defaultTitle : 'UPPERCASE.IO',
			description : 'WELCOME!',
			defaultLang : 'en',
			contactAddress : 'contact@btncafe.com',
			maxUploadFileMB : 10,
			isMobileFullScreen : false,
			transports : ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling']
		}
	});
});
