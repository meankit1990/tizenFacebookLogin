.controller('PopUpController', ['$scope', '$state','focusService','close','param', function($scope, $state,focusService,close,param) {
	focusService.elements.popUp = [];
	var params =angular.fromJson(param);
	$scope.message =params.message;
	$scope.buttonText =params.buttonText;
	$scope.dialogClose = function() {
		focusService.closeDialog(true);
		close(params);
	};
} ])