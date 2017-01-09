.controller('FullScreenController', [ '$rootScope','$scope', '$state','focusService','close', function($rootScope,$scope, $state,focusService,close) {
	focusService.elements.popups=[];
	changeVideoPlayerView(0,0,1280,720,$rootScope);
	$scope.dialogClose = function() {
		closeFullScreen();
	};
	
	function closeFullScreen(){
		focusService.closeDialog(true);
		close();
	}
} ])