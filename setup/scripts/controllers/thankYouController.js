.controller('thankYouController', [ '$rootScope','$scope', '$state', function($rootScope,$scope, $state) {
	var subTotal;
	var orderDetails =placeOrderResult.getOrderDetails();
	if(ISLC)
		$rootScope.showVideoDesc=false;
	else
	$rootScope.showVideoDesc=true;
	$scope.showOrderStatus= {'visibility': 'visible'};
	if (ISLC) {
		$rootScope.footerButtonText = "CONTINUE WATCHING";
	}else{
		$rootScope.footerButtonText = "CONTINUE SHOPPING";
	}
	GAHelper.sendScreenView("Payment Thank You");
	$rootScope.focusableIndexFromFooter = "thankYou.list0";
	$rootScope.itemInBagStyle={'visibility': 'hidden'};
	// var i= 10;
	// $rootScope.continueTime = '(10)';
	$scope.isBudgetPay = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
	var placeOrderDetails = placeOrderResult.getOrderDetails();
	bindOrderDetailsData(placeOrderDetails);
	function bindOrderDetailsData(placeOrderDetails){
		switch(placeOrderDetails.orderStatus){
		case 1:
			if(ISLC){
			$scope.thankYouMessage = "Thank you for purchasing";
			$scope.orderStatus = "Placed";
			}else{
				$scope.thankYouMessage = "Thank you for shopping with TJC";
				var dt = new Date();
				$scope.orderStatus = dt.getDate() + "/" + (dt.getMonth()+1) + "/" + (1900 + dt.getYear());
			}
			$scope.orderPlaceMessage = "You will get your order in final price";
			$scope.statusClass = 'green-text';
			$scope.showDelivery = true;
			break;
		case 2:
			$scope.thankYouMessage = "Your order could not be completed";
			$scope.orderPlaceMessage = "Please contact customer care at "+ $rootScope.customerCareNumber +" for more details";
			$scope.orderStatus = "Authorization Failed";
			$scope.statusClass = 'red-text';
			$scope.showDelivery = false;
			break;
		}
		$scope.orderNumber = placeOrderDetails.orderNumber;
		if (ISLC) {
			var shippingMethod =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD);
			$scope.expectedDelivery =shippingMethod.expectedDelivery+ "Days";
		}else{
			if ($scope.showDelivery) {
				$scope.showOrderStatus= {'visibility': 'hidden'};
			}
			$scope.shippingAddress =  getFormatedAddress(UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS));
			$scope.userName = loginUserDetails.getUserName();
			
		}
		var totalPrice= splitPrice(parseCurreny(placeOrderDetails.payment.total));
		subTotal =parseCurreny(placeOrderDetails.payment.subTotal);
		if ($scope.isBudgetPay) {
			var numberOfEMI = orderDetails.budgetPaySummary.noOfEmi;
			totalPrice= splitPrice(parseCurreny(orderDetails.budgetPaySummary.currentPayableAmount));
			subTotal =parseCurreny(placeOrderDetails.budgetPaySummary.amountPayable);
			$scope.totalText="Today you're paying";
			$scope.SKUPrice =CURRENCY+ subTotal;
			$scope.noOfEmi =numberOfEMI;
			var budgetPay=parseCurreny(subTotal/numberOfEMI);
			$scope.budgetPayPrice =CURRENCY+budgetPay;
			$scope.remaining=numberOfEMI+"x"+CURRENCY+budgetPay;
		}else{
			$scope.totalText="Total";
		}
		$scope.totalDoller = totalPrice[0];
		$scope.totalCent = totalPrice[1];
		$scope.subTotal = CURRENCY + subTotal;
		$scope.storeCredit = CURRENCY + parseCurreny(placeOrderDetails.payment.creditAmount);
		$scope.tax = CURRENCY + parseCurreny(placeOrderDetails.payment.tax);
		$scope.discount = CURRENCY + parseCurreny(placeOrderDetails.payment.discount);
		$scope.delivery = CURRENCY + parseCurreny(placeOrderDetails.payment.delivery);

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
	 	
	 	var totalProducts =[];
	 	$scope.focusableIndex=0;
	 	angular.forEach(cartList,function(cartItem){
	 		var auction = auctionDetails.getAuction(cartItem.auctionCode);
	 		product.productImage = createImageUrl(auction.stockCode);
	 		product.productDescription = auction.stockDescription;
	 		product.stockCode = auction.stockCode;
	 		product.quantity = cartItem.quantity;
	 		product.size = auction.size;
	 		product.price = CURRENCY + parseCurreny(cartItem.price) ;
	 		totalProducts.push(product);
	 		product ={};
	 	});
	 	$scope.products = totalProducts;
	 	var auctionList = auctionDetails.getAuctionDetails();
		switch (auctionList.groupAuctionType) {
		case 0:
			$scope.isSizeAvailable =false;
			break;
		case 1:
		case 2:
			$scope.isSizeAvailable =true;
			break;
		}
	};
	ItemCartList.clearCartList();
	/*
	 * var timerOut = setInterval(function(){ if(i == 0){
	 * $state.go('home.singleProduct'); }else{ $rootScope.continueTime = '(' +
	 * (i > 9 ? "" + i: "0" + i)+')'; $rootScope.$apply(); i--; } },1000);
	 * $scope.$on("$destroy", function () { // Unbind angular event listeners
	 * clearInterval(timerOut); });
	 */
} ])
