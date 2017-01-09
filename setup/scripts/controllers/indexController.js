.controller('IndexController',
		[ '$rootScope','$scope', '$state','httpservice','popupService',
			function($rootScope,$scope, $state,httpservice,popupService) {
			if (IS_TV) {
				Network.init();
			}
			var isError = false;
			var isRedirect = false;
			var auctionInterval;
			redirectPageByTime();
			$rootScope.userName =loginUserDetails.getUserName();
			// Config api hit
			if(Network.isConnected()){
			ApiHelper.Config(httpservice,function(responseData){
				// save Config data
				ConfigData.setConfigration(responseData.configuration);
				$rootScope.customerCareNumber = responseData.configuration.helpline;
				// FetchAuction api hit
					ApiHelper.fetchAuction(httpservice,function(responseData){
						// save FetchAuction data
						auctionDetails.saveAuctions(responseData);
						if (!getSavedItem(TERMS_ACCEPTED)) {
//							// T&C api hit
							ApiHelper.termsAndCondition(httpservice,function (responseData){
								var terms = responseData.termsAndConditions;
								if (terms) {
									var rex = /(<([^>]+)>)/ig;
									terms = terms.replace(rex,"");
// $rootScope.termsValue = terms;
//									Terms.saveData(terms);
									redirect();
								}else{
									// show Error Dialog of exit Application
								}
							},function(errorResponse){
								failure(errorResponse);
							});
							}else{
								loginUserDetails.getDetails();
								$rootScope.userName =loginUserDetails.getUserName();
								 var isUserLoggedIn = loginUserDetails.isLoggedIn();
								if(isUserLoggedIn){
									hideHomeInput($rootScope);
// $rootScope.hideTopInput={'visibility': 'hidden'};
// $rootScope.hideTopInput={'display': 'none'};
									// User profile api hit
									ApiHelper.userProfile(httpservice,loginUserDetails.userId(),function(responseData){
										ApiHelper.saveUserProfileData(responseData);
									redirect();
								},function(errorResponse){
									failure(errorResponse);
								},false);
							}else{
								redirect();
							}
							}
					},function(errorResponse){
						var error = ApiHelper.errorHandling(errorResponse);
						$state.go('home.noauction',{auctionError:error});
					},false);
			},function(errorResponse){
				failure(errorResponse);
			}); 
			}else{
				var params ={'message':NO_INTERNET_CONNECTION,'buttonText':'EXIT'};
					popupService.showErrorDialog(params,function(){
						exitApplication();
				});
			}	
			function failure(errorResponse){
				isError = true;
				var error = ApiHelper.errorHandling(errorResponse);
					var params ={'message':error,'buttonText':'EXIT'};
					popupService.showErrorDialog(params,function(){
						exitApplication();
					});
			};
			function redirect(){
				isRedirect=true;
			};
			
			function redirectPage(){	
				if (getSavedItem(TERMS_ACCEPTED)) {
					var isActive=loginUserDetails.isActive();
					var isUserLoggedIn = loginUserDetails.isLoggedIn();
					if (isUserLoggedIn && !isActive) {
						$state.go('home.blocked');
					}else{
						$state.go('home.singleProduct'); 
					}
				} else {
					$state.go('home.terms'); 
				}
			};
			
			function redirectPageByTime(){
				var interval = setInterval(function() {
					if(isRedirect){
						redirectPage();
						clearInterval(interval);
					}else if (isError){
						clearInterval(interval);
						// Error Handling will be here
					}
			}, SPLASH_TIME);
			};
		} ])
