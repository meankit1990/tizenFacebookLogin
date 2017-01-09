.controller('orderPaymentController', [ '$rootScope','$scope', '$state','focusService','httpservice','popupService', function($rootScope,$scope, $state,focusService,httpservice,popupService) {
	focusService.elements.orderPaymentDetails = [];
	$rootScope.buyAllStyle={'visibility': 'hidden'};
	$rootScope.showBuyAllText = false;
	if(ISLC)
		$rootScope.showVideoDesc=false;
	else
	$rootScope.showVideoDesc=true;
	if (ISLC) {
		$rootScope.focusableIndexFromFooter = "orderPaymentDetails.list0";
		$scope.focusableIndexFromRefesh ="orderPaymentDetails.list0";
	}else{
		if(UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.BUDGET_PAY_SELECTED)){
			$rootScope.isBudgetPay = "BUDGET PAY ";
		}else{
			$rootScope.isBudgetPay = "";
		}
		$rootScope.focusableIndexFromFooter = "orderPaymentDetails.refresh";
		$scope.focusableIndexFromRefesh ="footer.continue";
	}
	
	$rootScope.footerButtonText = "PAY NOW";
	$scope.selectedIndex=0;
	GAHelper.sendScreenView("Payment");
	showCards(false);
function showCards(isRefreshed,element){
	$scope.cards = loginUserDetails.getCards();;
	for(var i = 0; i < $scope.cards.length; i++){
	    var card = $scope.cards[i];
	    if(card.default === true){
			$scope.selectedIndex=i;	
			UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.CARD_INDEX,card);
			setDefaultCard(i);
	    }
	}
	var creditCard = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.CARD_INDEX);
	if (creditCard == 0) {
		UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.CARD_INDEX,$scope.cards[0]);
		setDefaultCard(0);
	}
	if (isRefreshed) {
		if (ISLC) {
			focusService.elements.orderPaymentDetails.push(element);
		}else{
			//
		}
	}
};

$scope.selectedCard = function(clickIndex){
	setDefaultCard(clickIndex);
};

function setDefaultCard(clickIndex){
	$scope.selectedIndex=clickIndex;	
	UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.CARD_INDEX,$scope.cards[clickIndex]);
}
	
	$scope.refreshCards=function(){
		// GAHelper.sendEvent("Payment Selection","Refresh");
		ApiHelper.userProfile(httpservice,loginUserDetails.userId(),function(responseData){
			UserDefaultDetails.set(DEFAUTL_DETAILS_TYPE.CARD_INDEX,0);
			ApiHelper.saveUserProfileData(responseData);
			var refreshButtonPostion =0; // For LC
			if (ISLC) {
				refreshButtonPostion =0;
			}else{
				refreshButtonPostion =$scope.cards.length;
			}
			var refreshObject =focusService.elements.orderPaymentDetails[refreshButtonPostion];
			if (ISLC) {
				focusService.elements.orderPaymentDetails= [];
			}else{
				// focusService.elements.orderPaymentDetails= [];
				$scope.cards="";
			}
			showCards(true,refreshObject);
		},function(errorResponse){
			var errorMessage = ApiHelper.errorHandling (errorReponse);
			var params ={'message':errorMessage,'buttonText':'OK'};
			popupService.showErrorDialog(params);
		},true);
	}
	
} ])
