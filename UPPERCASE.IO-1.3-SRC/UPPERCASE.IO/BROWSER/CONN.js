/**
 * Connections object
 */
global.CONN = CONN = OBJECT({

	init : function(inner, self) {'use strict';

		var
		// socket
		socket = self.socket,

		// instant listener count
		instantListenerCount = 0,

		// enter room.
		enterRoom,

		// exit room.
		exitRoom,

		// get next instant listener count.
		getNextInstantListenerCount,

		// get socket.
		getSocket;

		self.enterRoom = enterRoom = function(name) {
			//REQUIRED: name

			socket.emit('__ENTER_ROOM', name);
		};

		self.exitRoom = exitRoom = function(name) {
			//REQUIRED: name

			socket.emit('__EXIT_ROOM', name);
		};

		self.getNextInstantListenerCount = getNextInstantListenerCount = function() {
			instantListenerCount += 1;

			return instantListenerCount - 1;
		};

		self.getSocket = getSocket = function() {
			return socket;
		};
	}
});
