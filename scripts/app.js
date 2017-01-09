'use strict';
angular
		.module('liqudation', [ 'ui.router', 'angularModalService' ])
		.config(
				function($stateProvider, $urlRouterProvider) {
					$stateProvider
							.state(
									'app',
									{
										url : '/',
										templateUrl : BASE_PATH_OF_ROUTING
												+ '/views/splash.html',
										controller : 'IndexController'
									})
					$urlRouterProvider.otherwise('/');
				});