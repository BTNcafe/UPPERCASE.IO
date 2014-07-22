FOR_BOX(function(box) {'use strict';

	OVERRIDE(box.MODEL, function(origin) {

		/**
		 * Model(include CRUD functions) class
		 */
		box.MODEL = CLASS({

			init : function(inner, self, params) {
				//REQUIRED: params
				//REQUIRED: params.name
				//OPTIONAL: params.config

				var
				// name
				name = params.name,

				// config
				config = params.config,

				// create config
				createConfig,

				// get config
				getConfig,

				// update config
				updateConfig,

				// remove config
				removeConfig,

				// find config
				findConfig,

				// count conifg
				countConfig,

				// check is exists conifg
				checkIsExistsConfig,

				// create valid
				createValid,

				// update valid
				updateValid,

				// init data.
				initData,

				// room
				room = box.ROOM(name),

				// room for create
				roomForCreate,

				// rooms for create
				roomsForCreate = {},

				// room for remove
				roomForRemove,

				// rooms for remove
				roomsForRemove = {},

				// sub rooms
				subRooms = [],

				// sub rooms for create
				subRoomsForCreate = [],

				// sub room map for create
				subRoomMapForCreate = {},

				// create.
				create,

				// get.
				get,

				// get watching.
				getWatching,

				// update.
				update,

				// remove.
				remove,

				// find.
				find,

				// find watching.
				findWatching,

				// count.
				count,

				// check is exists.
				checkIsExists,

				// on new.
				onNew,

				// on new watching.
				onNewWatching,

				// close on new.
				closeOnNew,

				// on remove.
				onRemove,

				// close on remove.
				closeOnRemove,

				// close.
				close,

				// get room.
				getRoom,

				// get name.
				getName;

				// init config.
				if (config !== undefined) {

					createConfig = config.create;
					getConfig = config.get;
					updateConfig = config.update;
					removeConfig = config.remove;
					findConfig = config.find;
					countConfig = config.count;
					checkIsExistsConfig = config.checkIsExists;

					if (createConfig !== undefined) {
						createValid = createConfig.valid;
						initData = createConfig.initData;
					}

					if (updateConfig !== undefined) {
						updateValid = updateConfig.valid;
					}
				}

				// create.
				if (createConfig !== false) {

					self.create = create = function(data, callback) {
						//REQUIRED: data
						//OPTIONAL: callback

						var
						// valid result
						validResult;

						if (initData !== undefined) {
							initData(data);
						}

						if (createValid !== undefined) {
							validResult = createValid.check({
								data : data
							});
						}

						if (validResult !== undefined && validResult.checkHasError() === true) {

							if (callback !== undefined) {
								callback({
									hasError : true,
									errors : validResult.getErrors()
								});
							}

						} else {

							room.send({
								methodName : 'create',
								data : data
							}, callback);
						}

						// remove TO_DELETE properties.
						REMOVE_TO_DELETE(data);
					};
				}

				// get.
				if (getConfig !== false) {

					self.get = get = function(idOrParams, callback) {
						//REQUIRED: idOrParams
						//OPTIONAL: idOrParams.filter
						//OPTIONAL: idOrParams.sort
						//OPTIONAL: idOrParams.isRandom
						//REQUIRED: callback

						room.send({
							methodName : 'get',
							data : idOrParams
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data
							savedData = result.savedData;

							if (hasError === true || savedData === undefined) {
								callback(result);
							} else {
								callback(result);
							}

						});
					};

					self.getWatching = getWatching = function(idOrParams, callback) {
						//REQUIRED: idOrParams
						//OPTIONAL: idOrParams.filter
						//OPTIONAL: idOrParams.sort
						//OPTIONAL: idOrParams.isRandom
						//REQUIRED: callback

						room.send({
							methodName : 'get',
							data : idOrParams
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data
							savedData = result.savedData,

							// sub room
							subRoom,

							// close watching.
							closeWatching;

							if (hasError === true || savedData === undefined) {

								callback(result);

							} else {

								subRooms.push( subRoom = box.ROOM(name + '/' + savedData.id));

								callback(result,

								// add update handler.
								function(callback) {
									subRoom.on('update', callback);
								},

								// add remove handler.
								function(callback) {
									subRoom.on('remove', function(result) {
										callback(result);
										closeWatching();
									});
								},

								// close watching.
								closeWatching = function() {

									REMOVE({
										data : subRooms,
										value : subRoom
									});

									subRoom.exit();
								});
							}

						});
					};

				}
				// update.
				if (updateConfig !== false) {

					self.update = update = function(data, callback) {
						//REQUIRED: data
						//REQUIRED: data.id
						//OPTIONAL: callback

						var
						// valid result
						validResult = updateValid === undefined ? undefined : updateValid.check({
							data : data,
							isExceptUndefined : true
						}),

						// sub room
						subRoom;

						if (updateValid !== undefined && validResult.checkHasError() === true) {

							if (callback !== undefined) {
								callback({
									hasError : true,
									errors : validResult.getErrors()
								});
							}

						} else {

							subRoom = box.ROOM(name + '/' + data.id);

							subRoom.send({
								methodName : 'update',
								data : data
							}, function(result) {
								if (callback !== undefined) {
									callback(result);
								}
								subRoom.exit();
							});
						}

						// remove TO_DELETE properties.
						REMOVE_TO_DELETE(data);
					};
				}

				// remove.
				if (removeConfig !== false) {

					self.remove = remove = function(id, callback) {
						//REQUIRED: id
						//OPTIONAL: callback

						var
						// sub room
						subRoom = box.ROOM(name + '/' + id);

						subRoom.send({
							methodName : 'remove',
							data : id
						}, function(result) {
							if (callback !== undefined) {
								callback(result);
							}
							subRoom.exit();
						});
					};
				}

				// find.
				if (findConfig !== false) {

					self.find = find = function(params, callback) {
						//OPTIONAL: params
						//OPTIONAL: params.filter
						//OPTIONAL: params.sort
						//OPTIONAL: params.start
						//OPTIONAL: params.count
						//REQUIRED: callback

						if (callback === undefined) {
							callback = params;
							params = undefined;
						}

						room.send({
							methodName : 'find',
							data : params
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data set
							savedDataSet = result.savedDataSet;

							if (hasError === true || savedDataSet === undefined) {
								callback(result);
							} else {
								callback(result);
							}

						});
					};

					self.findWatching = findWatching = function(params, callback) {
						//OPTIONAL: params
						//OPTIONAL: params.filter
						//OPTIONAL: params.sort
						//OPTIONAL: params.start
						//OPTIONAL: params.count
						//REQUIRED: callback

						if (callback === undefined) {
							callback = params;
							params = undefined;
						}

						room.send({
							methodName : 'find',
							data : params
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data set
							savedDataSet = result.savedDataSet,

							// sub rooms2
							subRooms2 = {},

							// close watching.
							closeWatching;

							if (hasError === true || savedDataSet === undefined) {

								callback(result);

							} else {

								EACH(savedDataSet, function(savedData, i) {

									var
									// id
									id = savedData.id;

									subRooms.push(subRooms2[id] = box.ROOM(name + '/' + id));
								});

								callback(result,

								// add update handler.
								function(id, callback) {
									subRooms2[id].on('update', callback);
								},

								// add remove handler.
								function(id, callback) {
									subRooms2[id].on('remove', function(result) {
										callback(result);
										closeWatching(id);
									});
								},

								// close watching.
								closeWatching = function(id) {

									if (subRooms2[id] !== undefined) {

										REMOVE({
											data : subRooms,
											value : subRooms2[id]
										});

										subRooms2[id].exit();
										delete subRooms2[id];
									}
								});
							}

						});
					};
				}

				if (countConfig !== false) {

					self.count = count = function(filter, callback) {
						//OPTIONAL: filter
						//REQUIRED: callback

						if (callback === undefined) {
							callback = filter;
							filter = undefined;
						}

						room.send({
							methodName : 'count',
							data : filter
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data set
							savedDataSet = result.savedDataSet;

							if (hasError === true || savedDataSet === undefined) {
								callback(result);
							} else {
								callback(result);
							}

						});
					};
				}

				if (checkIsExistsConfig !== false) {

					self.checkIsExists = checkIsExists = function(filter, callback) {
						//REQUIRED: filter
						//REQUIRED: callback

						room.send({
							methodName : 'checkIsExists',
							data : filter
						}, function(result) {

							var
							// hasError
							hasError = result.hasError,

							// errors
							errors = result.errors,

							// saved data set
							savedDataSet = result.savedDataSet;

							if (hasError === true || savedDataSet === undefined) {
								callback(result);
							} else {
								callback(result);
							}

						});
					};
				}

				self.onNew = onNew = function(properties, func) {
					//OPTIONAL: properties
					//REQUIRED: func

					var
					// f.
					f = function(savedData) {

						var
						// id
						id = savedData.id;

						func(savedData);
					};

					if (func === undefined) {
						func = properties;

						if (roomForCreate === undefined) {
							roomForCreate = box.ROOM(name + '/create');
						}

						roomForCreate.on('create', f);

					} else {

						EACH(properties, function(value, propertyName) {

							var
							// room
							room = roomsForCreate[propertyName + '/' + value];

							if (room === undefined) {
								room = roomsForCreate[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/create');
							}

							room.on('create', f);
						});
					}
				};

				self.onNewWatching = onNewWatching = function(properties, func) {
					//OPTIONAL: properties
					//REQUIRED: func

					var
					// f.
					f = function(savedData, subRoomsForCreate) {

						var
						// id
						id = savedData.id,

						// sub room
						subRoom,

						// close watching.
						closeWatching;

						subRooms.push( subRoom = box.ROOM(name + '/' + id));
						subRoomsForCreate.push(subRoom);

						func(savedData,

						// add update handler.
						function(callback) {
							subRoom.on('update', callback);
						},

						// add remove handler.
						function(callback) {
							subRoom.on('remove', function(result) {
								callback(result);
								closeWatching();
							});
						},

						// close watching.
						closeWatching = function() {

							subRoom.exit();

							REMOVE({
								data : subRooms,
								value : subRoom
							});
						});
					};

					if (func === undefined) {
						func = properties;

						if (roomForCreate === undefined) {
							roomForCreate = box.ROOM(name + '/create');
						}

						roomForCreate.on('create', function(savedData) {
							f(savedData, subRoomsForCreate);
						});

					} else {

						EACH(properties, function(value, propertyName) {

							var
							// room
							room = roomsForCreate[propertyName + '/' + value],

							// sub rooms for create
							subRoomsForCreate = subRoomMapForCreate[propertyName + '/' + value];

							if (room === undefined) {
								room = roomsForCreate[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/create');
							}

							if (subRoomsForCreate === undefined) {
								subRoomsForCreate = subRoomMapForCreate[propertyName + '/' + value] = [];
							}

							room.on('create', function(savedData) {
								f(savedData, subRoomsForCreate);
							});
						});
					}
				};

				self.closeOnNew = closeOnNew = function(properties) {
					//OPTIONAL: properties

					if (properties === undefined) {

						if (roomForCreate !== undefined) {
							roomForCreate.exit();
							roomForCreate = undefined;
						}

						EACH(subRoomsForCreate, function(subRoom) {

							subRoom.exit();

							REMOVE({
								data : subRooms,
								value : subRoom
							});
						});

						subRoomsForCreate = [];

					} else {

						EACH(properties, function(value, propertyName) {

							if (roomsForCreate[propertyName + '/' + value] !== undefined) {
								roomsForCreate[propertyName + '/' + value].exit();
								delete roomsForCreate[propertyName + '/' + value];
							}

							EACH(subRoomMapForCreate[propertyName + '/' + value], function(subRoom) {

								subRoom.exit();

								REMOVE({
									data : subRooms,
									value : subRoom
								});
							});
							delete subRoomMapForCreate[propertyName + '/' + value];
						});
					}
				};

				self.onRemove = onRemove = function(properties, func) {
					//OPTIONAL: properties
					//REQUIRED: func

					var
					// f.
					f = function(savedData) {

						var
						// id
						id = savedData.id;

						func(savedData);
					};

					if (func === undefined) {
						func = properties;

						if (roomForRemove === undefined) {
							roomForRemove = box.ROOM(name + '/remove');
						}

						roomForRemove.on('remove', f);

					} else {

						EACH(properties, function(value, propertyName) {

							var
							// room
							room = roomsForRemove[propertyName + '/' + value];

							if (room === undefined) {
								room = roomsForRemove[propertyName + '/' + value] = box.ROOM(name + '/' + propertyName + '/' + value + '/remove');
							}

							room.on('remove', f);
						});
					}
				};

				self.closeOnRemove = closeOnRemove = function(properties) {
					//OPTIONAL: properties

					if (properties === undefined) {

						if (roomForRemove !== undefined) {
							roomForRemove.exit();
							roomForRemove = undefined;
						}

					} else {

						EACH(properties, function(value, propertyName) {

							if (roomsForRemove[propertyName + '/' + value] !== undefined) {
								roomsForRemove[propertyName + '/' + value].exit();
								delete roomsForRemove[propertyName + '/' + value];
							}
						});
					}
				};

				self.close = close = function() {

					if (roomForCreate !== undefined) {
						roomForCreate.exit();
					}

					EACH(roomsForCreate, function(room) {
						room.exit();
					});

					if (roomForRemove !== undefined) {
						roomForRemove.exit();
					}

					EACH(roomsForRemove, function(room) {
						room.exit();
					});

					EACH(subRooms, function(subRoom) {
						subRoom.exit();
					});

					room.exit();
				};

				inner.getRoom = getRoom = function() {
					return room;
				};

				inner.getName = getName = function() {
					return name;
				};
			}
		});
	});
});
