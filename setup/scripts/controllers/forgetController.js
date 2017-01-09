.controller('ForgetController', [ '$rootScope','$scope', '$state','focusService','popupService','httpservice', function($rootScope,$scope, $state,focusService,popupService ,httpservice) {
	focusService.elements.forget = [];
	var email;
	var element =  focusService.elements.video[0];
	if (element) {
		element[0].attributes["up"].value="header.username";
	}
	$rootScope.disableHeaderLogin=false;
	$rootScope.loginDisable ="";
	$rootScope.showOrderButton=false;
	$rootScope.showFastbuyButton=false;
	$rootScope.orderButtonSyle={'visibility': 'hidden'};
	$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
	var cartSize = ItemCartList.size();
	if(cartSize>0){
		$rootScope.showLoginMessage = true;
		$rootScope.orderButtonSyle={'visibility': 'hidden'};
		$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
	}else{
		focusService.elements.footer = [];
		$rootScope.itemInBagStyle={'visibility': 'hidden'};
	}
	if(isValidEmail($rootScope.login_user_name))
	$scope.forgetEmailID = $rootScope.login_user_name;
	email=$scope.forgetEmailID;
	$scope.submit = function() {
		if (email) {
			if(isValidEmail(email)){
				// Api hit
				$scope.alertErrorInput="";
				$scope.emailError = "";
				ApiHelper.forgotPassowrd(httpservice,email,function(successResponse){
					$state.go("home.forgetMessage");
				},function(errorResponse){
					var errorMessage =ApiHelper.errorHandling(errorResponse);
						var params ={'message':errorMessage,'buttonText':'OK'};
						popupService.showErrorDialog(params);
				});
			}else{
				// invalid
				$scope.alertErrorInput="alert";
				$scope.emailError = "Invalid";
			}
		}else{
			// required

			$scope.alertErrorInput="alert";
			$scope.emailError = "Required";
		}
	};
	
	$scope.changeEmail = function(forgetEmailID) {
		email=forgetEmailID;
	};
	
	$scope.opneKeyBoard = function() {
		focusService.elementClickhandling();
	};
} ])
