var Logger = {
};

Logger.showLog = function(tag, log) {
	if (DEBUG) {
		console.log(tag, log);
	}
};