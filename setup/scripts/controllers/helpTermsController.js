.controller('HelpTermsController',
	[ '$rootScope', '$scope','$state','httpservice','focusService',
		function($rootScope, $scope, $state,httpservice,focusService) {
		focusService.elements.help = [];
		$rootScope.fromHeader = "help.terms";
		$rootScope.disableHeaderLogin=false;
		$rootScope.loginDisable ="";
		showTermsAndCondition();
		function showTermsAndCondition(){
			GAHelper.sendScreenView("Terms and Condtitions");
			if(Terms.getData()){
				$scope.termsText = Terms.getData();
			}else{
				ApiHelper.termsAndCondition(httpservice,function (responseData){
					var terms = responseData.termsAndConditions;
					if (terms) {
						var rex = /(<([^>]+)>)/ig;
						terms = terms.replace(rex,"");
						Terms.saveData(terms);
						$scope.termsText = Terms.getData();
					}else{
						// show Error Dialog of exit Application
					}
				});
			}
		}
	}])
	