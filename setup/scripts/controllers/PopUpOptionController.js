.controller('PopUpOptionController', ['$scope', 'close','focusService', function($scope, close,focusService) {
	focusService.elements.popUp=[];
	 $scope.dialogClose = function(selection) {
			focusService.closeDialog(true);
			close(selection);
		};
		$scope.help = function() {
			$scope.dialogClose(0);
		};
		$scope.programGuide = function() {
			$scope.dialogClose(1);
		};
}])