/*
 * Boot UPPERCASE.IO.
 */
global.BOOT = BOOT = function(params) {'use strict';
	//OPTIONAL: params
	//OPTIONAL: params.CONFIG
	//OPTIONAL: params.NODE_CONFIG
	//OPTIONAL: params.BROWSER_CONFIG
	//OPTIONAL: params.MULTI_LANG_SUPPORT
	//OPTIONAL: params.MULTI_PLATFORM_SUPPORT

	require('./UPPERCASE.JS-COMMON.js');
	require('./UPPERCASE.JS-NODE.js');

	CPU_CLUSTERING(function(workerData, on, broadcast) {

		var
		//IMPORT: clustor
		cluster = require('cluster'),

		// version
		version = Date.now(),

		// cpu count
		cpuCount = require('os').cpus().length,

		// i
		i,

		// work.
		work = function(sharedData) {

			var
			//IMPORT: fs
			fs = require('fs'),

			//IMPORT: path
			path = require('path'),

			// MULTI_LANG_SUPPORT
			MULTI_LANG_SUPPORT = params.MULTI_LANG_SUPPORT,

			// MULTI_PLATFORM_SUPPORT
			MULTI_PLATFORM_SUPPORT = params.MULTI_PLATFORM_SUPPORT,

			// root path
			rootPath = __dirname + '/..',

			// browser script
			browserScript = '\nglobal = window;\n',

			// secured browser script
			securedBrowserScript = '\nglobal = window;\n',

			// platform scripts
			platformScripts = {},

			// css
			css = '',

			// logo text
			logoText,

			// page content
			pageContent = '',

			// init multi platform scripts.
			initMultiPlatformScripts,

			// save multi platform scripts.
			saveMultiPlatformScripts,

			// stringify JSON with function.
			stringifyJSONWithFunction,

			// load all.
			loadAll,

			// generate page content.
			generatePageContent,

			// start server.
			startServer,

			// start Read-Eval-Print-Loop.
			startREPL;

			initMultiPlatformScripts = function() {

				var
				// platform name
				platformName,

				// platform info
				platformInfo;

				// multi platform.
				for (platformName in MULTI_PLATFORM_SUPPORT) {

					if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {

						platformInfo = MULTI_PLATFORM_SUPPORT[platformName];

						platformScripts[platformName] = platformInfo.initScript === undefined ? '' : platformInfo.initScript;
					}
				}
			};

			saveMultiPlatformScripts = function() {

				var
				// platform name
				platformName,

				// platform info
				platformInfo;

				// multi platform.
				for (platformName in MULTI_PLATFORM_SUPPORT) {
					if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
						platformInfo = MULTI_PLATFORM_SUPPORT[platformName];
						fs.writeFileSync(platformInfo.path, platformScripts[platformName]);
					}
				}
			};

			stringifyJSONWithFunction = function(data) {

				return JSON.stringify(data, function(key, value) {
					if ( typeof value === 'function') {
						return '__THIS_IS_FUNCTION_START__' + value.toString() + '__THIS_IS_FUNCTION_END__';
					}
					return value;
				}, '\t').replace(/("__THIS_IS_FUNCTION_START__(.*)__THIS_IS_FUNCTION_END__")/g, function(match, content) {
					return eval('(' + eval('"' + content.substring('"__THIS_IS_FUNCTION_START__'.length, content.length - '__THIS_IS_FUNCTION_END__"'.length) + '"') + ')').toString();
				});
			};

			loadAll = function(callback) {

				var
				// check is allowed folder.
				checkIsAllowedFolder,

				// init boxes.
				initBoxes,

				// load for server.
				loadForServer,

				// load for browser.
				loadForBrowser,

				// load for browser secured.
				loadForBrowserSecured,

				// load for multi platform.
				loadForMultiPlatform,

				// load.
				load,

				// scan folders.
				scanFolders,

				// load folders for server.
				loadFoldersForServer,

				// load folders for browser.
				loadFoldersForBrowser,

				// load folders for browser secured.
				loadFoldersForBrowserSecured,

				// load folders for multi platform
				loadFoldersForMultiPlatform,

				// load folders.
				loadFolders,

				// override config.
				overrideConfig,

				// load database.
				loadDB,

				// load css.
				loadCSS,

				// minify.
				minify,

				// load logo text.
				loadLogoText;

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
				};

				initBoxes = function() {

					fs.readdirSync(rootPath).forEach(function(boxName) {

						var
						// i
						i,

						// platform name
						platformName;

						if (checkIsAllowedFolder({
							path : boxName,
							name : boxName
						}) === true) {

							//LOADED: BOX
							BOX(boxName);

							// add to browser script.
							browserScript += 'BOX(\'' + boxName + '\');\n';

							// add to secured browser script.
							securedBrowserScript += 'BOX(\'' + boxName + '\');\n';

							// add to multi platform scripts.
							for (platformName in MULTI_PLATFORM_SUPPORT) {
								if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
									platformScripts[platformName] += 'BOX(\'' + boxName + '\');\n';
								}
							}
						}
					});
				};

				loadForServer = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERCASE.IO only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERCASE.IO').length) !== rootPath + '/UPPERCASE.IO') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERCASE_IO_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED', content);
									}

									// import.
									require(absolutePath + '.__UPPERCASE_IO_COMPILED');

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// import.
						require(absolutePath);

					} else if (extname === '.__UPPERCASE_IO_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERCASE_IO_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				loadForBrowser = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERCASE.IO only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERCASE.IO').length) !== rootPath + '/UPPERCASE.IO') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERCASE_IO_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED', content);

									} else {

										// get exists compiled file.
										content = fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString();
									}

									// add to browser script. (other lang)
									browserScript += content + '\n';

									// add to secured browser script. (other lang)
									securedBrowserScript += content + '\n';

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// get js file.
						content = fs.readFileSync(absolutePath).toString();

						// add to browser script.
						browserScript += content + '\n';

						// add to secured browser script.
						securedBrowserScript += content + '\n';

					} else if (extname === '.__UPPERCASE_IO_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERCASE_IO_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				loadForBrowserSecured = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERCASE.IO only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERCASE.IO').length) !== rootPath + '/UPPERCASE.IO') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERCASE_IO_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED', content);

									} else {

										// get exists compiled file.
										content = fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString();
									}

									// add to secured browser script. (other lang)
									securedBrowserScript += content + '\n';

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// get js file.
						content = fs.readFileSync(absolutePath).toString();

						// add to secured browser script.
						securedBrowserScript += content + '\n';

					} else if (extname === '.__UPPERCASE_IO_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERCASE_IO_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				loadForMultiPlatform = function(platformName, relativePath) {
					//REQUIRED: platformName
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// extension
					extension,

					// version
					version,

					// content
					content;

					// UPPERCASE.IO only using JavaScript.
					if (absolutePath.substring(0, (rootPath + '/UPPERCASE.IO').length) !== rootPath + '/UPPERCASE.IO') {

						// when other language.
						for (extension in MULTI_LANG_SUPPORT) {
							if (MULTI_LANG_SUPPORT.hasOwnProperty(extension) === true) {
								if (extname === '.' + extension) {

									// generate version.
									version = '//' + fs.statSync(absolutePath).mtime.getTime();

									if (
									// check exists compiled file.
									fs.existsSync(absolutePath + '.__UPPERCASE_IO_COMPILED') === false ||

									// check version.
									fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString().substring(0, version.length) !== version) {

										// compile.
										content = version + '\n' + MULTI_LANG_SUPPORT[extension](fs.readFileSync(absolutePath).toString(), absolutePath);
										fs.writeFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED', content);

									} else {

										// get exists compiled file.
										content = fs.readFileSync(absolutePath + '.__UPPERCASE_IO_COMPILED').toString();
									}

									// add to platform script. (other lang)
									platformScripts[platformName] += content + '\n';

									// return.
									return;
								}
							}
						}
					}

					if (extname === '.js' || extname === '.JS') {

						// get js file.
						content = fs.readFileSync(absolutePath).toString();

						// add to platform script.
						platformScripts[platformName] += content + '\n';

					} else if (extname === '.__UPPERCASE_IO_COMPILED') {

						if (fs.existsSync(absolutePath.substring(0, absolutePath.length - '.__UPPERCASE_IO_COMPILED'.length)) === false) {

							// delete trash compiled file.
							fs.unlinkSync(absolutePath);
						}
					}
				};

				load = function(relativePath) {
					//REQUIRED: relativePath

					var
					// platform name
					platformName;

					loadForServer(relativePath);
					loadForBrowser(relativePath);

					// multi platform.
					for (platformName in MULTI_PLATFORM_SUPPORT) {
						if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
							loadForMultiPlatform(platformName, relativePath);
						}
					}
				};

				scanFolders = function(folderName, func) {
					//REQUIRED: folderName
					//REQUIRED: func

					var
					// scan folder.
					scanFolder = function(path) {
						//REQUIRED: path

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
								scanFolder(folderPaths[i]);
							}
						}
					};

					//LOADED: FOR_BOX
					FOR_BOX(function(box) {
						scanFolder(box.boxName + '/' + folderName);
					});
				};

				loadFoldersForServer = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, loadForServer);
				};

				loadFoldersForBrowser = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, loadForBrowser);
				};

				loadFoldersForBrowserSecured = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, loadForBrowserSecured);
				};

				loadFoldersForMultiPlatform = function() {

					var
					// platform name
					platformName;

					// multi platform.
					for (platformName in MULTI_PLATFORM_SUPPORT) {
						if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
							scanFolders(platformName, function(relativePath) {
								loadForMultiPlatform(platformName, relativePath);
							});
						}
					}
				};

				loadFolders = function(folderName) {
					//REQUIRED: folderName

					scanFolders(folderName, load);
				};

				overrideConfig = function() {

					var
					// platform name
					platformName;

					if (params !== undefined) {

						if (params.CONFIG !== undefined) {

							EXTEND_DATA({
								origin : global.CONFIG,
								extend : params.CONFIG
							});

							// add to browser script.
							browserScript += 'EXTEND_DATA({ origin : global.CONFIG, extend : ' + stringifyJSONWithFunction(params.CONFIG) + ' });\n';

							// add to secured browser script.
							securedBrowserScript += 'EXTEND_DATA({ origin : global.CONFIG, extend : ' + stringifyJSONWithFunction(params.CONFIG) + ' });\n';

							// add to multi platform scripts.
							for (platformName in MULTI_PLATFORM_SUPPORT) {
								if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
									platformScripts[platformName] += 'EXTEND_DATA({ origin : global.CONFIG, extend : ' + stringifyJSONWithFunction(params.CONFIG) + ' });\n';
								}
							}
						}

						if (params.NODE_CONFIG !== undefined) {

							EXTEND_DATA({
								origin : global.NODE_CONFIG,
								extend : params.NODE_CONFIG
							});

							NODE_CONFIG.rootPath = rootPath;
						}

						if (params.BROWSER_CONFIG !== undefined) {

							// add to browser script.
							browserScript += 'EXTEND_DATA({ origin : global.BROWSER_CONFIG, extend : ' + stringifyJSONWithFunction(params.BROWSER_CONFIG) + ' });\n';

							// add to secured browser script.
							securedBrowserScript += 'EXTEND_DATA({ origin : global.BROWSER_CONFIG, extend : ' + stringifyJSONWithFunction(params.BROWSER_CONFIG) + ' });\n';
						}

						// add to multi platform scripts.
						for (platformName in MULTI_PLATFORM_SUPPORT) {
							if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {

								if (params[platformName + '_CONFIG'] !== undefined) {

									platformScripts[platformName] += 'EXTEND_DATA({ origin : global.' + platformName + '_CONFIG, extend : ' + stringifyJSONWithFunction(params[platformName + '_CONFIG']) + ' });\n';
								}
							}
						}
					}

					//!!! set version.
					CONFIG.version = sharedData.version;
					CONFIG.workerId = cluster.worker.id;

					// add to browser script.
					browserScript += 'CONFIG.version = ' + CONFIG.version + ';\n';
					browserScript += 'CONFIG.workerId = ' + CONFIG.workerId + ';\n';

					// add to secured browser script.
					securedBrowserScript += 'CONFIG.version = ' + CONFIG.version + ';\n';
					securedBrowserScript += 'CONFIG.workerId = ' + CONFIG.workerId + ';\n';

					// add to multi platform scripts.
					for (platformName in MULTI_PLATFORM_SUPPORT) {
						if (MULTI_PLATFORM_SUPPORT.hasOwnProperty(platformName) === true) {
							platformScripts[platformName] += 'CONFIG.version = ' + CONFIG.version + ';\n';
							platformScripts[platformName] += 'CONFIG.workerId = ' + CONFIG.workerId + ';\n';
						}
					}
				};

				loadDB = function() {

					if (NODE_CONFIG.isNotUsingDB === true) {

						callback();

					} else {

						NODE_CONFIG.maxDataCount = NODE_CONFIG.maxDataCount;

						if (NODE_CONFIG.isNotRequiringDBAuth !== true) {

							CONNECT_TO_DB_SERVER({
								name : NODE_CONFIG.dbName,
								host : NODE_CONFIG.dbHost,
								port : NODE_CONFIG.dbPort,
								username : NODE_CONFIG.dbUsername,
								password : NODE_CONFIG.dbPassword
							}, callback);

						} else {

							CONNECT_TO_DB_SERVER({
								name : NODE_CONFIG.dbName
							}, callback);
						}
					}
				};

				loadCSS = function(relativePath) {
					//REQUIRED: relativePath

					var
					// absolute path
					absolutePath = rootPath + '/' + relativePath,

					// extname
					extname = path.extname(relativePath),

					// content
					content = fs.readFileSync(absolutePath).toString();

					if (extname === '.css') {

						// add to css.
						css += content;
					}
				};

				minify = function() {

					var
					// uglify-js
					uglifyJS = UPPERCASE.IO.MODULE('uglify-js'),

					// sqwish
					sqwish = UPPERCASE.IO.MODULE('sqwish'),

					// platform name
					platformName;

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

					// minify css.
					css = sqwish.minify(css);

					// minify multi platform scripts.
					for (platformName in platformScripts) {

						if (platformScripts.hasOwnProperty(platformName) === true) {

							platformScripts[platformName] = uglifyJS.minify(platformScripts[platformName], {
								fromString : true,
								mangle : true
							}).code;
						}
					}
				};

				loadLogoText = function() {

					logoText = fs.readFileSync(rootPath + '/UPPERCASE.IO/LOGO');

					browserScript = '/* Welcome to JavaScript World! :)\n' + logoText + '\n  Contact: ' + CONFIG.contactAddress + '\n\n*/' + browserScript;

					css = '/* Welcome to CSS World! :)\n' + logoText + '\n  Contact: ' + CONFIG.contactAddress + '\n\n*/' + css;
				};

				// load base scripts.
				load('UPPERCASE.IO/UPPERCASE.JS-COMMON.js');

				// load UPPERCASE.IO-OCTOPUS BOX Core.
				load('UPPERCASE.IO/OCTOPUS/UPPERCASE.IO-BOX/CORE.js');

				initBoxes();

				loadForBrowser('UPPERCASE.IO/UPPERCASE.JS-BROWSER.js');
				loadForServer('UPPERCASE.IO/UPPERCASE.JS-NODE.js');

				// load UPPERCASE.IO-OCTOPUS.
				loadForBrowser('UPPERCASE.IO/OCTOPUS/UPPERCASE.IO-BOX/BROWSER.js');
				loadForServer('UPPERCASE.IO/OCTOPUS/UPPERCASE.IO-DB/NODE.js');
				loadForServer('UPPERCASE.IO/OCTOPUS/UPPERCASE.IO-TRANSPORT/NODE.js');

				loadFolders('COMMON');
				loadFoldersForServer('SERVER');
				loadFoldersForBrowser('BROWSER');
				loadFoldersForBrowserSecured('BROWSER_SECURED');
				loadFoldersForMultiPlatform();

				overrideConfig();

				loadForBrowser('UPPERCASE.IO/BROWSER_INIT.js');

				// load css.
				loadCSS('UPPERCASE.IO/STYLE.css');

				if (CONFIG.isDevMode !== true) {
					minify();
				}

				loadLogoText();

				loadDB(callback);
			};

			generatePageContent = function() {

				pageContent += '<!DOCTYPE html>';

				pageContent += '<!--\n\n  Welcome! :)\n' + logoText + '\n  Contact: ' + CONFIG.contactAddress + '\n\n-->';

				pageContent += '<html>';
				pageContent += '<head>';
				pageContent += '<meta charset="utf-8">';
				pageContent += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' + (CONFIG.isMobileFullScreen === true ? ', minimal-ui' : '') + '">';
				pageContent += '<meta name="google" value="notranslate">';

				if (CONFIG.googleSiteVerificationKey !== undefined) {
					pageContent += '<meta name="google-site-verification" content="' + CONFIG.googleSiteVerificationKey + '" />';
				}

				pageContent += '<meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">';

				if (CONFIG.description !== undefined) {
					pageContent += '<meta name="description" content="' + CONFIG.description + '">';
				}

				pageContent += '<link href="/favicon.ico" rel="shortcut icon">';
				pageContent += '<title>' + CONFIG.defaultTitle + '</title>';

				// load css.
				pageContent += '<link rel="stylesheet" type="text/css" href="__CSS?' + CONFIG.version + '" />';
				pageContent += '</head>';
				pageContent += '<body>';

				// show please enable JavaScript msg.
				pageContent += '<noscript>';
				pageContent += '<p style="padding:15px;">';
				pageContent += '자바스크립트 기능이 꺼져있습니다. 브라우저의 자바스크립트 기능을 켜 주시기 바랍니다. 감사합니다~! ^-^';
				pageContent += '<br>';
				pageContent += 'JavaScript is disabled. Please enable JavaScript in your browser. Thank you~! :)';
				pageContent += '</p>';
				pageContent += '</noscript>';

				// load js.
				pageContent += '<script type="text/javascript" src="__SCRIPT?' + CONFIG.version + '"></script>';
				pageContent += '</body>';
				pageContent += '</html>';
			};

			startServer = function() {

				var
				//IMPORT: http
				http = require('http'),

				//IMPORT: https
				https = require('https'),

				//IMPORT: socket.io
				socketIO = UPPERCASE.IO.MODULE('socket.io'),

				//IMPORT: formidable.IncomingForm
				IncomingForm = UPPERCASE.IO.MODULE('formidable').IncomingForm,

				//IMPORT: imagemagick
				imagemagick = UPPERCASE.IO.MODULE('imagemagick'),

				// server
				server,

				// secured server
				securedServer,

				// io
				io,

				// serve.
				serve;

				serve = function(req, res) {
					//REQUIRED: req
					//REQUIRED: res

					var
					// url
					url = req.url,

					// uri
					uri,

					// version
					version,

					// is secured
					isSecured,

					// box name
					boxName,

					// folder name
					folderName,

					// response cache
					responseCache = {},

					// get content type from uri.
					getContentTypeFromURI,

					// get encoding from content type.
					getEncodingFromContentType,

					// separate version.
					separateVersion,

					// separate uri.
					separateURI,

					// separate box name.
					separateBoxName,

					// separate folder name.
					separateFolderName,

					// check is authed.
					checkIsAuthed,

					// check is cached.
					checkIsCached,

					// redirect.
					redirect,

					// response auth.
					responseAuth,

					// response cached.
					responseCached,

					// response.
					response,

					// serve favicon.
					serveFavicon,

					// serve auth.
					serveAuth,

					// serve index.
					serveIndex,

					// serve browser script.
					serveBrowserScript,

					// serve css.
					serveCSS,

					// serve upload.
					serveUpload,

					// serve resource.
					serveResource,

					// serve resource final.
					serveResourceFinal,

					// serve error page.
					serveErrorPage;

					getContentTypeFromURI = function(uri) {
						//REQUIRED: uri

						var
						// extname
						extname = path.extname(uri);

						if (extname === '.png') {
							return 'image/png';
						}

						if (extname === '.jpg' || extname === '.jpeg') {
							return 'image/jpeg';
						}

						if (extname === '.gif') {
							return 'image/gif';
						}

						if (extname === '.js') {
							return 'text/javascript';
						}

						if (extname === '.json') {
							return 'application/json';
						}

						if (extname === '.css') {
							return 'text/css';
						}

						if (extname === '.txt') {
							return 'text/plain';
						}

						if (extname === '.html') {
							return 'text/html';
						}

						if (extname === '.swf') {
							return 'application/x-shockwave-flash';
						}

						return 'application/octet-stream';
					};

					getEncodingFromContentType = function(contentType) {
						//REQUIRED: contentType

						if (contentType === 'text/javascript') {
							return 'utf-8';
						}

						if (contentType === 'text/css') {
							return 'utf-8';
						}

						if (contentType === 'text/plain') {
							return 'binary';
						}

						if (contentType === 'text/html') {
							return 'utf-8';
						}

						if (contentType === 'image/png') {
							return 'binary';
						}

						if (contentType === 'image/jpeg') {
							return 'binary';
						}

						if (contentType === 'image/gif') {
							return 'binary';
						}

						if (contentType === 'application/x-shockwave-flash') {
							return 'binary';
						}

						return 'binary';
					};

					separateVersion = function() {

						var
						// extras
						i = url.indexOf('?');

						if (i !== -1) {
							version = parseInt(url.substring(i + 1), 10);
							url = url.substring(0, i);
						}
					};

					separateURI = function() {
						uri = url.substring(1);
					};

					separateBoxName = function() {

						var
						// extras
						i = uri.indexOf('/');

						if (i === -1) {
							boxName = CONFIG.defaultBoxName;
						} else {
							boxName = uri.substring(0, i);
							uri = uri.substring(i + 1);
						}
					};

					separateFolderName = function() {

						var
						// extras
						i = uri.indexOf('/');

						if (i === -1) {
							folderName = '';
						} else {
							folderName = uri.substring(0, i);
							uri = uri.substring(i + 1);
						}
					};

					checkIsAuthed = function() {

						var
						// sps
						sps;

						if (req.headers.authorization === undefined) {
							return false;
						}

						sps = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');

						console.log('Decoded authorization: ' + sps);

						return sps[0] === NODE_CONFIG.securedUsername && sps[1] === NODE_CONFIG.securedPassword;
					};

					checkIsCached = function(isFinal) {
						//OPTIONAL: isFinal

						return isFinal === true ?

						// just cache.
						(req.headers['if-none-match'] !== undefined || req.headers['if-modified-since'] !== undefined) :

						// check version.
						(
							// check ETag.
							(req.headers['if-none-match'] !== undefined && parseInt(req.headers['if-none-match'], 10) === CONFIG.version) ||

							// check Last-Modified
							(req.headers['if-modified-since'] !== undefined && new Date(req.headers['if-modified-since']).getTime() === parseInt(CONFIG.version / 1000, 10) * 1000)
						);
					};

					redirect = function(url) {
						//REQUIRED: url

						res.writeHead(302, {
							'Location' : url
						});
						res.end();
					};

					responseAuth = function() {

						console.log('Someone is trying to AUTH!: ' + req.connection.remoteAddress);

						res.statusCode = 401;
						res.setHeader('WWW-Authenticate', 'Basic realm="AUTH"');
						res.end();
					};

					responseCached = function() {
						res.statusCode = 304;
						res.end();
					};

					response = function(params) {
						//REQUIRED: params
						//REQUIRED: params.content
						//REQUIRED: params.contentType
						//REQUIRED: params.encoding
						//OPTIONAL: params.isToCache
						//OPTIONAL: params.lastModifiedTime

						var
						// content
						content = params.content,

						// content type
						contentType = params.contentType,

						// encoding
						encoding = params.encoding,

						// is to cache
						isToCache = params.isToCache,

						// last modified time
						lastModifiedTime = params.lastModifiedTime;

						res.setHeader('Content-Type', contentType);

						if (CONFIG.isDevMode !== true) {

							// last modified time cache.
							if (lastModifiedTime !== undefined) {
								res.setHeader('ETag', lastModifiedTime.getTime());
								res.setHeader('Last-Modified', lastModifiedTime.toUTCString());
							}

							// version cache.
							else if (isToCache === true) {
								res.setHeader('ETag', CONFIG.version);
								res.setHeader('Last-Modified', new Date(CONFIG.version).toUTCString());
							}
						}

						res.statusCode = 200;
						res.end(content, encoding);
					};

					serveFavicon = function() {

						fs.exists(CONFIG.defaultBoxName + '/favicon.ico', function(exists) {

							// if exists favicon
							if (exists === true) {

								fs.readFile(CONFIG.defaultBoxName + '/favicon.ico', 'binary', function(error, content) {

									if (error === null) {

										res.end(content, 'binary');
									}
								});
							}

							// if not exists favicon, use UPPERCASE.IO's favicon.
							else {

								fs.readFile('UPPERCASE.IO/favicon.ico', 'utf-8', function(error, content) {

									if (error === null) {

										res.end(content, 'binary');
									}
								});
							}
						});
					};

					serveAuth = function() {

						// if need auth
						if (req.headers.authorization === undefined) {
							responseAuth();
						}

						// if authed or not authed
						else {

							// if authed
							if (checkIsAuthed() === true) {

								// serve authed page.
								fs.exists(CONFIG.defaultBoxName + '/AUTHED.html', function(exists) {

									// if exists authed page
									if (exists === true) {

										fs.readFile(CONFIG.defaultBoxName + '/AUTHED.html', 'utf-8', function(error, content) {

											if (error === null) {

												res.writeHead(500, {
													'Content-Type' : 'text/html'
												});
												res.end(content, 'utf-8');
											}
										});
									}

									// if not exists authed page, use UPPERCASE.IO's authed page.
									else {

										fs.readFile('UPPERCASE.IO/AUTHED.html', 'utf-8', function(error, content) {

											if (error === null) {

												res.writeHead(500, {
													'Content-Type' : 'text/html'
												});
												res.end(content, 'utf-8');
											}
										});
									}
								});
							}

							// if not authed
							else {

								fs.readFile('UPPERCASE.IO/AUTH_ERROR.html', 'utf-8', function(error, content) {

									if (error === null) {

										res.writeHead(500, {
											'Content-Type' : 'text/html'
										});
										res.end(content, 'utf-8');
									}
								});
							}
						}
					};

					serveIndex = function() {

						response({
							content : pageContent,
							contentType : 'text/html',
							encoding : 'utf-8'
						});
					};

					serveBrowserScript = function() {

						if (checkIsCached() === true && CONFIG.isDevMode !== true) {

							responseCached();

						} else if (version !== CONFIG.version && CONFIG.isDevMode !== true) {

							redirect(url + '?' + CONFIG.version);

						} else if (checkIsAuthed() === true) {

							response({
								content : securedBrowserScript,
								contentType : 'text/javascript',
								encoding : 'utf-8',
								isToCache : true
							});

						} else {

							response({
								content : browserScript,
								contentType : 'text/javascript',
								encoding : 'utf-8',
								isToCache : true
							});
						}
					};

					serveCSS = function() {

						if (checkIsCached() === true && CONFIG.isDevMode !== true) {

							responseCached();

						} else if (version !== CONFIG.version && CONFIG.isDevMode !== true) {

							redirect(url + '?' + CONFIG.version);

						} else {

							response({
								content : css,
								contentType : 'text/css',
								encoding : 'utf-8',
								isToCache : true
							});
						}
					};

					serveUpload = function() {

						var
						// form
						form = new IncomingForm(),

						// file data set
						fileDataSet = [],

						// field data
						fieldData = {};

						form.uploadDir = '__RF/' + boxName + '/__TEMP/';

						if (fs.existsSync(rootPath + '/' + form.uploadDir) === false) {
							console.log('Not exists folder: ' + rootPath + '/' + form.uploadDir);
						}

						if (global[boxName] !== undefined && fs.existsSync(rootPath + '/' + form.uploadDir) === true) {

							form.on('field', function(fieldName, value) {

								fieldData[fieldName] = value;

							}).on('file', function(fieldName, file) {

								fileDataSet.push({
									tempPath : file.path,
									size : file.size,
									name : file.name,
									type : file.type,
									lastModifiedTime : file.lastModifiedDate
								});

							}).on('end', function() {

								var
								// upload file database
								uploadFileDB = global[boxName].DB('__UPLOAD_FILE'),

								// uploaded count
								uploadedCount = 0;

								EACH(fileDataSet, function(fileData, i) {

									var
									// temp path
									tempPath = fileData.tempPath;

									if (fileData.size > CONFIG.maxUploadFileMB * 1024 * 1024) {

										// file size error.
										res.writeHead(200, {
											'Content-Type' : 'text/html'
										});
										res.end('<script>errorCode=\'SIZE\'</script>', 'utf-8');

										return false;
									}

									EACH(fieldData, function(value, name) {
										if (value.trim() !== '') {
											fileData[name] = value;
										}
									});

									REMOVE({
										data : fileData,
										key : 'tempPath'
									});

									imagemagick.readMetadata(tempPath, function(error, metadata) {

										var
										// f.
										f = function() {

											uploadFileDB.create(fileData, function(errorMsg, savedData) {

												var
												//IMPORT: mv
												mv = UPPERCASE.IO.MODULE('mv'),

												// target path
												tergetPath = rootPath + '/__RF/' + boxName + '/' + savedData.id;

												if (errorMsg === undefined) {

													mv(tempPath, tergetPath, function() {

														uploadedCount += 1;

														if (uploadedCount === fileDataSet.length) {

															EACH(fileDataSet, function(fileData, i) {
																fileDataSet[i] = PACK_DATA(fileData);
															});

															res.writeHead(200, {
																'Content-Type' : 'text/html'
															});
															res.end('<script>fileDataSet=' + JSON.stringify(fileDataSet) + '</script>', 'utf-8');
														}

														console.log('File \'' + tergetPath + '\' (' + savedData.name + ', ' + savedData.size + ' byte) uploaded.');
													});
												}
											});
										};

										if (metadata.exif !== undefined) {
											fileData.exif = metadata.exif;

											imagemagick.convert([tempPath, '-auto-orient', tempPath], function(error) {
												f();
											});
										} else {
											f();
										}
									});
								});

							}).on('error', function(error) {

								// unknown error.
								res.writeHead(200, {
									'Content-Type' : 'text/html'
								});
								res.end('<script>errorCode=\'ERROR\'</script>', 'utf-8');
							});

							form.parse(req);

						} else {

							// unknown error.
							res.writeHead(200, {
								'Content-Type' : 'text/html'
							});
							res.end('<script>errorCode=\'ERROR\'</script>', 'utf-8');
						}
					};

					serveResource = function() {

						var
						// full path
						fullPath,

						// content type
						contentType,

						// encoding
						encoding;

						if (uri === 'UPPERCASE.JS-BROWSER-FIX/IE/BROWSER/DOM/TAG/IFRAME_FIX_REDIRECT.html') {

							fullPath = rootPath + '/' + boxName + '/R/' + uri;

							contentType = getContentTypeFromURI(uri);

							encoding = getEncodingFromContentType(contentType);

							fs.exists(fullPath, function(exists) {

								if (exists === true) {

									fs.readFile(fullPath, encoding, function(error, content) {

										if (error !== null) {

											serveErrorPage(error);

										} else {

											response({
												content : content,
												contentType : contentType,
												encoding : encoding
											});
										}
									});
								}

								// if not exists
								else {
									serveErrorPage();
								}
							});

						} else if (checkIsCached() === true) {

							responseCached();

						} else if (version !== CONFIG.version) {

							redirect(url + '?' + CONFIG.version);

						} else {

							fullPath = rootPath + '/' + boxName + '/R/' + uri;

							if (responseCache[fullPath] !== undefined) {

								response(responseCache[fullPath]);

							} else {

								contentType = getContentTypeFromURI(uri);

								encoding = getEncodingFromContentType(contentType);

								fs.exists(fullPath, function(exists) {

									if (exists === true) {

										fs.readFile(fullPath, encoding, function(error, content) {

											if (error !== null) {

												serveErrorPage(error);

											} else {

												response(responseCache[fullPath] = {
													content : content,
													contentType : contentType,
													encoding : encoding,
													isToCache : true
												});
											}
										});
									}

									// if not exists
									else {
										serveErrorPage();
									}
								});
							}
						}
					};

					serveResourceFinal = function() {

						var
						// full path
						fullPath;

						if (checkIsCached(true) === true) {

							responseCached();

						} else {

							fullPath = rootPath + '/__RF/' + boxName + '/' + uri;

							fs.exists(fullPath, function(exists) {

								if (exists === true) {

									fs.readFile(fullPath, 'binary', function(error, content) {

										if (error !== null) {

											serveErrorPage(error);

										} else {

											fs.stat(fullPath, function(error, stat) {

												if (error !== null) {

													serveErrorPage(error);

												} else {

													response({
														content : content,
														contentType : 'application/octet-stream',
														encoding : 'binary',
														lastModifiedTime : stat.mtime
													});
												}
											});
										}
									});
								}

								// if not exists
								else {
									serveErrorPage();
								}
							});
						}
					};

					serveErrorPage = function(error) {

						if (error !== undefined) {
							console.log('[UPPERCASE.IO] ERROR:', error);
						}

						fs.exists(CONFIG.defaultBoxName + '/ERROR.html', function(exists) {

							// if exists error page
							if (exists === true) {

								fs.readFile(CONFIG.defaultBoxName + '/ERROR.html', 'utf-8', function(error, content) {

									if (error === null) {

										res.writeHead(500, {
											'Content-Type' : 'text/html'
										});
										res.end(content, 'utf-8');
									}
								});
							}

							// if not exists error page, use UPPERCASE.IO's error page.
							else {

								fs.readFile('UPPERCASE.IO/ERROR.html', 'utf-8', function(error, content) {

									if (error === null) {

										res.writeHead(500, {
											'Content-Type' : 'text/html'
										});
										res.end(content, 'utf-8');
									}
								});
							}
						});
					};

					separateVersion();
					separateURI();

					if (uri === 'favicon.ico') {
						serveFavicon();
					} else if (uri === '__AUTH') {
						serveAuth();
					} else if (uri === '') {
						serveIndex();
					} else if (uri === '__SCRIPT') {
						serveBrowserScript();
					} else if (uri === '__CSS') {
						serveCSS();
					} else {

						separateBoxName();
						separateFolderName();

						if (folderName === 'R') {
							serveResource(boxName);
						} else if (folderName === 'RF') {
							serveResourceFinal(boxName);
						} else if (uri === '__UPLOAD' && req.method.toUpperCase() === 'POST') {
							serveUpload();
						} else {
							serveErrorPage();
						}
					}
				};

				server = http.createServer(serve).listen(CONFIG.port);

				// init secured sever.
				if (NODE_CONFIG.securedPort !== undefined) {

					securedServer = https.createServer({
						key : fs.readFileSync(rootPath + '/' + NODE_CONFIG.securedKeyFileName),
						cert : fs.readFileSync(rootPath + '/' + NODE_CONFIG.securedCrtFileName)
					}, serve).listen(NODE_CONFIG.securedPort);
				}

				io = socketIO.listen(CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId]);
				console.log('Socket.IO port:', CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId]);

				if (CONFIG.isDevMode === true) {
					io.set('log level', 2);
				} else {
					io.set('log level', 1);
				}

				io.configure(function() {
					//io.set('store', new socketIO.RedisStore());
					io.set('flash policy port', CONFIG.flashPolicyServerPort === undefined ? CONFIG.port + 1955 : CONFIG.flashPolicyServerPort);
					io.set('transports', CONFIG.transports);
				});

				CONNS.socketPack = io.sockets;
				CONNS.broadcastToAllWorkers = broadcast;

				INIT_OBJECTS();

				on('emitToAllSockets', function(params) {
					CONNS.emitToAllSockets(params);
				});

				FOR_BOX(function(box) {
					if (box.MAIN !== undefined) {
						box.MAIN(workerData, {
							on : on,
							broadcast : broadcast
						});
					}
				});

				console.log('[UPPERCASE.IO] ' + CONFIG.defaultTitle + ' WORKER #' + workerData.id + ' (PID:' + workerData.pid + ') BOOTed. => http://localhost:' + CONFIG.port + (NODE_CONFIG.securedPort !== undefined ? ' SECUREd => https://localhost:' + NODE_CONFIG.securedPort : ''));
				//console.log('[UPPERCASE.IO] ' + CONFIG.defaultTitle + ' WORKER BOOTed. => http://localhost:' + CONFIG.port + (NODE_CONFIG.securedPort !== undefined ? ' SECUREd => https://localhost:' + NODE_CONFIG.securedPort : ''));
			};

			startREPL = function() {

				DELAY(1, function() {

					var
					// relp
					repl = require('repl');

					repl.start({
						prompt : 'UPPERCASE.IO> ',
						input : process.stdin,
						output : process.stdout
					});
				});
			};

			initMultiPlatformScripts();

			loadAll(function() {

				saveMultiPlatformScripts();

				generatePageContent();
				startServer();

				// when first worker, start REPL.
				//if (cluster.worker.id === 1) {
				if (NODE_CONFIG.isUsingREPL === true) {
					startREPL();
				}
				//}

			});
		},

		// fork.
		fork = function() {

			cluster.fork().send({
				version : version
			});
		};

		//TODO: websocket과 socket 통신을 하는 부분, http 통신을 하는 부분은 멀티코어로 작성하고,
		//TODO: socket.io는 따로 떼서 websocket을 지원하지 않는 브라우저일 경우만 처리하는 하나의 프로세스로 만든다.
		work({
			version : version
		});

		if (false) {

			if (cluster.isMaster) {

				// fork workers.
				for ( i = 0; i < cpuCount; i += 1) {
					fork();
				}

				cluster.on('exit', function(worker, code, signal) {
					console.log('[UPPERCASE.IO] WORKER #' + worker.id + ' (PID:' + worker.process.pid + ') died. (' + (signal !== undefined ? signal : code) + '). restarting...');
					fork();
				});

			} else {
				process.on('message', work);
			}
		}
	});
};
