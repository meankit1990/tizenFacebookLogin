.controller('EligibleController', [ '$rootScope','$scope', '$state','focusService','popupService','httpservice', function($rootScope,$scope, $state,focusService,popupService,httpservice) {
	focusService.elements.inActive = [];
	$rootScope.disableHeaderLogin=false;
	$rootScope.loginDisable ="";
	$rootScope.userName =loginUserDetails.getUserName();
	$rootScope.showOrderButton=false;
	$rootScope.showFastbuyButton=false;
	$rootScope.orderButtonSyle={'visibility': 'hidden'};
	$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
	GAHelper.sendPageView("Home","Home");
	$scope.refresh = function() {	
		// User profile api hit
		GAHelper.sendEvent("No Address Payment","Refresh");
		ApiHelper.userProfile(httpservice,loginUserDetails.userId(),function(responseData){
			ApiHelper.saveUserProfileData(responseData);
			var isActive=loginUserDetails.isActive();
			var isEligible=loginUserDetails.isEligible();
			if (!isActive) {
				$state.go('home.blocked');
			} else if (!isEligible) {
				// var params ={'message':"Address/Payment updation is in
				// progress",'buttonText':'OK'};
				// popupService.showErrorDialog(params);
			} else {
				ApiHelper.fetchPrice(httpservice, false,null,null,function(successResponse){
					popupService.hideLoader();
					fetchPriceResult.saveDetails(successResponse);
					$state.go('order.address');	
				},function(errorResponse){
					popupService.hideLoader();
					if (errorResponse.error  && errorResponse.error.message) {
						var params ={'message':errorResponse.error.message,'buttonText':'OK'};
						popupService.showErrorDialog(params);
					}
				});
			}
	},function(errorResponse){
		var errorMessage =ApiHelper.errorHandling(errorResponse);
		var params ={'message':errorMessage,'buttonText':'OK'};
		popupService.showErrorDialog(params);
		},true);
	};
	$rootScope.loginRegistration = function() {
			// show dialog for User Profile
			popupService.showProfileOption(function(selectedOption){
				switch (selectedOption) {
				case 0:
					// show Profile
					$state.go('profile.myprofile'); 
					break;
				case 1:
					// show History
					// $state.go('profile.orderhistory');
					break;
				case 2:
					// LogOut
					logOut();
					$rootScope.hideTopInput={'visibility': 'visible'}
					$state.go('home.singleProduct'); 
					break;
				}
				
			});
			return;
			
	};
} ])
