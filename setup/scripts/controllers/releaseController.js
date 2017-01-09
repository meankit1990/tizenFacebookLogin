.controller('ReleaseController',
	[  '$scope','$rootScope','close','focusService','httpservice','popupService',
		function($scope,$rootScope,close,focusService,httpservice,popupService) {
		focusService.elements.removeItem=[];
		$scope.yes= function(){
				var length  = ItemCartList.size();
				if (length > 0) {
// setTimeout(function(){
						if (Network.isConnected()) {
							var orderDetails =fetchPriceResult.getOrderDetails();					
							ApiHelper.releaseOrder(httpservice,orderDetails.bucketId,function(successResponse){
								ItemCartList.clearCartList();
								$rootScope.cartEmpty ="empty";
								$rootScope.itemInBag =0;
								closeDialog("yes");
							},function(errorResponse){
								// handle item in bag
								ItemCartList.clearCartList();
								$rootScope.cartEmpty ="empty";
								$rootScope.itemInBag =0;
								var error = ApiHelper.errorHandling(errorResponse);
								var params ={'message':error,'buttonText':'OK'};
								popupService.showErrorDialog(params,function(){
									closeDialog("yes");
								});
							},true);
						}else{
							ItemCartList.clearCartList();
							$rootScope.cartEmpty ="empty";
							$rootScope.itemInBag =0;
						}
// },1000);
					}else{
					// handle it
					ItemCartList.clearCartList();
					$rootScope.cartEmpty ="empty";
					$rootScope.itemInBag =0;
					closeDialog("yes");
				}
			};
		$scope.no= function(){
			closeDialog("no");
		};
		$scope.dialogClose= function(accepted){
			closeDialog("no");
		};
		function closeDialog(buttonClicked){
			focusService.closeDialog(true);
			close(buttonClicked);
		};
	}])