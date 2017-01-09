.controller('ForgetSuccessController', [ '$scope', '$state','focusService', function($scope, $state,focusService) {
	focusService.elements.forget = [];
	$scope.switchPage = function() {
		$state.go("home.login");
	};
} ])
