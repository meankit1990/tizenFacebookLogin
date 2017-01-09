.controller('choiceSelectionController', ['$scope', '$state','focusService','close','param', function($scope, $state,focusService,close,param) {
	focusService.elements.selectItem = [];
	var params =angular.fromJson(param);
	angular.forEach(params.data,function(auction){
		if(auction.auctionCode=="-9999"){
			auction.size = "BUY ALL";
		}
	});
	$scope.selectionInfo = params.data;
	$scope.defaultSelected = params.defaultKey;
	$scope.dialogClose = function(data) {
		focusService.closeDialog(true);
		close(data);
	};
} ])