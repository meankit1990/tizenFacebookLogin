.controller('orderDetailsController', [ '$rootScope','$scope', '$state','focusService','httpservice','itemService','popupService',function($rootScope,$scope, $state,focusService,httpservice,itemService,popupService) {
	focusService.elements.orderDetails = [];
	$rootScope.focusableIndexFromFooter = "orderDetails.list0";
	$rootScope.footerButtonText = "CONTINUE";
	$rootScope.isBudgetPay = "";
	if(ISLC)
		$rootScope.showVideoDesc=false;
	else
	$rootScope.showVideoDesc=true;
	$rootScope.buyAllStyle={'visibility': 'hidden'};
	$rootScope.showBuyAllText = false;
	focusService.changeCurrentFocus("footer",1);
	var shippingAddress =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS);
	var billingAddress = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BILLING_ADDRESS);
	var shippingMethod =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD);
	var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
	var couponCode = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
	var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
	var userCreditAmount = loginUserDetails.getCreditAmount();
	var placeHolderValue='Add Store Credit (Bal: '+CURRENCY+parseCurreny(userCreditAmount)+')';
	$scope.placeHolder =placeHolderValue;
	GAHelper.sendScreenView("Order");
	$scope.focusItem =function(focus){
		$scope.placeHolder='';
	}
	$scope.blurItem =function(blur){
		$scope.placeHolder=placeHolderValue;
	}
	if (couponCode) {
		$scope.orderCouponState=1;
		$scope.removeCodeStyle={'visibility': 'visible'};
	}else{
		$scope.orderCouponState=0;
		$scope.removeCodeStyle={'visibility': 'hidden'};
	}
	if (storeCredit) {
		$scope.orderCreditState=1;
		$scope.removeStoreCredit={'visibility': 'visible'};
	}else{
		$scope.orderCreditState=0;
		$scope.removeStoreCredit={'visibility': 'hidden'};
	}
	$scope.isLC=ISLC;
	$scope.couponCode = couponCode;
	$scope.creditAmount =storeCredit;
	$scope.userStoreCredit=CURRENCY+ "";
	var subTotal;
	var totalPrice;
	var budgetPay;
	var auctionData = auctionDetails.getAuctionDetails();
// console.log("")
	var numberOfEmi = auctionData.numberOfEmi;
	var offerBudgetPay = auctionData.offerBudgetPay &&  loginUserDetails.getBudgetPay();
	var orderDetail =fetchPriceResult.getOrderDetails();
	var initialTotalPrice =orderDetail.payment.total; 
	bindOrderDetailsData(orderDetail,true);
// This function is called when your press the ok button.

	$scope.keyBoardDoneHandling = function() {
		if(Network.isConnected()){
		if(focusService.currentLocation.tag==="orderDetails"){
			if(focusService.currentLocation.index===0){ // For Add Coupon code
				applyCouponCode($scope.couponCode,$scope.creditAmount);
			}else if(focusService.currentLocation.index===2){ // For Add Store
				applyStoreCredit($scope.couponCode,$scope.creditAmount);
			}
		}
		}else{
			setTimeout(function(){
				popupService.showNetworkError();	
			},100);
		}
	};
	
	function applyCouponCode(couponCode,storeCredit){
		$scope.errorCoupon="";
		$scope.codeError="";
		$scope.orderCouponState=0;
		if (couponCode) {
				ApiHelper.fetchPrice(httpservice,budgetPaySelected,couponCode,storeCredit,function(successResponse){
					if(successResponse.hasOwnProperty("discountError")){
						$scope.orderCouponState=-1;
						$scope.errorCoupon="alert";
						$scope.codeError=INVALID;
						$scope.removeCodeStyle={'visibility': 'hidden'};
						updateModel(successResponse);
					}else{
						UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE,couponCode);
						$scope.orderCouponState=1;
						$scope.errorCoupon="";
						$scope.codeError="";
						$scope.removeCodeStyle={'visibility': 'visible'};
						updateModel(successResponse);
					}
				}, function(errorResponse){
// console.log(errorResponse);
				},true);
		}
	}
	
	function applyStoreCredit(couponCode,storeCredit){
		var invalidCredit = false;
		$scope.errorCredit="";
		$scope.couponError="";
		$scope.orderCreditState=0;
		if(isNaN(storeCredit) || storeCredit > userCreditAmount || storeCredit > totalPrice){
			$scope.orderCreditState=-1;
			$scope.removeStoreCredit={'visibility': 'hidden'};
			$scope.couponError = INVALID;
			$scope.errorCredit="alert";
			clearStoreCredit(true);
			return;
		}
		if (storeCredit) {
				ApiHelper.fetchPrice(httpservice,budgetPaySelected,couponCode,storeCredit,function(successResponse){
					if(successResponse.hasOwnProperty("creditError")){
						$scope.orderCreditState=-1;
						$scope.removeStoreCredit={'visibility': 'hidden'};
						$scope.couponError = INVALID;
						$scope.errorCredit="alert";
					}else{
						UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT,storeCredit);
						$scope.orderCreditState=1;
						$scope.removeStoreCredit={'visibility': 'visible'};
						updateModel(successResponse);
				}
				}, function(errorResponse){
					$scope.orderCreditState=-1;
					$scope.removeStoreCredit={'visibility': 'hidden'};
					$scope.couponError = INVALID;
					$scope.errorCredit="alert";
// console.log(errorResponse);
				},true);
		}
	}
	
	
	function updateModel(successResponse){
		fetchPriceResult.saveDetails(successResponse);
		orderDetail =fetchPriceResult.getOrderDetails();
		bindOrderDetailsData(orderDetail,false);
		updateOrderDetailsData(orderDetail,true);
	};
	
	$scope.openKeyboard=function(){
		focusService.elementClickhandling();
	};
	
	$scope.selectOption = function(option){
		switch (option) {
		case 0:
			// Single SKU Flow
			handleBudgetPay(false);
			break;
		case 1:
			// Budget Pay Flow
			handleBudgetPay(true);
			// Remove Stock credit
			break;
		}
		$scope.selectedOption= option;		
	};
	
	
	function handleBudgetPay(isBudgetPay){
		ApiHelper.fetchPrice(httpservice,isBudgetPay,couponCode, "",function(successResponse){
			UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT,"");
			storeCredit = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
			fetchPriceResult.saveDetails(successResponse);
			orderDetail =fetchPriceResult.getOrderDetails();
			if (isBudgetPay) {
				UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED,true);
				budgetPaySelected = true;
				$scope.removeStoreCredit={'visibility': 'hidden'};
				$scope.disableCredit ="disable";
				$scope.disableOrderCredits=true;
				$scope.totalText="Today you're paying";
				$scope.storeCredit =CURRENCY+"0.00";
				$scope.creditAmount="";
			}else{
				UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED,false);
				budgetPaySelected = false;
				$scope.totalText="Total";
				if (ISLC) {
					$scope.disableCredit ="";
					$scope.disableOrderCredits=false;
				}else{
					$scope.removeStoreCredit={'visibility': 'hidden'};
				}
// $scope.totalPrice = CURRENCY + totalPrice;
			}
			updateOrderDetailsData(orderDetail,true);
		},function(errorResponse){
			var error = ApiHelper.errorHandling(errorResponse);
			var params ={'message':error,'buttonText':'OK'};
			popupService.showErrorDialog(params);
		},true);
	};
	
	function initialBudgetPayUI(offerBudgetPay,emi,price,isAutoDiscountApplied,totalPrice){
		$scope.totalText="Total";
		$scope.disableCredit ="";
		$scope.disableOrderCredits=false;
		if (isAutoDiscountApplied) {
			$scope.disableOrderCoupon=true;
			$scope.disableCoupon ="disable-input";
		}else{
			$scope.disableCoupon ="";
			$scope.disableOrderCoupon=false;
		}
		$scope.showBudgetPay=offerBudgetPay;
		if (offerBudgetPay) {
			$scope.hideBudgetPay = {'visibility' : 'visible'}
			$scope.SKUPrice =CURRENCY+ parseCurreny(totalPrice);
			$scope.noOfEmi =emi;
			budgetPay=parseCurreny(price/emi);
			$scope.budgetPayPriceInitial = CURRENCY+budgetPay;
			$scope.remaining=(emi-1)+"x"+CURRENCY+budgetPay;
		}else{
			$scope.hideBudgetPay = {'visibility' : 'hidden'};
		}
		
		if(budgetPaySelected){
			$scope.selectedOption=1;
			$scope.removeStoreCredit={'visibility': 'hidden'};
			$scope.disableCredit ="disable";
			$scope.disableOrderCredits=true;
			$scope.totalText="Today you're paying";
			$scope.storeCredit =CURRENCY+"0.00";
			$scope.creditAmount="";
		}else{
			$scope.selectedOption=0;
		}	
		
		if (!ISLC) {
			$scope.hideCredit ={'visibility': 'hidden'};
			$scope.removeStoreCredit={'visibility': 'hidden'};
			$scope.disableCredit ="disable";
			$scope.disableOrderCredits=true;
		}
	};
	
	
	function removeStoreCreditFunctionality(){
		if (!ISLC) {
			$scope.hideCredit ={'visibility': 'hidden'};
			$scope.removeStoreCredit={'visibility': 'hidden'};
			$scope.disableCredit ="disable";
			$scope.disableOrderCredits=true;
		}
	}
	
	function updateOrderDetailsData(orderDetails,initialized){
		totalPrice =orderDetails.payment.total;
		subTotal =parseCurreny(orderDetails.payment.subTotal);
		
		if (initialized) {
			initialBudgetPayUI(offerBudgetPay,numberOfEmi,subTotal,orderDetails.payment.isAutoDiscountApplied,totalPrice);
		}
		
		$scope.totalPrice = CURRENCY + parseCurreny(totalPrice);
		$scope.subTotal = CURRENCY + subTotal;
		$scope.storeCredit = CURRENCY + parseCurreny(orderDetails.payment.creditAmount);
		$scope.tax = CURRENCY + parseCurreny(orderDetails.payment.tax);
		$scope.discount = CURRENCY + parseCurreny(orderDetails.payment.discount);
		$scope.delivery = CURRENCY + parseCurreny(orderDetails.payment.delivery);
		
		var total = splitPrice(totalPrice);
		if (orderDetails.budgetPaySummary && orderDetails.budgetPaySummary.isBudgetPay) {
			totalPrice =orderDetails.budgetPaySummary.currentPayableAmount;
			total = splitPrice(totalPrice);
			$scope.totalPrice = CURRENCY +parseCurreny(totalPrice);
			var numberOfEMI = orderDetails.budgetPaySummary.noOfEmi;
			subTotal =parseCurreny(orderDetails.budgetPaySummary.amountPayable);
			var budgetPay=parseCurreny(subTotal/numberOfEMI);
			$scope.budgetPayPrice =CURRENCY+budgetPay;
			$scope.remaining=numberOfEMI+"x"+CURRENCY+budgetPay;
			
		}	
		$rootScope.doller  = total[0];
		$rootScope.cent  = total[1];
	}
	
	function bindOrderDetailsData(orderDetails,isInitialized){
		updateOrderDetailsData(orderDetails,isInitialized);
		if(isInitialized){
		$scope.products = "";
	 	var totalProducts =[];
	 	var auctionList = auctionDetails.getAuctionDetails();
	 	var cartList = ItemCartList.getRequest();
	 	var product = {
	 			productImage:null,
	 			productDescription:null,
	 			stockCode:null,
	 			quantity:null,
	 			size:null,
	 			price:null
	 		};
	 	angular.forEach(cartList,function(cartItem){
	 		var auction = auctionDetails.getAuction(cartItem.auctionCode);
	 		if (auction) {
	 			product.productImage = createImageUrl(auction.stockCode);
		 		product.productDescription = auction.stockDescription;
		 		product.stockCode = auction.stockCode;
		 		product.quantity = cartItem.quantity;
		 		product.size = auction.size;
		 		product.price = CURRENCY + parseCurreny(cartItem.price) ;
		 		totalProducts.push(product);
		 		product ={};
			}
	 		
	 	});
	 	$scope.products = totalProducts;
	 	switch (auctionList.groupAuctionType) {
		case 0:
			$scope.isSizeAvailable =false;
			break;
		case 1:
		case 2:
			$scope.isSizeAvailable =true;
			break;
		}
		}
	};

$scope.removeCredit= function(isClicked){
	clearStoreCredit(isClicked);
};

function clearStoreCredit(isClicked) {
	if (isClicked) {
		ApiHelper.fetchPrice(httpservice,budgetPaySelected,couponCode, "",function(successResponse){
			focusService.navigate("left");	
			$scope.orderCreditState=0;
			UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT,"");
			storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
			fetchPriceResult.saveDetails(successResponse);
			orderDetail =fetchPriceResult.getOrderDetails();
			updateOrderDetailsData(orderDetail,true);
			$scope.removeStoreCredit={'visibility': 'hidden'};
			$scope.creditAmount="";
		},function(){
// console.log(errorResponse);
		},true);
	}else{
		$scope.creditAmount="";
		$scope.removeStoreCredit={'visibility': 'hidden'};
	}
};

$scope.removeCode= function(){
	UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE,"");
	ApiHelper.fetchPrice(httpservice,budgetPaySelected,"",$scope.creditAmount,function(successResponse){
		focusService.navigate("left");
		UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE,"");
		couponCode="";
		$scope.couponCode="";
		updateModel(successResponse);
		$scope.removeCodeStyle={'visibility': 'hidden'};
		$scope.orderCouponState=0;
	}, function(errorResponse){
// console.log("ERROR RESPONSE",errorResponse);
	},true);
};

function invalidState(errorCss,errorMessage,errorState){
	errorCss="alert";
	errorMessage=INVALID;
	errorState=-1;
	
}
} ])
