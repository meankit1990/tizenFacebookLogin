'use strict';
var expirytime = 6 * 10 * 1000;
angular
		.module("liqudation")
		.service(
				'httpservice',
				[
						'$rootScope',
						'$http',
						'$q',
						'popupService',
						function($rootScope, $http, $q, popupService) {
							this.get = function(relativeurl, showLoader, header) {
								if (!Network.isConnected()) {
									popupService.showNetworkError();
									return;
								}

								if (showLoader) {
									popupService.showLoader();
								}
								if (!header) {
									header = {};
								}
								header["Content-Type"] = 'application/json;charset=utf-8';
								var deferred = $q.defer();
								var request = $http({
									method : "get",
									url : relativeurl,
									timeout : expirytime,
									headers : header
								});
								request.then(function(response) {
									if (showLoader) {
										popupService.hideLoader();
									}
									deferred.resolve(response);
								},
										function(error) {
											if (showLoader) {
												popupService.hideLoader();
											}
											deferred.reject(error);
										});
								return deferred.promise;
							};

							this.post = function(relativeurl, params,
									showLoader, header) {
								if (!Network.isConnected()) {
									popupService.showNetworkError();
									return;
								}
								if (showLoader) {
									popupService.showLoader();
								}
								if (!header) {
									header = {};
								}
								header["Content-Type"] = 'application/json;charset=utf-8';

								var deferred = $q.defer();
								var request = $http({
									method : "POST",
									url : relativeurl,
									data : params,
									timeout : expirytime,
									headers : header
								});
								request.then(function(response) {
									if (showLoader) {
										popupService.hideLoader();
									}
									deferred.resolve(response);
								}, function(error) {
									if (showLoader) {
										popupService.hideLoader();
									}
									deferred.reject(error);
								});

								return deferred.promise;
							};
						} ]);
