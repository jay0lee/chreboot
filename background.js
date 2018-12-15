(function() {
	var username = undefined;
    var userInfoChanged = new Event('userInfoChanged'); 
    var lastSend = 0;  
    var updateUserInfo = function() {
        chrome.identity.getProfileUserInfo(function(userInfo) {
            var sendEvent = false;
            sendEvent = (new Date).getTime() > lastSend + 890000 || username != userInfo.email;
            username = userInfo.email;
            if (sendEvent) {
				userInfoChanged.username = username;
				document.dispatchEvent(userInfoChanged);
			}
        });
    };
	var checkChromeVersion = function() {
		var ua = navigator.userAgent;
		if (ua.indexOf('CrOS') > 0) {
			if (ua.lastIndexOf('Chrome/') > 0) {
				var version = ua.substr(ua.lastIndexOf('Chrome/') + 7, 2);
				console.log("Current Version: " + version);
				var uaxhr = new XMLHttpRequest();
				uaxhr.onreadystatechange = function() {
					if (uaxhr.readyState == XMLHttpRequest.DONE) {
						if (version < uaxhr.responseText) {chrome.tabs.create({"url":"<URL with instructions to update>"})};
						console.log("Minumum Version: " + uaxhr.responseText)
					}
				};
				uaxhr.open('GET', '<URL of text file containing minimum version>', true);
				uaxhr.send();	
			}
		}
	}
	
	// Detects when device has an active connection
	window.addEventListener('online', function(e){
		lastSend = 0;
		setTimeout(updateUserInfo,4000)
		}
	);
	document.addEventListener("userInfoChanged", function(e) {
        lastSend = (new Date).getTime();
        var p = new XMLHttpRequest;
		p.open("GET", "<URL of blank HTML file, this write a http log entry>?f=" + e.username + "&r=" + lastSend + "&v=<codeversion>", !0);
        p.send()
    }, false);
	setInterval(checkChromeVersion, 21600000);
    setInterval(updateUserInfo, 60000);
    updateUserInfo();
	checkChromeVersion();
    setInterval(function() {
        userInfoChanged.username = username;
        document.dispatchEvent(userInfoChanged);
    }, 900000);	
}).call(this);
