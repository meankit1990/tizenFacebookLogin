.controller('InsufficiantController',
	[ '$rootScope', '$scope','$state','close','httpservice','popupService','focusService','param',
		function($rootScope, $scope, $state,close,httpservice,popupService,focusService,param) {
		focusService.elements.removeItem=[];
		if(param == "24"){
				$scope.errorText1 = "Current auction ended";
				$scope.errorText2 = "Cannot edit quantity. Do you want to continue with your previous order ?";
		}else if(param == "25"){
				$scope.errorText1 = "Insufficient Quantity!";
				$scope.errorText2 = "Do You want to continue with your previous	order ?";
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