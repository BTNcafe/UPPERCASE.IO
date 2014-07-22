/**
 * All connections object
 */
global.CONNS = CONNS = OBJECT({

	init : function(inner, self) {'use strict';

		var
		// socket pack
		socketPack = self.socketPack,

		// room funcs
		roomFuncs = {},

		// add room func.
		addRoomFunc,

		// emit to all sockets.
		emitToAllSockets,

		// emit to all workers.
		emitToAllWorkers;

		self.addRoomFunc = addRoomFunc = function(name, func) {
			//REQUIRED: name
			//REQUIRED: func

			if (roomFuncs[name] === undefined) {
				roomFuncs[name] = [];
			}
			roomFuncs[name].push(func);
		};

		socketPack.on('connection', function(socket) {

			var
			// ip
			ip = socket.handshake.headers['x-forwarded-for'],

			// rooms
			rooms = {},

			// room counts
			roomCounts = {},

			// auth key
			authKey,

			// roles
			roles = {},

			// disconnect listeners
			disconnectListeners = {};

			if (ip === undefined) {
				ip = socket.handshake.address.address;
			}

			socket.addListener('disconnect', function() {
				EACH(disconnectListeners, function(disconnectListeners) {
					EACH(disconnectListeners, function(disconnectListener) {
						disconnectListener();
					});
				});
			});

			socket.addListener('__ENTER_ROOM', function(fullURI) {

				EACH(roomFuncs, function(roomFuncs, name) {

					var
					// uri
					uri = '',

					// temp name
					tempName = name,

					// params
					params = {},

					// get parameter.
					getParam;

					getParam = function(subURI) {
						//REQUIRED: subURI

						var
						// parameter name
						paramName,

						// temp name2
						tempName2;

						if (tempName.indexOf('{') !== -1 && tempName.indexOf('}') !== -1) {
							tempName2 = tempName.substring(0, tempName.indexOf('{'));

							if (uri + '/' === tempName2) {
								paramName = tempName.substring(tempName.indexOf('{') + 1, tempName.indexOf('}'));
								tempName = tempName2 + subURI + tempName.substring(tempName.indexOf('}') + 1);
								return {
									name : paramName,
									value : subURI
								};
							}
						}
					};

					EACH(fullURI.split('/'), function(subURI, i) {

						var
						// param
						param = getParam(subURI);

						if (param !== undefined) {
							params[param.name] = param.value;
						}

						if (i === 0) {
							uri = subURI;
						} else {
							uri += '/' + subURI;
						}

						if (uri === tempName) {
							return false;
						}
					});

					if (fullURI === tempName) {

						if (roomCounts[fullURI] === undefined) {
							rooms[fullURI] = [];
							disconnectListeners[fullURI] = [];

							socket.join(fullURI);
							EACH(roomFuncs, function(roomFunc, i) {
								rooms[fullURI].push(roomFunc(

								// fullURI
								fullURI,

								// socket
								socket,

								// ip
								ip,

								// headers
								socket.handshake.headers,

								// params
								params,

								// setAuthKey
								function(_authKey) {
									authKey = _authKey;
								},

								// getAuthKey
								function() {
									return authKey;
								},

								// removeAuthKey
								function() {
									authKey = undefined;
								},

								// roles
								roles,

								// disconnectListeners
								disconnectListeners[fullURI]));
							});

							roomCounts[fullURI] = 1;
						} else {
							roomCounts[fullURI] += 1;
						}
						return false;
					}
				});

			});

			socket.addListener('__EXIT_ROOM', function(fullURI) {

				roomCounts[fullURI] -= 1;

				if (roomCounts[fullURI] === 0) {

					EACH(rooms[fullURI], function(room) {
						room.removeAllListeners();
					});

					socket.leave(fullURI);
					delete rooms[fullURI];
					delete roomCounts[fullURI];
					delete disconnectListeners[fullURI];
				}
			});
		});

		self.emitToAllSockets = emitToAllSockets = function(params) {
			//REQUIRED: params
			//REQUIRED: params.ns
			//REQUIRED: params.listenerName
			//REQUIRED: params.data

			var
			// ns
			ns = params.ns,

			// listener name
			listenerName = params.listenerName,

			// data
			data = params.data;

			CONNS.socketPack['in'](ns).emit(listenerName, data);
		};

		self.emitToAllWorkers = emitToAllWorkers = function(params) {
			//REQUIRED: params
			//REQUIRED: params.ns
			//REQUIRED: params.listenerName
			//REQUIRED: params.data

			emitToAllSockets(params);

			self.broadcastToAllWorkers({
				methodName : 'emitToAllSockets',
				data : params
			});
		};
	}
});
