LOAD("/UPPERCASE.IO/R/UPPERCASE.JS-BROWSER-FIX/FIX.js"),global.onload=function(){"use strict";var e=io.connect(void 0,{port:void 0===CONFIG.socketIOPorts||void 0===CONFIG.socketIOPorts[CONFIG.workerId]?CONFIG.port+CONFIG.workerId:CONFIG.socketIOPorts[CONFIG.workerId],"flash policy port":void 0===CONFIG.flashPolicyServerPort?CONFIG.port+1955:CONFIG.flashPolicyServerPort,secure:!1,reconnect:!1,"connect timeout":5e3,transports:CONFIG.transports}),t=IMG({src:BROWSER_CONFIG.loadingIndicatorImgUrl}),o=(void 0!==BROWSER_CONFIG.createConnectingPanel?BROWSER_CONFIG.createConnectingPanel():TABLE({style:{position:"absolute",left:0,top:0,margin:0,padding:0,width:"100%",height:"100%"},c:[TR({style:{margin:0,padding:0},c:[TD({style:{margin:0,padding:0,textAlign:"center"},c:[IMG({src:BROWSER_CONFIG.loadingIndicatorImgUrl}),P({style:{marginTop:10},c:["CONNECTING..."]})]})]})]})).appendTo(DOM({tag:"body"}));e.on("connect",function(){var n,r,c;o.remove(),CONN.socket=e,INIT_OBJECTS(),TIME_SYNC(),c=function(){var o;FOR_BOX(function(e){void 0!==e.MAIN&&e.MAIN(),void 0!==e.MAIN_SECURED&&e.MAIN_SECURED()}),e.on("disconnect",function(){var e;o=(void 0!==BROWSER_CONFIG.createDisconnectedPanel?BROWSER_CONFIG.createDisconnectedPanel():TABLE({style:{backgroundColor:RGBA([0,0,0,.8]),position:"fixed",left:0,top:0,margin:0,padding:0,width:"100%",height:"100%",zIndex:999999},c:[TR({style:{margin:0,padding:0},c:[TD({style:{margin:0,padding:0,textAlign:"center"},c:[t,P({style:{marginTop:10},c:["CONNECTING..."]})]})]})]})).appendTo(BODY),e=RAR(function(){var t;if(void 0!==window.XMLHttpRequest)t=new XMLHttpRequest;else if(window.ActiveXObject)try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(o){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(n){}}void 0===t?location.reload():(t.onreadystatechange=function(){4===t.readyState&&(200===t.status?location.reload():DELAY(1,function(){e()}))},t.open("GET","/"),t.send())})}),global.onbeforeunload=function(){return INPUT.getFocusingInputIds().length>0?void 0!==o?(o.remove(),DELAY(1,function(){alert(MSG({ko:"서버와의 접속이 끊어졌기 때문에 작성중인 폼을 처리할 수 없습니다. 작성중인 폼을 다른 곳에 복사하신 후, 새로고침해주시기 바랍니다.",en:"Unable to process the request, disconnected from the server. Please copy the commands and paste them again after refreshing the page."})),A({style:{position:"fixed",right:10,top:10},c:[IMG({src:UPPERCASE.IO.R("refresh.png")})],on:{tap:function(){location.reload()}}}).appendTo(BODY)}),MSG({ko:"서버와의 연결이 끊어져 새로고침을 시도합니다. 새로고침하면 작성중인 폼이 초기화됩니다. 새로고침하시겠습니까?",en:"Disconnected from the server, trying to refresh. Once refresh the page, any incomplete form will be reset. Do you want to you continue?"})):MSG({ko:"새로고침하면 작성중인 폼이 초기화됩니다. 새로고침하시겠습니까?",en:"Once refresh the page, any incomplete form will be reset. Do you want to you continue?"}):void 0}},n=INFO.getBrowserInfo(),EACH(BROWSER_CONFIG.minBrowserVersions,function(e,t){return n.name===t&&n.version<e?(r=!0,!1):void 0}),r!==!0?c():void 0!==BROWSER_CONFIG.createNotSupportBrowserVersionPanel?BROWSER_CONFIG.createNotSupportBrowserVersionPanel().appendTo(BODY):RUN(function(){var e;e=DIV({style:{padding:10}}).appendTo(BODY),P({c:[MSG({ko:"최신 브라우저를 이용하여 접속하여 주십시오.",en:"Please connect using a modern browser."})]}).appendTo(e),EACH(BROWSER_CONFIG.minBrowserVersions,function(t,o){return n.name===o&&n.version>0&&n.version<t?(P({c:[MSG({ko:"접속하신 브라우저의 버전에서는 접속하실 수 없습니다. "+o+"를 "+t+"이상의 버젼으로 업그레이드 해 주시기 바랍니다.",en:"You can not access using this version "+o+" browser. Please upgrade "+o+" browser to version "+t+" or higher."})]}).appendTo(e),!1):void 0}),DIV({style:{marginTop:10},c:[A({style:{flt:"left",textAlign:"center",color:"#fff"},href:"http://www.google.com/chrome",target:"_blank",c:[IMG({src:UPPERCASE.IO.R("BROWSER_ICONS/CHROME.png")}),H3({c:["Chrome"]})]}),A({style:{flt:"left",textAlign:"center",color:"#fff"},href:"http://www.mozilla.com/firefox",target:"_blank",c:[IMG({src:UPPERCASE.IO.R("BROWSER_ICONS/FIREFOX.png")}),H3({c:["Firefox"]})]}),A({style:{flt:"left",textAlign:"center",color:"#fff"},href:"http://www.opera.com",target:"_blank",c:[IMG({src:UPPERCASE.IO.R("BROWSER_ICONS/OPERA.png")}),H3({c:["Opera"]})]}),A({style:{flt:"left",textAlign:"center",color:"#fff"},href:"http://windows.microsoft.com/ko-kr/internet-explorer/ie-11-worldwide-languages",target:"_blank",c:[IMG({src:UPPERCASE.IO.R("BROWSER_ICONS/IE.png")}),H3({c:["Internet Explorer 11"]})]}),A({style:{flt:"left",textAlign:"center",color:"#fff"},href:"http://www.apple.com/kr/safari",target:"_blank",c:[IMG({src:UPPERCASE.IO.R("BROWSER_ICONS/SAFARI.png")}),H3({c:["Safari"]})]}),CLEAR_BOTH()]}).appendTo(e)})})};