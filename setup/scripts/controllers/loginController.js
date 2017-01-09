.controller('LoginController',
		[ '$rootScope', '$scope','$state','httpservice','popupService','focusService', function($rootScope, $scope, $state,httpservice,popupService,focusService) {
			focusService.elements.login = [];
			focusService.elements.product = [];
			focusService.elements.footer = [];
			focusService.elements.popUp = [];
			focusService.elements.orderDetails = [];
			$rootScope.showOrderButton=false;
			$rootScope.showFastbuyButton=false;
			$rootScope.showLoginMessage = false;
			$rootScope.loginStyle = 'activeTabs';
			$rootScope.registationStyle = 'inactiveTabs';
			$rootScope.disableHeaderLogin=true;
			$rootScope.loginDisable ="login-disable";
			setTimeout(function(){
				var element =  focusService.elements.video[0];
				if (element) {
					element[0].attributes["up"].value="header.option";
				}
			},1000);
			GAHelper.sendScreenView("Login");
			changeVideoPlayerView(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
			var cartSize = ItemCartList.size();
			if(cartSize>0){
				$rootScope.showLoginMessage = true;
				$rootScope.messageStyle={'visibility': 'visible'};
				$rootScope.orderButtonSyle={'visibility': 'hidden'};
				$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
			}else{
				$rootScope.messageStyle={'visibility': 'hidden'};
				focusService.elements.footer = [];
				$rootScope.itemInBagStyle={'visibility': 'hidden'};
			}
			
			var userName = $rootScope.login_user_name;
			if (userName != undefined)
				$scope.username = userName;
			$scope.checkLoginCred = function() {
				var checkResult = checkLoginCredentials($scope.username);
				var checkPass = checkPassword($scope.password);
				var isEmail = false;
				if(isValidEmail($scope.username)){
					isEmail = true;
				}
				if (checkResult == true) {
					$scope.userNameError = "";
					if (checkPass == true) {
						$scope.passwordError = "";
					} else {
						$scope.passwordErrorInput = "alert";
						$scope.passwordError = checkPass;
						return;
					}
					ApiHelper.login(httpservice,$scope.username,$scope.password,isEmail,function(responseData){
							if (responseData.customer) {
								hideIputField($rootScope);
								hideHomeInput($rootScope);
								loginUserDetails.saveDetails(responseData);
								focusService.elements.video[0][0].attributes["up"].value="header.username";
								$rootScope.userName =loginUserDetails.getUserName();
								if (cartSize>0) {
									var isActive=loginUserDetails.isActive();
									var isEligible=loginUserDetails.isEligible();
									if (!isActive) {
										$state.go('home.blocked');
									} else if (!isEligible) 
									{
										$state.go('home.eligible');
									} else {
											ApiHelper.fetchPrice(httpservice, false,null,null,function(successResponse){
												fetchPriceResult.saveDetails(successResponse);
												GAHelper.sendEvent("Login","Clicked","Success");
														$state.go('order.address');	
											}, function(errorResponse){
												if (errorResponse.error  && errorResponse.error.message) {
													var params ={'message':errorResponse.error.message,'buttonText':'OK'};
													popupService.showErrorDialog(params);
												}
											},true);
									}
								}else{
									
									$state.go('home.singleProduct');
								}
							}else{
								GAHelper.sendEvent("Login","Clicked","Failure");
								var params ={'message':"user details not found",'buttonText':'OK'};
								popupService.showErrorDialog(params);
							}
					},function(responseData){
						$scope.userNameError = "";
						$scope.passwordError = "";
						$scope.password = "";
						$scope.alertErrorInput = "";
						$scope.passwordErrorInput = "";
						if (responseData &&  responseData.error && responseData.error.code) {
							var error = responseData.error;
							var errorCode =error.code;
							var errorMessage =error.message;
							if (errorCode=="262") {
								GAHelper.sendEvent("Login","Clicked","userBlock");
								$state.go('home.blocked');
							}else{
								var params ={'message':errorMessage,'buttonText':'OK'};
								popupService.showErrorDialog(params);
							}	
						}
					});
				} else {
					$scope.passwordError = "";
					$scope.userNameError = checkResult;
					$scope.alertErrorInput = "alert";
				}
			};
			
			$scope.saveUserName = function(username) {
				$rootScope.login_user_name = username;
			};
			
			$scope.opneKeyBoard = function() {
				focusService.elementClickhandling();
			};
			
			$scope.forgetPassword= function() {
				$state.go('home.forgetPassword');
			};
			
			
		} ])