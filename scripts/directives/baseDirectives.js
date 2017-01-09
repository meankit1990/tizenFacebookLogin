angular
		.module('liqudation')
		.directive(
				'navigatableWithKeyboard',
				[
						"$state",
						'$rootScope',
						"focusService",
						function($state, $rootScope, focusService) {
							return {
								restrict : 'A',
								scope : {

								},
								link : function(scope, element, attributes) {
									scope
											.$watch(
													attributes.tabindex,
													function() {
														if (attributes.tabindex !== undefined
																&& attributes.tag !== undefined) {
															focusService
																	.autoFocused(
																			element,
																			focusService.elements[attributes.tag].length);
														}
														if (attributes.tag !== undefined) {
															focusService.elements[attributes.tag]
																	.push(element);
														}
														if (attributes.last !== undefined) {
															focusService
																	.lastElement(element);
														}
													});
									element
											.off("keydown")
											.on(
													"keydown",
													function(event) {
														scope
																.$apply(function() {
																	switch (event.keyCode) {
																	case tvKey.KEY_DOWN:
																		focusService
																				.navigate("down");
																		break;
																	case tvKey.KEY_UP:
																		focusService
																				.navigate("up");
																		break;
																	case tvKey.KEY_LEFT:
																		focusService
																				.navigate("left");
																		break;
																	case tvKey.KEY_RIGHT:
																		focusService
																				.navigate("right");
																		break;
																	case tvKey.KEY_7:

																	case tvKey.KEY_RETURN:
																		focusService
																				.returnHandling(
																						$state,
																						$rootScope.currentState,
																						$rootScope.previousState);
																		break;
																	case tvKey.KEY_5:
																	case tvKey.KEY_DONE_KEYBOARD:
																		focusService
																				.keyBoardDoneHandling();
																		var okcallback = scope.$parent.keyBoardDoneHandling;
																		if (okcallback) {
																			okcallback();
																		}
																		break;
																	case tvKey.KEY_CANCEL_KEYBOARD:
																		focusService
																				.keyBoardCancelHandling();
																		break;
																	case tvKey.KEY_EXIT:
																		focusService
																				.keyBoardExit();
																		break;
																	default:
																		break;
																	}
																});
													});
								}
							}
						} ]);