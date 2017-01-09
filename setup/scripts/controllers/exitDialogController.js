.controller('ExitDialogController',
	[  '$scope','close','focusService',
		function($scope,close,focusService) {
		focusService.elements.removeItem=[];
		$scope.yes= function(){
			closeDialog("exit");
		};
		$scope.no= function(){
			closeDialog("no");
		};
		$scope.dialogClose= function(accepted){
			closeDialog("no");
		};
		function closeDialog(buttonClicked){
			focusService.closeDialog(true);
			close(buttonClicked);
		};
	}])