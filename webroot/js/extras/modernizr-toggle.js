!function(a,b){function c(a,c){g.hasClass("no-"+a)?(g.removeClass("no-"+a).addClass(a),console.log((c?"\\"+c+" ":"")+a+": ON"),b[a]=!0):(g.removeClass(a).addClass("no-"+a),console.log((c?"\\"+c+" ":"")+a+": OFF"),b[a]=!1)}function d(a){var b={ie6:54,ie7:55,ie8:56,ie9:57,noie:48};b[a]&&(a=b[a]),g.removeClass(k[48]),48!==a&&j!==a?(g.addClass(k[a]),j=a,console.log("ie props changed to ",k[a])):(48===a||j===a)&&(j=!1,48===a&&console.log("ie props removed"))}function e(){a.each(h,function(a,b){g.hasClass(a)&&!b.original?g.removeClass(a).addClass("no-"+a):g.hasClass("no-"+a)&&b.original&&g.removeClass("no-"+a).addClass(a)}),console.log("Modernizr properties reset to the browser's native capabilities")}function f(a){console.log("keypress '"+a.toLowerCase()+"' is character keyCode "+String.fromCharCode(a.charCodeAt()).toUpperCase().charCodeAt())}var g=a("html"),h={},i="",j=!1,k={54:"oldie lt-ie10 lt-ie9 lt-ie8 lt-ie7",55:"ie7 oldie lt-ie10 lt-ie9 lt-ie8",56:"ie8 oldie lt-ie10 lt-ie9",57:"ie9 lt-ie10",48:"oldie lt-ie10 lt-ie9 lt-ie8 lt-ie7 ie7 ie8 ie9"},l={85:"datauri",86:"svg",70:"csstransforms",72:"boxshadow",71:"cssgradients",67:"generatedcontent",66:"boxsizing",65:"rgba",83:"backgroundsize",82:"borderradius",84:"touch",88:"flexbox"};a.each(l,function(a,c){"boolean"==typeof b[c]?i+="\n  "+c+": ctrl+"+String.fromCharCode(a).toLowerCase():delete l[a]}),console.log("Modernizr toggle props enabled: "+i+"\n  ies: ctrl+6,  ctrl+7,  ctrl+8,  ctrl+9 to toggle ie classes, ctrl+0 to toggle all ie classes off"),a.each(b,function(a,b){"boolean"==typeof b&&(h[a]={original:b})}),window.mshowKey=f,window.mtoggleClass=c,window.mtoggleIEs=d,window.mReset=e,g.on("keydown",function(a){a.ctrlKey&&(77===a.keyCode?e():l[a.keyCode]?c(l[a.keyCode],String.fromCharCode(a.keyCode).toLowerCase()):k[a.keyCode]&&d(a.keyCode))})}(jQuery||bQuery,Modernizr);