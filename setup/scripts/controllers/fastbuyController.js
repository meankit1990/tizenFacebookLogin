.controller('FastBuyController',
	[ '$rootScope', '$scope','$state','close','httpservice','popupService','focusService','itemService',
		function($rootScope, $scope, $state,close,httpservice,popupService,focusService,itemService) {
		focusService.elements.fastBuy = [];
		GAHelper.sendScreenView("Fast Buy");
		var orderDetail =fetchPriceResult.getOrderDetails();
		bindOrderDetailsData(orderDetail);
		if (loginUserDetails.details) {
			$scope.shippingAddress = getFormatedAddress(loginUserDetails.getDefaultShippingAddress());
			$scope.billingAddress = getFormatedAddress(loginUserDetails.getDefaultBillingAddress());
			var card =loginUserDetails.getDefaultCard();
			UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.CARD_INDEX,loginUserDetails.getDefaultCard());
			$scope.defaultCard = card.token;
			$scope.expireOn=card.expires;
			$scope.userName=loginUserDetails.getUserName();
			
		}
		$scope.dialogClose= function(confirm){
			if (confirm) {
				if(ItemCartList.getAllCartList.length == 0){
				GAHelper.sendEvent("Fast Buy","Confirm","Single");
				}else{
				GAHelper.sendEvent("Fast Buy","Confirm","Multiple");
				}
				ApiHelper.placeOrder(httpservice,false, true,orderDetail.bucketId, function(successResponse){
					placeOrderResult.saveDetails(successResponse);
					focusService.closeDialog(true);
					close(confirm);
					$state.go('order.thankyou');
				}, function(errorResponse){
					if (errorResponse.error && errorResponse.error.message) {
						var params ={'message':errorResponse.error.message,'buttonText':'OK'};
						popupService.showErrorDialog(params);
					}
					
				});
			}else{
				focusService.closeDialog(true);
				close(confirm);
			}
		};
		
		function bindOrderDetailsData(orderDetails){
			$scope.totalPrice = CURRENCY + parseCurreny(orderDetails.payment.total);
			$scope.subTotal = CURRENCY + parseCurreny(orderDetails.payment.subTotal);
			$scope.storeCredit = CURRENCY + parseCurreny(orderDetails.payment.creditAmount);
			$scope.tax = CURRENCY + parseCurreny(orderDetails.payment.tax);
			$scope.discount = CURRENCY + parseCurreny(orderDetails.payment.discount);
			$scope.delivery = CURRENCY + parseCurreny(orderDetails.payment.delivery);

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
		 	$scope.focusable=0;
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
		 	
		};
	}])