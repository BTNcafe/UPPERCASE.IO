/**
 * Browser initialize.
 */
LOAD('/UPPERCASE.IO/R/UPPERCASE.JS-BROWSER-FIX/FIX.js');

global.onload = function() {'use strict';

	var
	// socket
	socket = io.connect(undefined, {

		port : CONFIG.socketIOPorts === undefined || CONFIG.socketIOPorts[CONFIG.workerId] === undefined ? CONFIG.port + CONFIG.workerId : CONFIG.socketIOPorts[CONFIG.workerId],

		'flash policy port' : CONFIG.flashPolicyServerPort === undefined ? CONFIG.port + 1955 : CONFIG.flashPolicyServerPort,

		secure : false,

		reconnect : false,

		// connection timeout is 5 seconds.
		'connect timeout' : 5000,

		transports : CONFIG.transports

	}),

	// reconnecting indicator img
	reconnectingIndicatorImg = IMG({
		src : BROWSER_CONFIG.loadingIndicatorImgUrl
	}),

	// connecting panel
	connectingPanel = (BROWSER_CONFIG.createConnectingPanel !== undefined ? BROWSER_CONFIG.createConnectingPanel() : TABLE({
		style : {
			position : 'absolute',
			left : 0,
			top : 0,
			margin : 0,
			padding : 0,
			width : '100%',
			height : '100%'
		},
		c : [TR({
			style : {
				margin : 0,
				padding : 0
			},
			c : [TD({
				style : {
					margin : 0,
					padding : 0,
					textAlign : 'center'
				},
				c : [IMG({
					src : BROWSER_CONFIG.loadingIndicatorImgUrl
				}), P({
					style : {
						marginTop : 10
					},
					c : ['CONNECTING...']
				})]
			})]
		})]
	})).appendTo(DOM({
		tag : 'body'
	}));

	socket.on('connect', function() {

		var
		// browser info
		browserInfo,

		// is not support browser version
		isNotSupportBrowserVersion,

		// run.
		run;

		connectingPanel.remove();

		CONN.socket = socket;

		// init all objects.
		INIT_OBJECTS();

		// time sync.
		TIME_SYNC();

		run = function() {

			var
			// disconnected panel
			disconnectedPanel;

			FOR_BOX(function(box) {

				if (box.MAIN !== undefined) {
					box.MAIN();
				}

				if (box.MAIN_SECURED !== undefined) {
					box.MAIN_SECURED();
				}
			});

			socket.on('disconnect', function() {

				var
				// reload.
				reload;

				disconnectedPanel = (BROWSER_CONFIG.createDisconnectedPanel !== undefined ? BROWSER_CONFIG.createDisconnectedPanel() : TABLE({
					style : {
						backgroundColor : RGBA([0, 0, 0, 0.8]),
						position : 'fixed',
						left : 0,
						top : 0,
						margin : 0,
						padding : 0,
						width : '100%',
						height : '100%',
						zIndex : 999999
					},
					c : [TR({
						style : {
							margin : 0,
							padding : 0
						},
						c : [TD({
							style : {
								margin : 0,
								padding : 0,
								textAlign : 'center'
							},
							c : [reconnectingIndicatorImg, P({
								style : {
									marginTop : 10
								},
								c : ['CONNECTING...']
							})]
						})]
					})]
				})).appendTo(BODY);

				reload = RAR(function() {

					var
					// http request
					httpRequest;

					if (window.XMLHttpRequest !== undefined) {
						httpRequest = new XMLHttpRequest();
					}

					// if IE.
					else if (window.ActiveXObject) {
						try {
							httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
						} catch (e) {
							try {
								httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
							} catch (e2) {
								// ignore.
							}
						}
					}

					if (httpRequest === undefined) {

						location.reload();

					} else {

						httpRequest.onreadystatechange = function() {
							if (httpRequest.readyState === 4) {
								if (httpRequest.status === 200) {
									location.reload();
								} else {

									// retry.
									DELAY(1, function() {
										reload();
									});
								}
							}
						};

						httpRequest.open('GET', '/');
						httpRequest.send();
					}
				});
			});

			global.onbeforeunload = function(e) {

				if (INPUT.getFocusingInputIds().length > 0) {

					if (disconnectedPanel !== undefined) {
						disconnectedPanel.remove();

						DELAY(1, function() {

							alert(MSG({
								ko : '서버와의 접속이 끊어졌기 때문에 작성중인 폼을 처리할 수 없습니다. 작성중인 폼을 다른 곳에 복사하신 후, 새로고침해주시기 바랍니다.',
								en : 'Unable to process the request, disconnected from the server. Please copy the commands and paste them again after refreshing the page.'
							}));

							// create refresh button.
							A({
								style : {
									position : 'fixed',
									right : 10,
									top : 10
								},
								c : [IMG({
									src : UPPERCASE.IO.R('refresh.png')
								})],
								on : {
									tap : function() {
										location.reload();
									}
								}
							}).appendTo(BODY);
						});

						return MSG({
							ko : '서버와의 연결이 끊어져 새로고침을 시도합니다. 새로고침하면 작성중인 폼이 초기화됩니다. 새로고침하시겠습니까?',
							en : 'Disconnected from the server, trying to refresh. Once refresh the page, any incomplete form will be reset. Do you want to you continue?'
						});

					} else {

						return MSG({
							ko : '새로고침하면 작성중인 폼이 초기화됩니다. 새로고침하시겠습니까?',
							en : 'Once refresh the page, any incomplete form will be reset. Do you want to you continue?'
						});
					}
				}
			};
		};

		browserInfo = INFO.getBrowserInfo();

		EACH(BROWSER_CONFIG.minBrowserVersions, function(version, browserName) {
			if (browserInfo.name === browserName && browserInfo.version < version) {
				isNotSupportBrowserVersion = true;
				return false;
			}
		});

		if (isNotSupportBrowserVersion !== true) {
			run();
		} else {

			BROWSER_CONFIG.createNotSupportBrowserVersionPanel !== undefined ? BROWSER_CONFIG.createNotSupportBrowserVersionPanel().appendTo(BODY) : RUN(function() {

				var
				// wrapper
				wrapper;

				wrapper = DIV({
					style : {
						padding : 10
					}
				}).appendTo(BODY);

				P({
					c : [MSG({
						ko : '최신 브라우저를 이용하여 접속하여 주십시오.',
						en : 'Please connect using a modern browser.'
					})]
				}).appendTo(wrapper);

				EACH(BROWSER_CONFIG.minBrowserVersions, function(version, browserName) {

					if (browserInfo.name === browserName && browserInfo.version > 0 && browserInfo.version < version) {

						P({
							c : [MSG({
								ko : '접속하신 브라우저의 버전에서는 접속하실 수 없습니다. ' + browserName + '를 ' + version + '이상의 버젼으로 업그레이드 해 주시기 바랍니다.',
								en : 'You can not access using this version ' + browserName + ' browser. Please upgrade ' + browserName + ' browser to version ' + version + ' or higher.'
							})]
						}).appendTo(wrapper);

						return false;
					}
				});

				DIV({
					style : {
						marginTop : 10
					},
					c : [A({
						style : {
							flt : 'left',
							textAlign : 'center',
							color : '#fff'
						},
						href : 'http://www.google.com/chrome',
						target : '_blank',
						c : [IMG({
							src : UPPERCASE.IO.R('BROWSER_ICONS/CHROME.png')
						}), H3({
							c : ['Chrome']
						})]
					}), A({
						style : {
							flt : 'left',
							textAlign : 'center',
							color : '#fff'
						},
						href : 'http://www.mozilla.com/firefox',
						target : '_blank',
						c : [IMG({
							src : UPPERCASE.IO.R('BROWSER_ICONS/FIREFOX.png')
						}), H3({
							c : ['Firefox']
						})]
					}), A({
						style : {
							flt : 'left',
							textAlign : 'center',
							color : '#fff'
						},
						href : 'http://www.opera.com',
						target : '_blank',
						c : [IMG({
							src : UPPERCASE.IO.R('BROWSER_ICONS/OPERA.png')
						}), H3({
							c : ['Opera']
						})]
					}), A({
						style : {
							flt : 'left',
							textAlign : 'center',
							color : '#fff'
						},
						href : 'http://windows.microsoft.com/ko-kr/internet-explorer/ie-11-worldwide-languages',
						target : '_blank',
						c : [IMG({
							src : UPPERCASE.IO.R('BROWSER_ICONS/IE.png')
						}), H3({
							c : ['Internet Explorer 11']
						})]
					}), A({
						style : {
							flt : 'left',
							textAlign : 'center',
							color : '#fff'
						},
						href : 'http://www.apple.com/kr/safari',
						target : '_blank',
						c : [IMG({
							src : UPPERCASE.IO.R('BROWSER_ICONS/SAFARI.png')
						}), H3({
							c : ['Safari']
						})]
					}), CLEAR_BOTH()]
				}).appendTo(wrapper);
			});
		}
	});
};
