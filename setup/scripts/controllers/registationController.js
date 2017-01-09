.controller('RegistationController',
		[ '$rootScope', '$scope','$state','httpservice','popupService','focusService',  function($rootScope, $scope,$state,httpservice,popupService,focusService) {
			Logger.showLog("inside RegistationController");
			
			focusService.elements.registration = [];
			$rootScope.registationStyle = 'activeTabs';
			$rootScope.loginStyle = 'inactiveTabs';
			GAHelper.sendScreenView("Sign up");

			var firstName = $rootScope.firstName;
			var lastName = $rootScope.lastName;
			var userEmail = $rootScope.email;
			var userPhone = $rootScope.phone;
			
			if (firstName != undefined)
				$scope.firstName = firstName;

			if (lastName != undefined)
				$scope.lastName = lastName;

			if (userEmail != undefined)
				$scope.email = userEmail;

			if (userPhone != undefined)
				$scope.phone = userPhone;

			$scope.saveData = function(key, value) {
				switch (key) {
				case REGISTER_FIRST_NAME:
					$rootScope.firstName = value;
					break;
				case REGISTER_LAST_NAME:
					$rootScope.lastName = value;
					break;
				case REGISTER_EMAIL:
					$rootScope.email = value;
					break;
				case REGISTER_PHONE:
					$rootScope.phone = value;
					break;
				case PIN:
					$scope.pin = value;
					break;
				}
			}

			$scope.registerUser = function() {
				$state.go('home.singleProduct');
				return;
				
				if (!$scope.registrationForm.$valid) {
					$scope.showAllError = "All * fields are mandatory";
					return;
				} else {
					// registeration process
					$scope.showAllError = "";
					var UUID = ProductInfo.getDeviceUUID();
					var params = {  
							   "CustomerRegisterRequest":{  
								      "Request":{  
								         "device":DEVICE_NAME,
								         "UUID":UUID
								      },
								      "customerDetail":{  
								         "phone":$scope.phone,
								         "pin":$scope.pin,
								         "email":$scope.email,
								         "firstName":$scope.firstName,
								         "lastName":$scope.lastName
								      }
								    }
								};
					/*
					 * if (!Network.isConnected()) {
					 * popupService.showNetworkError(); return; }
					 */
					popupService.showLoader();
					httpservice.post(REGISTRATION,params,false,getHeaderNonce(REGISTRATION)).then(function(response){
						var responseData = response.data.response;				
						if(responseData.status == 0){
							hideIputField($rootScope);
							if(responseData.customerDetails){
								loginUserDetails.saveDetails(responseData);
								var id = responseData.customerDetails.id;
								$rootScope.userName =loginUserDetails.getUserName();
								getUserProfileData(httpservice,id,function(data){
									// Success Callback
									popupService.hideLoader();
									redirectScreen();
								},function(error){
									// Failure Callback
									popupService.hideLoader();
									redirectScreen();
								});
							}else{
								popupService.hideLoader();
								redirectScreen();
							}
							
						}else{
							// Show error
							popupService.hideLoader();
							var error = responseData.error.message
							var params ={'message':error,'buttonText':'OK','errorType':true,'errorClass':true,'state':'home.login'};
							popupService.showErrorDialog(params);
						}
					},function(){
						// Show error
						popupService.hideLoader();
					});
					
				}
			};
			function redirectScreen(){
				if (!$rootScope.showLoginMessage) {
					$state.go('home.singleProduct');
				}else{
				$state.go('home.eligible');
				}
			};
			$scope.opneKeyBoard = function() {
				focusService.elementClickhandling();
			};

		} ])