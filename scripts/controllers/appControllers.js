'use strict';
angular
		.module('liqudation')
		.controller(
				'IndexController',
				[
						'$rootScope',
						'$scope',
						'$state',
						'popupService',
						'focusService',
						'httpservice',
						function($rootScope, $scope, $state, popupService,
								focusService, httpservice) {
							$scope.showDetails = false;
							$scope.showCode = false;
							if (IS_TV) {
								Network.init();
							}
							var loginInterVal;
							focusService.elements.video = [];
							$scope.login = function() {
								ApiHelper.createCode(httpservice, function(
										success) {
									showPin(success);
									console.log(angular.toJson(success));
								}, function(failure) {
									console.log("Failure", angular
											.toJson(failure));
								});
							}
							function showPin(pinResponse) {
								
								$scope.pin = pinResponse.data.user_code;
								$scope.webUrl = pinResponse.data.verification_uri;
								$scope.timeout = pinResponse.data.expires_in;
								$scope.showCode = true;
								loginInterVal = setInterval(
										function() {
											ApiHelper
													.verify(
															httpservice,
															function(success) {
																console
																		.log(angular
																				.toJson(success));
																getUserDetails(success.data.access_token);
															},
															function(failure) {
																console
																		.log(
																				"Failure",
																				angular
																						.toJson(failure));
															},
															pinResponse.data.code);
										}, 5000);
							}
							function getUserDetails(accessToken) {
								clearInterval(loginInterVal);
								ApiHelper
										.getUserDetails(
												httpservice,
												function(success) {
													$scope.showDetails = true;
													$scope.userName = success.data.name;
													$scope.gender = success.data.gender;
													$scope.productImage = success.data.picture.data.url;
													$scope.userEmail = success.data.email;
												}, function(failure) {

												}, accessToken)

							}

						} ])