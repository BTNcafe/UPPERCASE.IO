/**
 * Default browser config
 */
OVERRIDE(BROWSER_CONFIG, function(origin) {'use strict';

	global.BROWSER_CONFIG = BROWSER_CONFIG = COMBINE_DATA({
		origin : origin,
		extend : {
			loadingIndicatorImgUrl : 'UPPERCASE.IO/R/loading.gif',
			minBrowserVersions : {}
		}
	});
});
