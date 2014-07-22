Sample.View2 = CLASS({

	preset : function() {
		return VIEW;
	},

	init : function(inner, self) {

		var canvas = CANVAS({
			width : 300,
			height : 200,
			style : {
				border : '1px solid #999',
				position : 'absolute',
				width : '100%',
				heigth : '100%'
			}
		}).appendTo(BODY);

		EVENT({
			name : 'resize'
		}, RAR(function() {

			canvas.setSize({
				width : WIN_WIDTH(),
				height : WIN_HEIGHT()
			});
		}));

		var context = canvas.getContext();

		var img = IMG({
			src : UDOC.R('test.png')
		});

		EVENT({
			node : img,
			name : 'load'
		}, function() {

			context.drawImg({
				img : img,
				left : 20,
				top : 10,
				clipLeft : 60,
				clipTop : 10,
				clipWidth : 150,
				clipHeight : 50,
				width : 200,
				height : 120
			});
		});
	}
});
