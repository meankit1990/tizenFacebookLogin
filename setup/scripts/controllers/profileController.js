.controller('ProfileController',
	[ '$rootScope', '$scope','$state','httpservice','popupService','focusService',
		function($rootScope, $scope, $state,httpservice,popupService,focusService) {
		$rootScope.fromHeader = "profile.fastbuy";
		$rootScope.showVideoDesc=false;
		var configData = ConfigData.getConfigration();
		$scope.websiteName = configData.loginViaWebUrl;
		if (loginUserDetails.details) {
			$scope.shippingAddress = getFormatedAddress(loginUserDetails.getDefaultShippingAddress());
			$scope.billingAddress = getFormatedAddress(loginUserDetails.getDefaultBillingAddress());
			$scope.shippingMethod =loginUserDetails.getDefaultShippingMethod();
			var card= loginUserDetails.getDefaultCard();
			$scope.defaultCard="";
			if (card &&  card.token) {
				$scope.defaultCard= card.token;
			}
			$scope.userPhn=loginUserDetails.details.customer.homePhone;
			$scope.userEmail=loginUserDetails.details.customer.email;
			$scope.userName=loginUserDetails.getUserName();
			if (loginUserDetails.getFastBuy()=="false") {
				$scope.isChecked=false;
			}else{
				$scope.isChecked=true;
			}
			var isEligible=loginUserDetails.isEligible();
			var stockCredit = splitPrice(loginUserDetails.details.customer.creditAmount);
			$rootScope.dollerCredit = stockCredit[0];
			$rootScope.centCredit = stockCredit[1];
			var userID = loginUserDetails.getUserId();
			$scope.toggleFastbuy= function(){
				if ($scope.isChecked) {
					changeFastBuyRequest(!$scope.isChecked);
				}else{
					if (isEligible && $scope.defaultCard) {
						popupService.showFastBuyDialog(function(){
							changeFastBuyRequest(!$scope.isChecked);
						});
					}else{
						var params ={'message':FASTBUY_INCOMPLETE_ADDRESS,'buttonText':'OK'};
						popupService.showErrorDialog(params);
					}
				}
			}
		}
	function changeFastBuyRequest(fastBuyValue) {
		if(fastBuyValue){
			GAHelper.sendEvent("Enable Fast Buy","On");
		}else{
			GAHelper.sendEvent("Enable Fast Buy","Off");
		}
			ApiHelper.enableDisableFastbuy(httpservice,userID,fastBuyValue,function(successResponse){
					$scope.isChecked=!$scope.isChecked
					loginUserDetails.setFastBuy($scope.isChecked);
			},function(errorResponseData){
				if (errorResponseData.error &&  errorResponseData.error.message) {
					var error = errorResponseData.error.message
					var params ={'message':error,'buttonText':'OK'};
					popupService.showErrorDialog(params);
				}
			});
		};
	
	$scope.userPopUP = function () {
			popupService.showProfileOption(function(selectedOption){
				switch (selectedOption) {
				case 0:
					break;
				case 1:
					// show History
					// $state.go('profile.orderhistory');
					break;
				case 2:
					// LogOut
					logOut($state,$rootScope,focusService);
					break;
				}
			});
	};
	}])