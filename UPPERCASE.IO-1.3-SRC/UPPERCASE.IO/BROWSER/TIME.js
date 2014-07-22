/**
 * Get time.
 */
global.TIME = TIME = METHOD(function(m) {'use strict';

	var
	// diff
	diff = 0;

	return {

		run : function(date) {
			//REQUIRED: date

			return new Date(date.getTime() + diff);
		}
	};
});
