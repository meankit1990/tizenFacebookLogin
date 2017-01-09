angular
		.module("liqudation")
		.service(
				'popupService',
				[
						'ModalService',
						'focusService',
						function(ModalService, focusService) {
							this.showLoader = function() {
								focusService.initalFocus = false;
								ModalService.showModal(
										{
											templateUrl : BASE_PATH_OF_ROUTING
													+ "/views/loading.html",
											controller : "LoadingController"
										}).then(
										function(modal) {
											focusService.openDialog(modal,
													PopUpMODE.LOADER)
											modal.close.then(function() {

											});
										});
							};

							this.hideLoader = function() {
								focusService.closeDialog(false, true);
							};

							this.showNetworkError = function(callBack) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/networkerror.html",
													controller : "NetworkErrorController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.NETWORKERROR);
													modal.close.then(function(
															result) {
														if (callBack) {
															callBack();
														}
													});
												});
							};

							this.showErrorDialog = function(params, callBack) {
								focusService.initalFocus = false;
								ModalService.showModal(
										{
											templateUrl : BASE_PATH_OF_ROUTING
													+ "/views/popup.html",
											controller : "PopUpController",
											inputs : {
												param : params
											}
										}).then(
										function(modal) {
											focusService.openDialog(modal,
													PopUpMODE.SELECTION)
											modal.close.then(function(result) {
												if (callBack) {
													callBack();
												}
											});
										});
							};

							this.showSelectionDialog = function(params,
									callback) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/popupSelection.html",
													controller : "selectionController",
													inputs : {
														param : params
													}
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function(
																	result) {
																if (focusService.elements.product.length == 0)
																	callback(result);
															});
												});
							};
							this.showProfileOption = function(callback) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/popUpProfileOption.html",
													controller : "PopupProfileOptionController",
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function(
																	choice) {
																if (choice !== undefined) {
																	callback(choice);
																}
															});
												});
							};

							this.showFastBuyDialog = function(callback) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/fastbuypopup.html",
													controller : "FastBuyPopUpController",
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close.then(function(
															accepted) {
														if (accepted) {
															callback();
														}
													});
												});
							};

							this.showFastBuyConfirmDialog = function(callback) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/confirmorder.html",
													controller : "FastBuyController",
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close.then(function(
															confirm) {
														callback(confirm);
													});
												});
							};

							this.showChoiceSelectionDialog = function(params,
									callBack) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/choiceSelection.html",
													controller : "choiceSelectionController",
													inputs : {
														param : params
													}
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close.then(function(
															result) {
														if (callBack) {
															callBack(result);
														}
													});
												});
							};
							this.showFullScreenDialog = function(callBack) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/videoPlayerFull.html",
													controller : "FullScreenController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function() {
																if (callBack) {
																	callBack();
																}
															});
												});
							};
							this.showOptions = function(callback) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/optionsPopup.html",
													controller : "PopUpOptionController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function(
																	choice) {
																if (choice !== undefined) {
																	callback(choice);
																}
															});
												});
							};

							this.showItemInBag = function() {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/itemlistpopup.html",
													controller : "itemInBagController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close
															.then(function() {
															});
												});
							};

							this.showHowToBuy = function() {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/howtobuypopup.html",
													controller : "HowToBuyController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close.then(function(
															choice) {
													});
												});
							};

							this.showBudgetPay = function() {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/budgetpaypopup.html",
													controller : "HowToBuyController"
												})
										.then(
												function(modal) {
													focusService
															.openDialog(
																	modal,
																	PopUpMODE.SELECTION)
													modal.close.then(function(
															choice) {
													});
												});
							};

							this.showRemoveItemDialog = function(callBack) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/removeItempopup.html",
													controller : "RemoveItemController"
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
																if (callBack) {
																	callBack(buttonclicked);
																}
															});
												});
							};
							this.showInsufficiantDialog = function(callBack,errorCode) {
								focusService.initalFocus = false;
								ModalService
										.showModal(
												{
													templateUrl : BASE_PATH_OF_ROUTING
															+ "/views/insufficientpopup.html",
													controller : "InsufficiantController",
													inputs : {
														param : errorCode
													}
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
																if (callBack) {
																	callBack(buttonclicked);
																}
															});
												});
							};

							this.cvvPopUP = function(callBack) {
								focusService.initalFocus = false;
								ModalService.showModal(
										{
											templateUrl : BASE_PATH_OF_ROUTING
													+ "/views/cvvpopup.html",
											controller : "CVVController"
										}).then(
										function(modal) {
											focusService.openDialog(modal,
													PopUpMODE.SELECTION)
											modal.close.then(function(cvv) {
												if (callBack) {
													callBack(cvv);
												}
											});
										});
							};

						} ]);
