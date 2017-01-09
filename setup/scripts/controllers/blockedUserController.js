.controller('BlockedUserController', [ '$rootScope','$scope', '$state','focusService', function($rootScope,$scope, $state,focusService) {
	focusService.elements.inActive = [];
	$rootScope.disableHeaderLogin=true;
	$rootScope.loginDisable ="login-disable";
	$rootScope.userName =loginUserDetails.getUserName();
	$rootScope.footerVisibility = false;
	$rootScope.showOrderButton=false;
	$rootScope.orderButtonSyle={'visibility': 'hidden'};
	$rootScope.itemInBagStyle={'visibility': 'hidden'};
	$rootScope.showFastbuyButton=false;
	$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
	$scope.continueWatching = function() {
		$state.go("home.singleProduct");
	};
	
} ])
