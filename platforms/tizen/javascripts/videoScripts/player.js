var Player = {
	url : null,
	pluginObject : null,
	isNetworkError : false,
};

Player.init = function(liveUrl) {
	this.url = liveUrl;
	this.setWindow();
};

Player.deinit = function() {
	//	
};


Player.setWindow = function() {
	
};

Player.setFullscreen = function() {
	
};

Player.setVideoURL = function(url) {
	this.url = url;
};

Player.playVideo = function() {
	if (this.url !== null) {
		//play
	} 
};

Player.stopVideo = function(tag) {
	//stop
};



Player.onNetworkDisconnected = function() {
	//
};


