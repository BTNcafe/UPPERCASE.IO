Sample.View = CLASS({

	preset : function() {
		return VIEW;
	},

	init : function(inner, self) {

		var
		// wrapper
		wrapper,

		// close.
		close;

		wrapper = DIV({
			c : [H1({
				c : ['Sample']
			}), INPUT(), INPUT(), BR(), IMG({
				src : Sample.R('sample.jpg')
			})]
		}).appendTo(BODY);

		console.log('Welcome! :) This is UPPERCASE sample view.');

		Sample.R('sample.txt', function(responseText) {
			console.log(responseText);
		});

		self.close = close = function() {
			wrapper.remove();
		};
	}
});
