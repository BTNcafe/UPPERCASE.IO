FOR_BOX(function(box) {'use strict';

	/**
	 * Get resource's real path.
	 */
	box.R = METHOD({

		run : function(path, ajaxCallback) {
			//REQUIRED: path
			//OPTIONAL: ajaxCallback

			var
			// uri
			uri = '/' + box.boxName + '/R/' + path + '?' + CONFIG.version,

			// http request
			httpRequest;

			if (ajaxCallback !== undefined) {

				// Mozilla, Safari, ...
				if (global.XMLHttpRequest !== undefined) {
					httpRequest = new XMLHttpRequest();
				}

				// IE
				else if (global.ActiveXObject) {

					try {
						httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
					} catch (e1) {

						try {
							httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
						} catch (e2) {
							// ignore.
						}
					}
				}

				// request complete.
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === 4 && httpRequest.status === 200) {
						ajaxCallback(httpRequest.responseText);
					}
				};

				// request.
				httpRequest.open('GET', uri);
				httpRequest.send();
			}

			return uri;
		}
	});
});

