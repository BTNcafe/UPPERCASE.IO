FOR_BOX(function(box) {'use strict';

	/**
	 * All connection rooms class
	 */
	box.ROOMS = CLASS({

		init : function(inner, self, name) {
			//REQUIRED: name

			var
			// ns
			ns = box.boxName + '/' + name,

			// broadcast.
			broadcast;

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
				listenerName = ns + '/' + methodName;

				// to all.
				CONNS.socketPack['in'](ns).emit(listenerName, data);
			};
		}
	});

});
