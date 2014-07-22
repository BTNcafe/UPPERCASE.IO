FOR_BOX(function(box) {'use strict';

	/**
	 * Connection room class
	 */
	box.ROOM = CLASS({

		init : function(inner, self, name) {
			//REQUIRED: name

			var
			// to
			to = CONN.getSocket(),

			// ns
			ns = box.boxName + '/' + name,

			// listeners
			listeners = {},

			// is exited
			isExited,

			// on.
			on,

			// send.
			send,

			// exit.
			exit;

			CONN.enterRoom(ns);

			self.on = on = function(methodName, _callback) {
				//REQUIRED: methodName
				//REQUIRED: _callback

				var
				// listener name
				listenerName = ns + '/' + methodName,

				// callback.
				callback;

				callback = function(result) {
					//REQUIRED: result

					_callback(CHECK_IS_DATA(result) === true ? UNPACK_DATA(result) : result);
				};

				if (listeners[listenerName] === undefined) {
					listeners[listenerName] = [];
				}
				listeners[listenerName].push(callback);

				to.addListener(listenerName, callback);

				return listenerName;
			};

			self.send = send = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//OPTIONAL: params.data
				//OPTIONAL: callback

				var
				// method name
				methodName = params.methodName,

				// data
				data = params.data,

				// listener name
				listenerName = ns + '/' + methodName,

				// instant listener name
				instantListenerName,

				// date attribute names
				dateAttrNames = [];

				instantListenerName = on('__INSTANT_LISTENER_' + CONN.getNextInstantListenerCount(), function(data) {

					if (callback !== undefined) {
						callback(data);
					}

					to.removeAllListeners(instantListenerName);
					delete listeners[instantListenerName];
				});

				to.emit(listenerName, {
					data : CHECK_IS_DATA(data) === true ? PACK_DATA(data) : data,
					instantListenerName : instantListenerName
				});
			};

			self.exit = exit = function() {

				if (isExited !== true) {

					EACH(listeners, function(callbacks, name) {
						EACH(callbacks, function(callback, i) {
							to.removeListener(name, callback);
						});
						delete listeners[name];
					});

					CONN.exitRoom(box.boxName + '/' + name);

					isExited = true;
				}
			};

		}
	});

});
