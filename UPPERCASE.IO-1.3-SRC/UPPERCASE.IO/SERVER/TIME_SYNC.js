/**
 * Time sync object (Server-side)
 */
global.TIME_SYNC = TIME_SYNC = OBJECT({

	init : function() {'use strict';

		UPPERCASE.IO.ROOM('timeSync', function(room) {

			room.on('sync', function(data, ret) {

				var
				// now time
				now = new Date(),

				// client now time
				clientNow = data.now;

				ret({
					diff : clientNow - now
				});
			});

		});
	}
});
