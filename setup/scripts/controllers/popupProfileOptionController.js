.controller('PopupProfileOptionController', ['$scope', 'close','focusService', function($scope, close,focusService) {
	focusService.elements.popUp=[];
	 $scope.dialogClose = function(selection) {
			focusService.closeDialog(true);
			close(selection);
		};
		$scope.myProfile = function() {
			$scope.dialogClose(0);
		};
		$scope.myOrder = function() {
			$scope.dialogClose(1);
		};
		$scope.logout = function() {
			$scope.dialogClose(2);
		};
	 
}])