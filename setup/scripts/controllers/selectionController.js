.controller('selectionController', [ '$scope', '$state','close','param', function($scope, $state,close,param) {
    focusService.elements.selectItem = [];
    $scope.popupInfo = angular.fromJson(param);
    $scope.dialogClose = function(rec) {
		focusService.closeDialog(true);
		close(rec);
	};
	 $scope.formatedAddress = function (record) {
	    	return getFormatedAddress(record);
	    };
   
	    $scope.shippingDetails = function (shippingMethod) {
	    	var price =splitPrice(shippingMethod.shippingCharges);
	    	return shippingMethod.shippingMethodName + " ("+price[0]+ price[1]+")";
	    };
	    
    $scope.checkDefault = function (record) {
    	if ($scope.popupInfo.defaultSelected==record) {
			return true;
		}else   
        	return false;
    };
} ])
