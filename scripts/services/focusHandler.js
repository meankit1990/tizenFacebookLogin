angular
		.module("liqudation")
		.service(
				'focusService',
				[
						'$state',
						'ModalService',
						function($state, ModalService) {
							focusService = {};
							focusService.scrollValue = 50;
							focusService.currentScrollValue = 0;
							focusService.maxScroll = 0;
							focusService.popupElement = [];
							focusService.elements = {
								header : [],
								product : [],
								login : [],
								registration : [],
								footer : [],
								video : [],
								orderDetails : [],
								orderAddress : [],
								selectItem : [],
								orderPaymentDetails : [],
								fastBuy : [],
								inActive : [],
								thankYou : [],
								popUp : [],
								profile : [],
								programGuide : [],
								forget : [],
								header : [],
								iteminbag : [],
								help : [],
								removeItem : [],
								cvv : [],
								cservice : [],
								popups : []
							};

							focusService.currentElement = "";
							focusService.isImeFocused = false;
							focusService.initalFocus = false;

							focusService.autoFocus = {
								index : 0,
								tag : "",
								element : "",
								isFocused : false
							};

							focusService.last = {
								index : 0,
								tag : "",
								element : ""
							};

							focusService.currentLocation = {
								index : 0,
								tag : ""
							};
							focusService.lastElement = function(element) {
								focusService.last.element = element;
								focusService.last.tag = element[0].attributes.tag.value;
								focusService.last.index = focusService.elements[focusService.last.tag].length - 1;
							}

							focusService.autoFocused = function(element, index) {
								if (!focusService.initalFocus) {
									if (focusService.focusable(element)) {
										focusService.initalFocus = true;
										focusService.currentElement = element;
										var tagValue = element[0].attributes.tag.value;
										focusService.currentLocation.tag = tagValue;
										focusService.currentLocation.index = index;
										focusService.currentElement[0].focus();
										if (!focusService.autoFocus.isFocused) {
											focusService.autoFocus.isFocused = true;
											focusService.autoFocus.element = element;
											focusService.autoFocus.tag = tagValue;
											focusService.autoFocus.index = index;
										}
									}
								}
							}

							focusService.changeAutoFocus = function(index) {
								var element = focusService.elements.product[index];
								if (element) {
									var tagValue = element[0].attributes.tag.value;
									focusService.autoFocus.isFocused = true;
									focusService.autoFocus.element = element;
									focusService.autoFocus.tag = tagValue;
									focusService.autoFocus.index = index;
								}
							}

							focusService.changeCurrentFocus = function(tag,
									index) {
								if (focusService.elements[tag]
										&& (focusService.elements[tag].length > 0)) {
									var element = focusService.elements[tag][index];
									if (element) {
										focusService.currentElement = element;
										var tagValue = element[0].attributes.tag.value;
										focusService.currentLocation.tag = tagValue;
										focusService.currentLocation.index = index;
										focusService.currentElement.focus();
									}
								}
							}

							focusService.returnHandling = function(state,
									currentState, previousState) {
								tizen.application.getCurrentApplication().exit();
							}
							focusService.keyboardBackHandling = function() {
								tizen.application.getCurrentApplication().exit();
							}

							focusService.keyBoardCancelHandling = function() {
								setTimeout(function() {
									focusService.keyboardBackHandling();
								}, 500);

							}
							focusService.keyBoardDoneHandling = function() {
								focusService.keyboardBackHandling();
							}

							focusService.keyBoardExit = function() {
								//destroyVideo();
								tizen.application.getCurrentApplication().exit();
							}
							// This Method is used for handling the click for
							// input and show the keyboard

							focusService.elementClickhandling = function() {
								var currentFocusedElement = focusService.currentElement
										.children()[0];
								if (currentFocusedElement !== undefined) {
									focusService.currentElement.blur();
									currentFocusedElement.focus();
									focusService.isImeFocused = true;
								}
							}
							// This Method is used for checking the element is
							// focusable or not

							focusService.focusable = function(element) {
								if (element[0]) {
									if (element[0].attributes["ng-disabled"]) {
										if (element[0].attributes["ng-disabled"].value == "false") {
											return true;
										}
										return false;
									} else if (element[0].style.visibility == "hidden") {
										return false;
									} else if (element[0].style.display == "none") {
										return false;
									}
									return true;
								}
							}
							// This Method is used for pushing DialogData

							focusService.pushDialogData = function(data) {
								focusService.popupElement.push(data);
							};
							// This Method is used for popping DialogData

							focusService.popDialogData = function() {
								focusService.popupElement.pop();
							};

							// This Method is used for closing the by the user
							// or by back button event of remote
							focusService.closeDialog = function(isUserClicked,
									isForLoader) {
								if (focusService.popupElement.length > 0) {
									var popUpData = focusService.popupElement[focusService.popupElement.length - 1];
									if (popUpData) {
										if (isUserClicked) {
											focusService
													.completeRemoveDialog(popUpData);
										} else {
											focusService.closeDialogType(
													popUpData, isForLoader);
										}
									}
								}
							};
							// This Method is used for closing the dialog and
							// focus reInitializeFocus
							focusService.completeRemoveDialog = function(
									popUpData) {
								var focusData = popUpData.getFocusData();
								focusService.reInitializeFocus(focusData);
								focusService.popDialogData();
							};

							// This Method is used for closing the dialog on the
							// basis of their type.

							focusService.closeDialogType = function(popUpData,
									isForLoader) {
								switch (popUpData.getPopUpMode()) {
								case PopUpMODE.LOADER:
									if (isForLoader) {
										var controllerScope = popUpData
												.getScope();
										if (controllerScope
												&& controllerScope.scope) {
											controllerScope.scope.dialogClose();
										}
									}

									break;
								case PopUpMODE.ERROR:

									break;
								case PopUpMODE.SELECTION:
								case PopUpMODE.NETWORKERROR:
									var controllerScope = popUpData.getScope();
									if (controllerScope
											&& controllerScope.scope) {
										controllerScope.scope.dialogClose();
									}
									break;
								case PopUpMODE.INFO:

									break;
								case PopUpMODE.AUTOCLOSE:

									break;
								default:
									break;
								}
							}
							// This Method is used for creating the model of
							// currentFocus and PopData for the dialog

							focusService.openDialog = function(scope, mode) {
								var focusEle = new focusElement();
								focusEle
										.setFocusedElement(focusService.currentElement);
								focusEle
										.setFocusedElementIndex(focusService.currentLocation.index);
								focusEle
										.setFocusedElementTag(focusService.currentLocation.tag);
								var popupData = new PopUpData();
								popupData.setFocusData(focusEle);
								popupData.setScope(scope);
								popupData.setPopUpMode(mode);
								focusService.pushDialogData(popupData);
							};

							// This Method is used for reInitializeFocus after
							// closing the dialog
							focusService.reInitializeFocus = function(focusEle) {
								if (focusEle && focusEle.getFocusedElement()) {
									focusService.currentElement = focusEle
											.getFocusedElement();
									focusService.currentLocation.index = focusEle
											.getFocusedElementIndex();
									focusService.currentLocation.tag = focusEle
											.getFocusedElementTag();
									focusService.currentElement[0].focus();
									setTimeout(
											function() {
												if ($state.current.name == "home.noauction") {
													if (focusService.popupElement.length < 1) {
														focusService
																.changeCurrentFocus(
																		"header",
																		1);
													}
												}
											}, 150);
								}
							};

							focusService.exitDialogHandling = function() {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/exitpopup.html",
													controller : "ExitDialogController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function(
																	buttonclicked) {
																if (buttonclicked
																		&& buttonclicked == "exit") {
																	destroyVideo();
																}
															});
												});

							};
							focusService.releaseDialog = function() {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/releasepopup.html",
													controller : "ReleaseController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function(
																	buttonclicked) {
																if (buttonclicked
																		&& buttonclicked == "yes") {
																	$state
																			.go("home.singleProduct")
																}
															});
												});

							};

							focusService.navigate = function(keyEvent,
									defaultValue) {
								if (focusService.isImeFocused)
									return;
								if (!focusService.currentElement[0]) {
									return;
								}
								if (defaultValue === undefined) {
									defaultValue = {};
									defaultValue.cElement = focusService.currentElement;
									defaultValue.cTag = focusService.currentLocation.tag;
									defaultValue.cIndex = focusService.currentLocation.index;
								}
								if (focusService.currentElement[0].attributes[keyEvent]) {
									if (focusService.currentElement[0].attributes[keyEvent].value == "next") {
										focusService.currentElement = (focusService.currentLocation.index == focusService.elements[focusService.currentLocation.tag].length) ? focusService.currentElement
												: focusService.elements[focusService.currentLocation.tag][++focusService.currentLocation.index];
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "prev") {
										focusService.currentElement = (focusService.currentLocation.index == focusService.elements[focusService.currentLocation.tag].length) ? focusService.currentElement
												: focusService.elements[focusService.currentLocation.tag][--focusService.currentLocation.index];
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "tabIndex") {
										focusService.currentElement = focusService.autoFocus.element;
										focusService.currentLocation.tag = focusService.autoFocus.tag;
										focusService.currentLocation.index = focusService.autoFocus.index;
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "last") {
										focusService.currentElement = focusService.last.element;
										focusService.currentLocation.tag = focusService.last.tag;
										focusService.currentLocation.index = focusService.last.index;
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "scrollUp") {
										if (focusService.currentElement[0].scrollTop <= 0) {
											focusService.currentElement[0].scrollTop = 0;
											// alter contains the focusable
											// element to the up if scrolled to
											// top.
											focusService.navigate("alter");
										} else {
											focusService.currentElement[0].scrollTop = focusService.currentElement[0].scrollTop - 50;
										}
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "scrollDown") {
										focusService.currentElement[0].scrollTop = focusService.currentElement[0].scrollTop + 50;
									} else if (focusService.currentElement[0].attributes[keyEvent].value == "stateChange") {
										$state
												.go(focusService.currentElement[0].attributes["state"].value);
										return;
									} else {
										var next = focusService.currentElement[0].attributes[keyEvent].value
												.split(".");
										var currentIndex = 0;
										if (!focusService.elements[next[0]]) {
											return;
										}
										focusService.elements[next[0]]
												.forEach(function(e) {
													if ((e[0].attributes.id)
															&& (e[0].attributes.id.value == next[1])) {
														focusService.currentElement = e;
														focusService.currentLocation.tag = next[0];
														focusService.currentLocation.index = currentIndex;
													}
													currentIndex++;
												});
									}

									// console.log(focusService.currentElement[0]);
									if (focusService
											.focusable(focusService.currentElement)) {
										focusService.currentElement[0].focus();
									} else {
										focusService.navigate(keyEvent,
												defaultValue);
									}
								} else {
									if (defaultValue) {
										// Disable
										focusService.currentElement = defaultValue.cElement;
										focusService.currentLocation.tag = defaultValue.cTag;
										focusService.currentLocation.index = defaultValue.cIndex;
									} else {
										// Enable
									}
								}

							};
							return focusService;
						} ]);
