/*
 * UPPERCASE.IO Packer.
 */
global.PACKER = function() {'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	path = require('path'),

	// root path
	rootPath = __dirname,

	// box name
	boxName = process.argv[2],

	// browser script
	browserScript = '',

	// secured browser script
	securedBrowserScript = '',

	// common script
	commonScript = '',

	// server script
	serverScript = '',

	// log.
	log = function(msg) {
		console.log('PACKER: ' + msg);
	},

	// check is allowed folder.
	checkIsAllowedFolder = function(params) {
		//REQUIRED: params
		//REQUIRED: params.path
		//REQUIRED: params.name

		var
		// path
		path = params.path,

		// name
		name = params.name;

		return (

			// is directory
			fs.statSync(rootPath + '/' + path).isDirectory() === true &&

			// hide folder
			name[0] !== '.' &&

			// node.js module
			name !== 'node_modules' &&

			// not_load
			name !== 'not_load' &&

			// deprecated
			name !== 'deprecated' &&

			// _ folder
			name[0] !== '_'
		);
	},

	// copy.
	copy = function(path, to) {

		if (fs.statSync(path).isDirectory() === true) {
			fs.mkdirSync(to);
			fs.readdirSync(path).forEach(function(name) {
				if (name[0] !== '.') {
					copy(path + '/' + name, to + '/' + name);
				}
			});
		} else {
			fs.createReadStream(path).pipe(fs.createWriteStream(to));
		}
	},

	// write.
	write = function(to, content) {
		fs.writeFileSync(to, content);
	},

	// scan folder.
	scanFolder = function(path, func) {
		//REQUIRED: path
		//REQUIRED: func

		var
		// folder paths
		folderPaths,

		// extra
		i;

		if (fs.existsSync(path) === true) {

			folderPaths = [];

			fs.readdirSync(path).forEach(function(name) {

				var fullPath = path + '/' + name;

				if (checkIsAllowedFolder({
					path : fullPath,
					name : name
				}) === true) {
					folderPaths.push(fullPath);
				} else if (fs.statSync(rootPath + '/' + fullPath).isDirectory() !== true) {
					func(fullPath);
				}
			});

			for ( i = 0; i < folderPaths.length; i += 1) {
				scanFolder(folderPaths[i], func);
			}
		}
	},

	// scan box folder.
	scanBoxFolder = function(func) {
		//REQUIRED: func

		fs.readdirSync(boxName).forEach(function(name) {
			if (name[0] !== '.' && name !== 'BROWSER' && name !== 'BROWSER_SECURED' && name !== 'COMMON' && name !== 'SERVER') {
				func(boxName + '/' + name);
			}
		});
	},

	// load for browser.
	loadForBrowser = function(relativePath) {
		//REQUIRED: relativePath

		var
		// absolute path
		absolutePath = rootPath + '/' + relativePath,

		// extname
		extname = path.extname(relativePath),

		// content
		content = fs.readFileSync(absolutePath);

		if (extname === '.js') {

			// add to browser script.
			browserScript += content + '\n';

		} else if (extname === '.__UPPERCASE_IO_COMPILED') {

			// add to browser script.
			browserScript += content + '\n';
		}
	},

	// load for browser secured.
	loadForBrowserSecured = function(relativePath) {
		//REQUIRED: relativePath

		var
		// absolute path
		absolutePath = rootPath + '/' + relativePath,

		// extname
		extname = path.extname(relativePath),

		// content
		content = fs.readFileSync(absolutePath);

		if (extname === '.js') {

			// add to secured browser script.
			securedBrowserScript += content + '\n';

		} else if (extname === '.__UPPERCASE_IO_COMPILED') {

			// add to secured browser script.
			securedBrowserScript += content + '\n';
		}
	},

	// load for common.
	loadForCommon = function(relativePath) {
		//REQUIRED: relativePath

		var
		// absolute path
		absolutePath = rootPath + '/' + relativePath,

		// extname
		extname = path.extname(relativePath),

		// content
		content = fs.readFileSync(absolutePath);

		if (extname === '.js') {

			// add to common script.
			commonScript += content + '\n';

		} else if (extname === '.__UPPERCASE_IO_COMPILED') {

			// add to common script.
			commonScript += content + '\n';
		}
	},

	// load for sever.
	loadForServer = function(relativePath) {
		//REQUIRED: relativePath

		var
		// absolute path
		absolutePath = rootPath + '/' + relativePath,

		// extname
		extname = path.extname(relativePath),

		// content
		content = fs.readFileSync(absolutePath);

		if (extname === '.js') {

			// add to server script.
			serverScript += content + '\n';

		} else if (extname === '.__UPPERCASE_IO_COMPILED') {

			// add to server script.
			serverScript += content + '\n';
		}
	},

	// minify
	minify = function() {

		var
		// uglify-js
		uglifyJS = require(rootPath + '/UPPERCASE.IO/SERVER/node_modules/uglify-js');

		// minify browser script.
		browserScript = uglifyJS.minify(browserScript, {
			fromString : true,
			mangle : true
		}).code;

		// minify secured browser script.
		securedBrowserScript = uglifyJS.minify(securedBrowserScript, {
			fromString : true,
			mangle : true
		}).code;

		// minify common script.
		commonScript = uglifyJS.minify(commonScript, {
			fromString : true,
			mangle : true
		}).code;

		// minify server script.
		serverScript = uglifyJS.minify(serverScript, {
			fromString : true,
			mangle : true
		}).code;
	};

	// pack box.
	log('PACKING BOX [' + boxName + ']...');

	// create folder.
	log('CREATING FOLDER...');
	fs.mkdirSync('__PACK/' + boxName);
	log('CREATED FOLDER!');

	// load box.
	log('LOADING BOX...');

	// load for browser.
	log('LOADING FOR BROWSER...');
	scanFolder(boxName + '/BROWSER', loadForBrowser);
	log('LOADED FOR BROWSER!');

	// load for browser secured.
	log('LOADING FOR BROWSER SECURED...');
	scanFolder(boxName + '/BROWSER_SECURED', loadForBrowserSecured);
	log('LOADED FOR BROWSER SECURED!');

	// load for common.
	log('LOADING FOR COMMON...');
	scanFolder(boxName + '/COMMON', loadForCommon);
	log('LOADED FOR COMMON!');

	// load for server.
	log('LOADING FOR SERVER...');
	scanFolder(boxName + '/SERVER', loadForServer);
	log('LOADED FOR SERVER!');

	log('LOADED BOX!');

	// minify.
	log('MINIFYING...');
	minify();
	log('MINIFYED!');

	// save box.
	log('SAVING BOX...');
	scanBoxFolder(function(path) {
		copy(path, '__PACK/' + boxName + '/' + path.substring(boxName.length + 1));
	});

	// save browser script.
	if (browserScript !== '') {
		log('SAVING BROWSER SCRIPT...');
		fs.mkdirSync('__PACK/' + boxName + '/BROWSER');
		write('__PACK/' + boxName + '/BROWSER/BROWSER.js', browserScript);
		log('SAVED BROWSER SCRIPT!');
	}

	// save browser secured script.
	if (securedBrowserScript !== '') {
		log('SAVING BROWSER SECURED SCRIPT...');
		fs.mkdirSync('__PACK/' + boxName + '/BROWSER_SECURED');
		write('__PACK/' + boxName + '/BROWSER_SECURED/BROWSER_SECURED.js', securedBrowserScript);
		log('SAVED BROWSER SECURED SCRIPT!');
	}

	// save common script.
	if (commonScript !== '') {
		log('SAVING COMMON SCRIPT...');
		fs.mkdirSync('__PACK/' + boxName + '/COMMON');
		write('__PACK/' + boxName + '/COMMON/COMMON.js', commonScript);
		log('SAVED COMMON SCRIPT!');
	}

	// save server script.
	if (serverScript !== '') {
		log('SAVING SERVER SCRIPT...');
		fs.mkdirSync('__PACK/' + boxName + '/SERVER');
		write('__PACK/' + boxName + '/SERVER/SERVER.js', serverScript);
		log('SAVED SERVER SCRIPT!');
	}

	// save node module.
	if (fs.existsSync(boxName + '/SERVER/node_modules') === true) {
		log('SAVING NODE MODULES...');
		if (fs.existsSync('__PACK/' + boxName + '/SERVER') === false) {
			fs.mkdirSync('__PACK/' + boxName + '/SERVER');
		}
		copy(boxName + '/SERVER/node_modules', '__PACK/' + boxName + '/SERVER/node_modules');
		log('SAVED NODE MODULES!');
	}

	log('SAVED BOX!');

	// done!
	log('PACKED BOX [' + boxName + ']!');

};
PACKER();
