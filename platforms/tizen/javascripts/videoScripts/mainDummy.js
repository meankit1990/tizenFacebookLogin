var Main = {
	isInialized : false,
	mode : 0,
	WINDOW : 0,
	FULLSCREEN : 1,
};
Main.onLoad = function(liveUrl) {
	if (!this.isInialized) {
		Player.init(this.liveUrl)
		this.isInialized = true;
	}
};

Main.onUnload = function() {
	Player.deinit();
};

Main.updateCurrentVideo = function(url) {
	Player.setVideoURL(url);
};

Main.setFullScreenMode = function() {
	if (this.mode != this.FULLSCREEN) {
		Player.setFullscreen();
		this.mode = this.FULLSCREEN;
	}
};

Main.setWindowMode = function() {
	if (this.mode != this.WINDOW) {
		Player.setWindow();
		this.mode = this.WINDOW;
	}
};

Main.toggleMode = function() {
	switch (this.mode) {
	case this.WINDOW:
		this.setFullScreenMode();
		break;

	case this.FULLSCREEN:
		this.setWindowMode();
		break;

	default:
		break;
	}
};