.controller(
				'orderAddressController',
				[
						'$rootScope',
						'$scope',
						'$state',
						'httpservice',
						'popupService',
						'focusService',
						'itemService',
						function($rootScope, $scope, $state, httpservice,
								popupService, focusService,
								 itemService) {
							GAHelper.sendScreenView("Address");
							$rootScope.focusableIndexFromFooter = "last";
							$rootScope.footerButtonText = "CONTINUE";
							$rootScope.continueTime = "";
							$rootScope.itemInBagStyle={'visibility': 'visible'};
							$rootScope.showBuyAllText = true;
							if(ISLC)
								$rootScope.showVideoDesc=false;
							else
							$rootScope.showVideoDesc=true;
							focusService.changeCurrentFocus("footer",1);
							
							// Address Controller
							focusService.elements.product = [];
							focusService.elements.orderAddress = [];

							var shippingAddress;
							var shippingAddressCountry;
							var defaultCountry;
							var billingAddress;
							var shippingMethod;
							$scope.shippingAddress = {};
							$scope.billingAddress = {};
							$scope.shippingMethod = {};
							showAddressDetails();
						
							function showAddressDetails(){
							shippingAddress = UserDefaultDetails
									.get(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS);
							shippingAddressCountry= shippingAddress.country;
							defaultCountry=shippingAddress.country;
							billingAddress = UserDefaultDetails
									.get(DEFAUTL_DETAILS_TYPE.BILLING_ADDRESS);
							shippingMethod = UserDefaultDetails.get(
									DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD);
							
							$scope.shippingAddress = getFormatedAddress(shippingAddress);
							$scope.billingAddress = getFormatedAddress(billingAddress);
							if (shippingMethod) {
								$scope.shippingMethod = shippingMethod;
								var price =splitPrice(shippingMethod.shippingCharges);
								$scope.shippingCharges=price[0]+ price[1];
							}
							}
							
							$scope.selectShippingAddress = function() {
								if(ISLC)
									var shippingText = "Select shipping address";
									else
									var shippingText = "SELECT DELIVERY ADDRESS";
								showSelectionPopUp(
										shippingText,
										loginUserDetails.getShippingAddress(),
										"shipping-title",
										shippingAddress,
										function(updatedAddress) {
											if(Network.isConnected()){

											if (shippingAddressCountry!== updatedAddress.country) {
												if (defaultCountry=== updatedAddress.country ) {
													shippingMethod =loginUserDetails.getDefaultShippingMethod();
												}else{
													var changedShippingMethods =loginUserDetails.getShippingMethods(updatedAddress);
													if (changedShippingMethods && changedShippingMethods.length>0) {
														shippingMethod =changedShippingMethods[0];
													}else{
														var params ={'message':"Can't change due to no shipping methods for this country",'buttonText':'OK'};
														popupService.showErrorDialog(params);
														return;
													}
												}
												shippingAddressCountry=updatedAddress.country;
												UserDefaultDetails
												.set(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD,shippingMethod);
												$scope.shippingMethod = shippingMethod;
												var price =splitPrice(shippingMethod.shippingCharges);
												$scope.shippingCharges=price[0]+ price[1];
												shippingAddress = updatedAddress;
												$scope.shippingAddress = getFormatedAddress(updatedAddress);
												UserDefaultDetails
														.set(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS,updatedAddress);
												updatePrice(true);
											}else{
												shippingAddress = updatedAddress;
												$scope.shippingAddress = getFormatedAddress(updatedAddress);
												UserDefaultDetails
														.set(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS,updatedAddress);
											}
											}else{
												popupService.showNetworkError();
											}
											});
										
							};
							$scope.selectBillingAddress = function() {
								if(ISLC)
									var billingText = "Select billing address";
									else
									var billingText = "SELECT BILLING ADDRESS";
								showSelectionPopUp(
										billingText,
										loginUserDetails.getBillingAddress(),
										"billing-title",
										billingAddress,
										function(updatedAddress) {
											billingAddress = updatedAddress;
											$scope.billingAddress = getFormatedAddress(billingAddress);
											UserDefaultDetails
													.set(
															DEFAUTL_DETAILS_TYPE.BILLING_ADDRESS,
															updatedAddress);
										});
							};
							$scope.selectShippingMethod = function() {
								if(ISLC)
									var methodText = "Select shipping method";
									else
									var methodText = "SELECT DELIVERY METHOD";
								showSelectionPopUp(
										methodText,
										loginUserDetails.getShippingMethods(shippingAddress),
										"shippingmethod-title",
										shippingMethod,
										function(updatedValue) {
											if(Network.isConnected()){
											if (shippingMethod!== updatedValue) {
												shippingMethod = updatedValue;
												$scope.shippingMethod = updatedValue;
												var price =splitPrice(updatedValue.shippingCharges);
												$scope.shippingCharges=price[0]+ price[1];
												UserDefaultDetails
														.set(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD,updatedValue);
												updatePrice(true);
											}
											}else{
												popupService.showNetworkError();
											}
										});
							};

							function showSelectionPopUp(titleValue, records,
									cssClass, defaultSelectedValue, callBack) {
								popupService.showSelectionDialog({
									title : titleValue,
									data : records,
									defaultSelected : defaultSelectedValue,
									class : cssClass
								}, function(updatedAddress) {
									if (updatedAddress) {
										callBack(updatedAddress);
									}
								});
							}
							$scope.refresh=function(){
								GAHelper.sendEvent("Address Selection","Refresh");
								ApiHelper.userProfile(httpservice,loginUserDetails.userId(),function(responseData){
									ApiHelper.saveUserProfileData(responseData);
									UserDefaultDetails.clear();
									showAddressDetails();
									updatePrice(false);
								},function(errorResponse){
									popupService.hideLoader();
									var errorMessage = ApiHelper.errorHandling (errorReponse);
									var params ={'message':errorMessage,'buttonText':'OK'};
									popupService.showErrorDialog(params);
								},true);
							}
							
							function updatePrice(showLoader){
								var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
								var couponCode =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
								var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
								ApiHelper.fetchPrice(httpservice, budgetPaySelected,couponCode,storeCredit,function(successResponse) {
									if (!showLoader) {
										popupService.hideLoader();
									}
									fetchPriceResult.saveDetails(successResponse);
									var orderDetails =fetchPriceResult.getOrderDetails();
									var total = splitPrice(orderDetails.payment.total);
									if (budgetPaySelected) {
									total = splitPrice(orderDetails.budgetPaySummary.currentPayableAmount);
									}
									$rootScope.doller  = total[0];
									$rootScope.cent  = total[1];
								}, function(errorResponse) {
									if (!showLoader) {
										popupService.hideLoader();
									}
									var errorMessage = ApiHelper.errorHandling (errorReponse);
									var params ={'message':errorMessage,'buttonText':'OK'};
									popupService.showErrorDialog(params);
								},showLoader);
							};
							
						} ])