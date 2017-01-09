.controller('HowToBuyController', ['$scope', 'close','focusService', function($scope, close,focusService) {
	
	focusService.elements.popUp = [];
	
	$scope.dialogClose = function() {
			focusService.closeDialog(true);
			close();
		};
}])