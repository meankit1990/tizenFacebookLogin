.controller('LoadingController', ['$scope', 'close','focusService', function($scope, close,focusService) {
	 $scope.dialogClose = function() {
			focusService.closeDialog(true);
			close();
		};
	
}])