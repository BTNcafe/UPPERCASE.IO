FOR_BOX(function(box) {'use strict';

	/**
	 * Connection room class
	 */
	box.ROOM = METHOD({

		run : function(name, func) {
			//REQUIRED: name
			//OPTIONAL: func

			CONNS.addRoomFunc(box.boxName + '/' + name, function(fullURI, socket, ip, headers, params, _setAuthKey, _getAuthKey, _removeAuthKey, roles, disconnectListeners) {

				var
				// object
				object = OBJECT({

					init : function(inner, self) {

						var
						// listeners
						listeners = {},

						// on.
						on,

						// broadcast.
						broadcast,

						// broadcast except sender.
						broadcastExceptSender,

						// remove all listeners.
						removeAllListeners,

						// set auth key.
						setAuthKey,

						// get auth key.
						getAuthKey,

						// remove auth key.
						removeAuthKey,

						// add role.
						addRole,

						// check role.
						checkRole,

						// remove role.
						removeRole,

						// remove all roles.
						removeAllRoles,

						// add disconnect listener.
						addDisconnectListener,

						// get ip.
						getIp,

						// get headers.
						getHeaders;

						self.on = on = function(methodName, callback) {
							//REQUIRED: methodName
							//REQUIRED: callback

							var
							// listener name
							listenerName = fullURI + '/' + methodName,

							// func
							func;

							func = function(params) {
								//REQUIRED: params
								//REQUIRED: params.data
								//REQUIRED: params.instantListenerName

								var
								// data
								data = CHECK_IS_DATA(params.data) === true ? UNPACK_DATA(params.data) : params.data,

								// instant listener name
								instantListenerName = params.instantListenerName;

								callback(data, function(result) {
									socket.emit(instantListenerName, CHECK_IS_DATA(result) === true ? PACK_DATA(result) : result);
								});
							};

							socket.addListener(listenerName, func);

							if (listeners[listenerName] === undefined) {
								listeners[listenerName] = [];
							}
							listeners[listenerName].push(func);
						};

						self.broadcast = broadcast = function(params) {
							//REQUIRED: params
							//REQUIRED: params.methodName
							//REQUIRED: params.data

							var
							// method name
							methodName = params.methodName,

							// data
							data = CHECK_IS_DATA(params.data) === true ? PACK_DATA(params.data) : params.data,

							// listener name
							listenerName = fullURI + '/' + methodName;

							// to all.
							CONNS.emitToAllWorkers({
								fullURI : fullURI,
								listenerName : listenerName,
								data : data
							});
						};

						self.broadcastExceptSender = broadcastExceptSender = function(params) {
							//REQUIRED: params
							//REQUIRED: params.methodName
							//REQUIRED: params.data

							var
							// method name
							methodName = params.methodName,

							// data
							data = CHECK_IS_DATA(params.data) === true ? PACK_DATA(params.data) : params.data,

							// listener name
							listenerName = fullURI + '/' + methodName;

							// to.
							socket.broadcast.to(fullURI).emit(listenerName, data);

							CONNS.type.broadcastToAllWorkers({
								methodName : 'emitToAllSockets',
								data : {
									fullURI : fullURI,
									listenerName : listenerName,
									data : data
								}
							});
						};

						self.removeAllListeners = removeAllListeners = function() {
							EACH(listeners, function(funcs, listenerName) {
								EACH(funcs, function(func) {
									socket.removeListener(listenerName, func);
								});
							});
							listeners.length = 0;
						};

						self.setAuthKey = setAuthKey = function(authKey) {
							//REQUIRED: authKey

							_setAuthKey(authKey);
						};

						self.getAuthKey = getAuthKey = function() {
							return _getAuthKey();
						};

						self.removeAuthKey = removeAuthKey = function() {
							_removeAuthKey();
						};

						self.addRole = addRole = function(role) {
							//REQUIRED: role

							roles[role] = true;
						};

						self.checkRole = checkRole = function(role) {
							//REQUIRED: role

							return roles[role] === true;
						};

						self.removeRole = removeRole = function(role) {
							//REQUIRED: role

							REMOVE({
								data : roles,
								key : role
							});
						};

						self.removeAllRoles = removeAllRoles = function() {
							EACH(roles, function(v, role) {
								REMOVE({
									data : roles,
									key : role
								});
							});
						};

						self.addDisconnectListener = addDisconnectListener = function(disconnectListener) {
							//REQUIRED: disconnectListener

							disconnectListeners.push(disconnectListener);
						};

						self.getIp = getIp = function() {
							return ip;
						};

						self.getHeaders = getHeaders = function() {
							return headers;
						};
					}
				});

				if (func !== undefined) {
					func(object, params);
				}

				return object;
			});
		}
	});

});
