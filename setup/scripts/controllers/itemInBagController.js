.controller('itemInBagController', ['$scope','$rootScope', '$state','focusService','close','popupService','httpservice', function($scope,$rootScope, $state,focusService,close,popupService,httpservice) {
	focusService.elements.selectItem = [];
	focusService.elements.iteminbag = [];
	var itemList  = ItemCartList.getRequest();
	var configMaxLimit = ConfigData.getConfigration().maximumItemQty;
	$scope.limit = configMaxLimit;
	GAHelper.sendScreenView("Items In Bag");
	var currentState =$state.current.name;
	
	if (currentState=="order.address") {
		$scope.buttonText ="Update";
		$scope.isOrderScreenStyle={"visibility":"visible"}
	}else{
		$scope.buttonText ="Continue";
		$scope.isOrderScreenStyle={"visibility":"hidden"}
	}
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
	
	$scope.itemInBag=itemList.length;
	/* $scope.cartItems = itemList; */
	var cartItems=[];
 	angular.forEach(itemList,function(cartItem){
 		var cart ={};
 		var auction = auctionDetails.getAuction(cartItem.auctionCode);
 		cart.productImage = createImageUrl(auction.stockCode);
 		cart.productDescription = auction.stockDescription;
 		cart.stockCode = auction.stockCode;
 		cart.quantity = cartItem.quantity;
 		cart.size = auction.size;
 		cart.price = CURRENCY + parseCurreny(cartItem.price) ;
 		cartItems.push(cart);
 	});
 
 	$scope.cartItems = cartItems;
 	$scope.currency =CURRENCY;
	$scope.parseCurreny=splitPrice;
	$scope.splitPrice=parseCurreny;
	if ($scope.itemInBag>1) {
		$scope.isBuyAll = true;
		$scope.buyAllStyle={'visibility': 'visible'};
		$scope.removeButton="Remove All Items";
	}else{
		$scope.buyAllStyle={'visibility': 'hidden'};
		$scope.isBuyAll = false;
		$scope.removeButton="Remove Item";
	}
	var auctionData;
	if ($scope.isBuyAll) {
		auctionData =auctionList;
	}else{
		auctionData =auctionDetails.getAuction(itemList[0].auctionCode);
	}
var initailQty = itemList[0].quantity;
	$scope.qtyEach=itemList[0].quantity;
	var stockValue =auctionData.stockRemaining;
	$scope.stockValue =stockValue;
	if ($scope.limit > $scope.stockValue) {
		$scope.limit = $scope.stockValue;
	}

	
	$scope.unitPrice=parseCurreny((itemList[0].price)*itemList.length);
	var currentTotal = 0;
	$scope.totalAmount=function(){
		var total = 0;
		angular.forEach($scope.cartItems, function (cartItem, index) {
	        total+=cartItem.quantity*cartItem.price;
        });
	    currentTotal=total;
	    return splitPrice(total);
	};
	$scope.budgetAvailableStyle={'visibility': 'hidden'};
	var isBudgetAvailable=auctionList.offerBudgetPay;
	if (isBudgetAvailable && loginUserDetails.getBudgetPay()) {
		$scope.budgetAvailableStyle={'visibility': 'visible'};
		$scope.noOfEmi=auctionList.numberOfEmi;
		$scope.budgetPrice= CURRENCY+ parseCurreny((currentTotal)/$scope.noOfEmi);
	}
	
	$scope.dialogClose = function() { 
		focusService.closeDialog(true);
		close();
	};
	$scope.increaseQuantity=function(){
		$scope.maxlimiterror="";
		if ($scope.qtyEach < $scope.limit && $scope.qtyEach < configMaxLimit) {
			$scope.qtyEach=$scope.qtyEach+1;
		} else {
			if(ISLC)
			$scope.maxlimiterror="Max limit is "+$scope.limit ;
			else
			$scope.maxlimiterror="You can select upto "+$scope.limit + " quantity" ;
		}
		if ($scope.qtyEach >= configMaxLimit) {
			if(ISLC)
				$scope.maxlimiterror="Max limit is "+configMaxLimit ;
				else
				$scope.maxlimiterror="You can select upto "+configMaxLimit+ " quantity" ;
		}
// if ($scope.qtyEach< $scope.stockValue) {
// $scope.qtyEach=$scope.qtyEach+1;
// }
	};
	
	$scope.decreaseQuantity=function(){
		$scope.maxlimiterror="";
		if($scope.qtyEach>1){
		$scope.qtyEach=$scope.qtyEach-1;
		}
	};
	$scope.removeItem=function(){
		GAHelper.sendEvent("Items In Bag","Remove All","Open");
		popupService.showRemoveItemDialog(function(buttonClicked){
			if (buttonClicked && buttonClicked=="yes") {
				GAHelper.sendEvent("Items In Bag","Remove All","Yes");
				var orderDetails =fetchPriceResult.getOrderDetails();
				ApiHelper.releaseOrder(httpservice,orderDetails.bucketId,function(successResponse){
					ItemCartList.clearCartList();
					$state.go('home.singleProduct');
				},function(errorResponse){
					var error = ApiHelper.errorHandling(errorResponse);
					var params ={'message':error,'buttonText':'OK'};
						popupService.showErrorDialog(params);
				},true);
			}else{
				GAHelper.sendEvent("Items In Bag","Remove All","No");
			}
		});
	};
	
	function orderAddressContinue() {
		var orderDetails =fetchPriceResult.getOrderDetails();
		var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
		var couponCode =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
		var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
		ApiHelper.fetchPrice(httpservice, budgetPaySelected,couponCode,storeCredit,function(successResponse) {
					fetchPriceResult.saveDetails(successResponse);
					focusService.closeDialog(true);
					close();
					$state.go('order.details');
				}, function(errorResponse) {
					var error = ApiHelper.errorHandling(errorResponse);
					var params ={'message':error,'buttonText':'OK'};
						popupService.showErrorDialog(params);
				},true,orderDetails.bucketId);
	};
	
	$scope.update=function(){
		var orderState = $state.current.name;
		switch (orderState) {
		case 'order.address':
			if(initailQty == $scope.qtyEach){
				focusService.closeDialog(true);
				close();
			}else{
				 updateClick();
			}
			break;
		case 'order.details':
			focusService.closeDialog(true);
			close();
			break;
		case 'order.payment':
			focusService.closeDialog(true);
			close();
			/*
			 * if (ISLC) { orderPaymentContinue(); }else{
			 * popupService.cvvPopUP(function(cvv){ if (cvv) {
			 * orderPaymentContinue(cvv); } }); }
			 */
			break;
		}
	};
	
	var orderPaymentContinue = function(cvv) {
		var shippingAddress =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_ADDRESS);
		var billingAddress = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BILLING_ADDRESS);
		var shippingMethod =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.SHIPPING_METHOD);
		var storeCredit =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_CREDIT);
		var couponCode =UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.APPLIED_COUPON_CODE);
		var orderDetails =fetchPriceResult.getOrderDetails();
		var budgetPaySelected = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED);
		ApiHelper.placeOrder(httpservice,budgetPaySelected,false,orderDetails.bucketId, function(successResponse){
				placeOrderResult.saveDetails(successResponse);
				focusService.closeDialog(true);
				close();
				$state.go('order.thankyou');
		}, function(errorResponse){
			var error = ApiHelper.errorHandling(errorResponse);
			var params ={'message':error,'buttonText':'OK'};
			popupService.showErrorDialog(params);
		},cvv);
	};
	
	function updateClick(){
		if (Network.isConnected()) {
		GAHelper.sendEvent("Items In Bag","Update");
		popupService.showLoader();
		var orderDetails =fetchPriceResult.getOrderDetails();
		ApiHelper.reserveOrder(httpservice,null,$scope.isBuyAll,function(responseData){
				reserveOrderDetails.saveOrderDetails(responseData.items);
				updateItemCart(ItemCartList.getAllCartList(),responseData.items);
				var itemList  = ItemCartList.getRequest();
				$scope.itemInBag =itemList.length;
				var orderDetails =fetchPriceResult.getOrderDetails();
					// fetch price API
					ApiHelper.fetchPrice(httpservice, false,null,null,function(successResponse){
						popupService.hideLoader();
						fetchPriceResult.saveDetails(successResponse);
						var orderDetails =fetchPriceResult.getOrderDetails();
						var total = splitPrice(orderDetails.payment.total);
						$rootScope.doller  = total[0];
						$rootScope.cent  = total[1];
						focusService.closeDialog(true);
						close();
						// $state.go('order.details');
					}, function(errorResponse){
						popupService.hideLoader();
						if (errorResponse.error  && errorResponse.error.message) {
							var params ={'message':errorResponse.error.message,'buttonText':'OK'};
							popupService.showErrorDialog(params);
						}
					},false,orderDetails.bucketId);
		},function(errorResponse){
			popupService.hideLoader();
			if (errorResponse && errorResponse.error &&  errorResponse.error.message) {
				var error = errorResponse.error;
				var errorCode =error.code;
				if (errorCode=="25" || errorCode=="24") {
					popupService.showInsufficiantDialog(function(buttonClicked){
						if (buttonClicked && buttonClicked=="yes") {
							GAHelper.sendEvent("Items In Bag","Sufficient quantity","Yes");
							orderAddressContinue();
						}else{
							GAHelper.sendEvent("Items In Bag","Sufficient quantity","No");
							$state.go("home.singleProduct");
						}
					},errorCode);
			}else{
				var errorMessage =error.message;
				var params ={'message':errorMessage,'buttonText':'OK'};
				popupService.showErrorDialog(params);
			}
			}else{
				var errorMessage =ApiHelper.errorHandling(errorResponse);
				var params ={'message':errorMessage,'buttonText':'OK'};
				popupService.showErrorDialog(params);
			}
		},false,orderDetails.bucketId,$scope.qtyEach);
		}else{
			popupService.showNetworkError();
		}
	};
	
	function updateItemCart(itemCart,reserveResponseItems){
			angular.forEach(reserveResponseItems,function(reserveItem){
				ItemCartList.setBidderId(reserveItem.auctionCode,reserveItem.bidderId);
				ItemCartList.setPrice(reserveItem.auctionCode,auctionList.currentPrice);
				ItemCartList.setQty(reserveItem.auctionCode,$scope.qtyEach);
		});
	}
	
} ])