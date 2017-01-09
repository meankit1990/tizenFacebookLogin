// Initialize function
function handleScreenSaver() {
	webapis.appcommon
			.setScreenSaver(webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF);
}
document.addEventListener('visibilitychange', function() {
	if (document.hidden) {
		webapis.avplay.stop(); // Mandatory. If you use avplay, you should
		exitApplication(); // call this method.
	}
});

var isInialized = false;
var isFullscreen = false;
var avPlayerObj;
var videoScope;

var listener = {
	onbufferingstart : function() {
		if (Network.isConnected()) {
			videoScope.$apply(function() {
				videoScope.showVideo = true;
				videoScope.isLoading = true;
				videoScope.isStreaming = false;
			});
		} else {
			videoScope.$apply(function() {
				videoScope.showVideo = true;
				videoScope.isLoading = false;
				videoScope.isStreaming = true;
			});
		}
	},
	onbufferingprogress : function(percent) {

	},
	onbufferingcomplete : function() {
		videoScope.$apply(function() {
			videoScope.showVideo = false;
			videoScope.isLoading = false;
			videoScope.isStreaming = false;
		});
	},
	oncurrentplaytime : function(currentTime) {
		// console.log("VIDEO SCOPE", videoScope);
	},
	onevent : function(eventType, eventData) {
	},
	onerror : function(eventType) {
		videoScope.$apply(function() {
			videoScope.showVideo = true;
			videoScope.isLoading = false;
			videoScope.isStreaming = true;
		});
		if (IS_TV) {
			var videoInterval = setInterval(function() {
				if (Network.isConnected()) {
					clearInterval(videoInterval);
					videoOpen();
					prepare();
					playVideo();
					videoScope.$apply(function() {
						videoScope.showVideo = false;
						videoScope.isLoading = false;
						videoScope.isStreaming = false;
					});
				}
			}, 1000);
		}
	},
	onsubtitlechange : function(duration, text, data3, data4) {
	},
	ondrmevent : function(drmEvent, drmData) {
	},
	onstreamcompleted : function() {

	}
};

function init(offsetX, offsetY, width, height, callback) {
	if (callback) {
		videoScope = callback;

	}
	if (!isInialized && IS_TV) {
		videoOpen();
		prepare(offsetX, offsetY, width, height);
		playVideo();
	}
};

function changeVideoPlayerView(offsetX, offsetY, width, height, rootScope) {
	videoScope = rootScope;
	if (IS_TV) {
		var scale = (webapis.productinfo.isUdPanelSupported()) ? 1.5 : 1;
		if (screen.width == 1920)
			scale = 1.5;
		else
			scale = 1;
		webapis.avplay.setDisplayRect(offsetX * scale, offsetY * scale, width
				* scale, height * scale);
	}
};

var videoOpen = function() {
	try {
		var url = ConfigData.getConfigration().liveUrl;
		webapis.avplay.open(url);
		webapis.avplay.setListener(listener);
	} catch (e) {
	}
};
var prepare = function(offsetX, offsetY, width, height) {
	try {
		webapis.avplay.prepare();
		avPlayerObj = document.getElementById("av-player");
		var scale = (webapis.productinfo.isUdPanelSupported()) ? 1.5 : 1;
		webapis.avplay.setDisplayRect(0 * scale, 0 * scale, 0 * scale,
				0 * scale);
		isInialized = true;
	} catch (e) {
	}
};
var playVideo = function() {
	try {
		webapis.avplay.play();
		handleScreenSaver();

	} catch (e) {
	}

};
var destroyVideo = function() {
	if (avPlayerObj && IS_TV) {
		try {
			webapis.avplay.stop();
			exitApplication();
		} catch (e) {
			exitApplication();
		}
	} else {
		exitApplication();

	}

};