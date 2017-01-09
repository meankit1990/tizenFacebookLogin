function exitApplication() {
	tizen.application.getCurrentApplication().exit();
}
function getAppVersion() {
	if (checkTizen()) {
		tizen.application.getAppInfo().version;
	}
}
function checkTizen() {
	if (window.tizen === undefined) {
		return false;
	} else{
		return true;
	}
}

function checkPlateform() {

}