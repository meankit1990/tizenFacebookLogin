.controller('CVVController',
	[ '$rootScope', '$scope','$state','close','httpservice','popupService','focusService',
		function($rootScope, $scope, $state,close,httpservice,popupService,focusService) {
		focusService.elements.cvv=[];
		var creditCard = UserDefaultDetails.get(DEFAUTL_DETAILS_TYPE.CARD_INDEX);
		$scope.userName=creditCard.name;
		/*
		 * if (creditCard.type=="American Express" || creditCard.type=="american
		 * express" || creditCard.type=="American express" ||
		 * creditCard.type=="american Express" ||
		 * creditCard.type=="AmericanExpress" ||
		 * creditCard.type=="Americanexpress" ||
		 * creditCard.type=="americanExpress" ||
		 * creditCard.type=="americanexpress") { $scope.cvvMaxLength="4"; }else{
		 * $scope.cvvMaxLength="3"; }
		 */
		$scope.min="3";
		$scope.max="4";
		$scope.card=creditCard.token;
		$scope.dialogClose= function(submit){
			if (submit) {
				$scope.alertErrorInput="";
				$scope.inputError ="";
				var isVaild =isCVVValid($scope.cvv)
				if (isVaild == true) {
						focusService.closeDialog(true);
						close($scope.cvv);
				}else{
					setTimeout(function(){
						$scope.alertErrorInput="alert";
						$scope.inputError =isVaild;
						$scope.$apply();
						focusService.changeCurrentFocus("cvv",0);
					},200);
				}
			}else{
				focusService.closeDialog(true);
				close(null);
			}
		};
		$scope.savecvv = function(cvv) {
			$scope.cvv =cvv;
		};
		
		
		$scope.opneKeyBoard = function() {
			focusService.elementClickhandling();
		};
	}])