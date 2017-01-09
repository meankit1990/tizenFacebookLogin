.controller('CoustomerServiceController',
	[ '$rootScope', '$scope','$state','focusService','httpservice',
		function($rootScope, $scope, $state,focusService,httpservice) {
		focusService.elements.help = [];
		focusService.elements.cservice = [];
		$rootScope.showVideoDesc=false;
		setTimeout(function(){
			focusService.changeCurrentFocus("help",0);
		},100);
		$rootScope.fromHeader = "help.customerService";
		$rootScope.disableHeaderLogin=false;
		$rootScope.loginDisable ="";
		$scope.showTerms = false;
		$scope.showTnC=function(){
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
			$scope.showTerms= true;
		};
		$scope.showCustomerService=function(){
			$scope.showTerms= false;
		};
		$scope.continueWatching= function(){
			$state.go('home.singleProduct'); 
		};
	}])
	