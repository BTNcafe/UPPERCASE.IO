/*
 * Packer Packer.
 */
global.PACKER_PACKER = function() {'use strict';

	var
	// fs
	fs = require('fs'),

	// root path
	rootPath = __dirname,

	// uglify-js
	uglifyJS = require(rootPath + '/UPPERCASE.IO/SERVER/node_modules/uglify-js');

	// minify browser script.
	fs.writeFileSync('__PACK/PACKER.js', uglifyJS.minify(fs.readFileSync('PACKER.js').toString(), {
		fromString : true,
		mangle : true
	}).code);
};
PACKER_PACKER();
