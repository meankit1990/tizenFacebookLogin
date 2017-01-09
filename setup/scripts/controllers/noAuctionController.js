.controller('NoAuctionController', [ '$rootScope','$scope', '$state','focusService','$stateParams','httpservice', function($rootScope,$scope, $state,focusService,$stateParams,httpservice) {
	$scope.auctionError = $stateParams.auctionError;
	$rootScope.footerVisibility = false;
	$rootScope.disableHeaderLogin=false;
	$rootScope.loginDisable ="";
	$rootScope.headerNext ="";
	
	setTimeout(function(){
		if (focusService.popupElement.length > 0) {
			
		}else{
			focusService.changeCurrentFocus("header",1);
		}
	},300);
	
	var auctionInterval = setInterval(function(){
		if(Network.isConnected()){
			ApiHelper.fetchAuction(httpservice,function(successResponse){
			auctionDetails.saveAuctions(successResponse);
		 	var auctionList = auctionDetails.getAuctionDetails();
		 	if(auctionList){
			$state.go("home.singleProduct");
		 	}
			},function(errorResponse){
				var error = ApiHelper.errorHandling(errorResponse);
				$scope.auctionError = error;
			});
		}
	},POLLING_TIME);
	
	
	 $scope.$on("$destroy", function () {
	     // Unbind angular event listeners
			clearInterval(auctionInterval);	
	   });	
} ])
