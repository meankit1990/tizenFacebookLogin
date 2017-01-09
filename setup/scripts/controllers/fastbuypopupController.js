.controller('FastBuyPopUpController',
	[ '$rootScope', '$scope','$state','close','httpservice','popupService','focusService',
		function($rootScope, $scope, $state,close,httpservice,popupService,focusService) {
		focusService.elements.popup=[];
		if (loginUserDetails.details) {
			$scope.shippingAddress = getFormatedAddress(loginUserDetails.getDefaultShippingAddress());
			$scope.billingAddress = getFormatedAddress(loginUserDetails.getDefaultBillingAddress());
			var card =loginUserDetails.getDefaultCard();
			$scope.defaultCard = card.token;
			$scope.expireOn=card.expires;
			$scope.userName=loginUserDetails.getUserName();
			
		}
		$scope.dialogClose= function(accepted){
			focusService.closeDialog(true);
			close(accepted);
		};
	}])