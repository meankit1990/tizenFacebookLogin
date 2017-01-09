.controller('RemoveItemController',
	[ '$rootScope', '$scope','$state','close','httpservice','popupService','focusService',
		function($rootScope, $scope, $state,close,httpservice,popupService,focusService) {
		focusService.elements.removeItem=[];
		if ($rootScope.itemInBag >1) {
			$scope.items ="All item(s)!";
		}else{
			$scope.items ="item";
		}
		$scope.yes= function(){
			closeDialog("yes");
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