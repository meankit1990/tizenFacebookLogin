.controller('orderFooterController', [
		'$rootScope',
		'$scope',
		'$state',
		'httpservice',
		'popupService',
		'focusService',
		'itemService',
		function($rootScope, $scope, $state, httpservice, popupService,
				focusService, itemService) {
			focusService.elements.footer = [];
			$rootScope.footerStyle=true;
			var orderDetails =fetchPriceResult.getOrderDetails();
			var total = splitPrice(orderDetails.payment.total);
			$rootScope.doller  = total[0];
			$rootScope.cent  = total[1];
			var itemList  = ItemCartList.getRequest();
			$scope.itemInBag=itemList.length;
			$rootScope.isBudgetPay = "";
			// Click event of continue button
			$scope.orderContinue = function() {
				var orderState = $state.current.name;
				switch (orderState) {
				case 'order.address':
					GAHelper.sendEvent("Address Selection","Continue");
					orderAddressContinue();
					break;
				case 'order.details':
					$state.go('order.payment');
					break;
				case 'order.payment':
					if (ISLC) {
						orderPaymentContinue();
					}else{
						popupService.cvvPopUP(function(cvv){
							
							if (cvv) {
								orderPaymentContinue(cvv);
							}
						});
					}
					
					break;
				case 'order.thankyou':
					$state.go('home.singleProduct');
					break;
				}
			};
			
			// Click event of ItemInBag Button Click button
			$scope.itemInBagClick = function(){
				GAHelper.sendEvent("Items In Bag","Open");
					popupService.showItemInBag(function(){
					});
			};
			var orderPaymentContinue = function(cvv) {
				var shippingAddress =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS);
				var billingAddress = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BILLING_ADDRESS);
				var shippingMethod =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD);
				var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
				var couponCode =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
				var orderDetails =fetchPriceResult.getOrderDetails();
				var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
				if(budgetPaySelected){
					if($scope.itemInBag > 1){
						GAHelper.sendEvent("Place Order","Multiple With Budget");
					}				else{
						GAHelper.sendEvent("Place Order","Single With Budget");
					}
				}else{
					if($scope.itemInBag > 1){
						GAHelper.sendEvent("Place Order","Multiple");
					}				else{
						GAHelper.sendEvent("Place Order","Single");
					}
					}
				ApiHelper.placeOrder(httpservice,budgetPaySelected,false,orderDetails.bucketId, function(successResponse){
						placeOrderResult.saveDetails(successResponse);
						$state.go('order.thankyou');
				}, function(errorResponse){
					var error = ApiHelper.errorHandling(errorResponse);
					var params ={'message':error,'buttonText':'OK'};
					popupService.showErrorDialog(params);
				},cvv);
			};
			
			var orderAddressContinue = function() {
				// UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT,"");
				// UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE,"");
				var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
				var couponCode =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
				var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
				ApiHelper.fetchPrice(httpservice, budgetPaySelected,couponCode,storeCredit,function(successResponse) {
							fetchPriceResult.saveDetails(successResponse);
							$state.go('order.details');
						}, function(errorResponse) {
							var error = ApiHelper.errorHandling(errorResponse);
							var params ={'message':error,'buttonText':'OK'};
								popupService.showErrorDialog(params);
						},true);
			};
		} ])