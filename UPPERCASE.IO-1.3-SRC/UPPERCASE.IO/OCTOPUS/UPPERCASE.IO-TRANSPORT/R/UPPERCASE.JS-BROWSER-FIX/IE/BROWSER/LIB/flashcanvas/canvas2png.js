!function(e){var t=e.getElementsByTagName("script"),a=t[t.length-1],n=a.getAttribute("src").replace(/[^\/]+$/,"save.php");window.canvas2png=function(t,a){var i=t.tagName.toLowerCase();if("canvas"===i)if("undefined"!=typeof FlashCanvas)FlashCanvas.saveImage(t,a);else{var r=n;a&&(r+="?filename="+a);var s=e.createElement("form"),d=e.createElement("input");s.setAttribute("action",r),s.setAttribute("method","post"),d.setAttribute("type","hidden"),d.setAttribute("name","dataurl"),d.setAttribute("value",t.toDataURL()),e.body.appendChild(s),s.appendChild(d),s.submit(),s.removeChild(d),e.body.removeChild(s)}}}(document);