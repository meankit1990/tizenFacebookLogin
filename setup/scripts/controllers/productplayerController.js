.controller('ProductPlayerController', [ '$rootScope','$scope', '$state','popupService','focusService', function($rootScope,$scope, $state,popupService,focusService) {
	focusService.elements.video= [];
	init(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
	changeVideoPlayerView(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
	
	var fullScreen = false;	
	$scope.resizeVideo = function(){
		if(!fullScreen){
		GAHelper.sendEvent("Live Stream", "Full Screen");
		popupService.showFullScreenDialog(function(){
			changeVideoPlayerView(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
			fullScreen = false;
			});
		fullScreen = true;
		}else{
			changeVideoPlayerView(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
			focusService.returnHandling($state,$rootScope.currentState,$rootScope.previousState);
			fullScreen = false;
		}
	}
} ])