.controller('PlayerController', [ '$rootScope','$scope', '$state', function($rootScope,$scope, $state) {
	init(VIDEO_STYLE_SMALL.CORDX,VIDEO_STYLE_SMALL.CORDY,VIDEO_STYLE_SMALL.WIDTH,VIDEO_STYLE_SMALL.HEIGHT,$rootScope);
	changeVideoPlayerView(VIDEO_STYLE_SMALL.CORDX,VIDEO_STYLE_SMALL.CORDY,VIDEO_STYLE_SMALL.WIDTH,VIDEO_STYLE_SMALL.HEIGHT,$rootScope);
} ])