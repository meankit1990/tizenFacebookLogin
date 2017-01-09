.controller('HeaderController', ['$rootScope',
		'$scope',
		'$state','popupService','focusService','httpservice',
		function($rootScope,$scope, $state,popupService,focusService,httpservice) {
			focusService.elements.header = [];
			$scope.option=function(){
				popupService.showOptions(function(selectedOption){
					$rootScope.openedByFastBy=true;
					GAHelper.sendScreenView("Options");
					switch (selectedOption) {
					case 0:
						// show Help
						if(Network.isConnected()){
							GAHelper.sendScreenView("Help");
							$state.go('options.customerService');
						}else{
							popupService.showNetworkError();
						}
						break;
					case 1:
						// show Program Guide
						if(Network.isConnected()){
							GAHelper.sendScreenView("Program Guide");
							$state.go('options.programGuide');
						}else{
							popupService.showNetworkError();
						}
						break;
					}
					
				});
			};
			$scope.howToBuy=function(){
				GAHelper.sendScreenView("How To Buy");
				popupService.showHowToBuy();
			};
			
			$scope.loginRegistration = function() {
				var isUserLoggedIn = loginUserDetails.isLoggedIn();
				if(isUserLoggedIn){
					// show dialog for User Profile
					popupService.showProfileOption(function(selectedOption){
						$rootScope.openedByFastBy=true;
						switch (selectedOption) {
						case 0:
							// show Profile
							if(isUserLoggedIn){
								ApiHelper.userProfile(httpservice,loginUserDetails.userId(),
										function(responseData){
									GAHelper.sendScreenView("My Profile");
										ApiHelper.saveUserProfileData(responseData);
										$state.go('profile.myprofile'); 
									},function(errorResponse){
										var params ={'message':errorResponse.error.message,'buttonText':'OK'};
										popupService.showErrorDialog(params);
									},true);
							}
							break;
						case 1:
							// show History
							// $state.go('profile.orderhistory');
							break;
						case 2:
							// LogOut
							$rootScope.openedByFastBy=false;
							focusService.changeAutoFocus(0);
							logOut($state,$rootScope,focusService);
							$rootScope.userName =loginUserDetails.getUserName();
							isUserLoggedIn = loginUserDetails.isLoggedIn();
							$rootScope.fastbuyclass="disable-green-btn";
							$rootScope.fastbuymessage=FASTBUY_UNREGISTERED;
							break;
						}
					});
					return;
					
				}else{
					$rootScope.showLoginMessage = false;
					$rootScope.footerVisibility = false;
					$rootScope.disableHeaderLogin=true;
					$rootScope.loginDisable ="login-disable";
					$state.go('home.login');
			}
			};
		} ])