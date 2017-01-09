.controller('ProductSingleSKUController', [ '$rootScope','$scope', '$state','itemService','popupService','focusService','httpservice','$stateParams',  function($rootScope,$scope, $state,itemService,popupService,focusService,httpservice,$stateParams) {
	var isUserLoggedIn = loginUserDetails.isLoggedIn();
	init(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
	changeVideoPlayerView(VIDEO_STYLE.CORDX,VIDEO_STYLE.CORDY,VIDEO_STYLE.WIDTH,VIDEO_STYLE.HEIGHT,$rootScope);
	$rootScope.headerNext = "tabIndex";
	if (ISLC) {
		$rootScope.showFastbuyButton=true;
		$rootScope.fastBuyButtonSyle={'visibility': 'visible'};
	}else{
		$scope.showHighEndAuction =false;
		$scope.showPreOrder =false;
		$scope.showFastbuyButton=false;
		$rootScope.fastBuyButtonSyle={'visibility': 'hidden'};
	}
	GAHelper.sendScreenView("Home");
	if ($stateParams) {
		var option = $stateParams.popupType;
		if ($rootScope.openedByFastBy) {
		setTimeout(function() {
			switch (option) {
			case POPUPTYPE.PROFILE:
				popupService.showProfileOption(function(selectedOption){
					switch (selectedOption) {
					case 0:
						// show Profile
						$rootScope.openedByFastBy=true;
						if(isUserLoggedIn){
							ApiHelper.userProfile(httpservice,loginUserDetails.userId(),
									function(responseData){
									ApiHelper.saveUserProfileData(responseData);
									$state.go('profile.myprofile'); 
								},function(errorResponse){
									var error = ApiHelper.errorHandling(errorResponse);
									var params ={'message':error,'buttonText':'OK'};
									popupService.showErrorDialog(params);
								},true);
						}
						break;
					case 1:
						// show History
						// $state.go('profile.orderhistory');
						break;
					case 2:
						// LogOut
						$rootScope.openedByFastBy=false;
						focusService.changeAutoFocus(0);
						logOut($state,$rootScope,focusService);
						$rootScope.userName =loginUserDetails.getUserName();
						isUserLoggedIn = loginUserDetails.isLoggedIn();
						$rootScope.fastbuyclass="disable-green-btn";
						$rootScope.fastbuymessage=FASTBUY_UNREGISTERED;
						break;
					}
				});
				break;
			case POPUPTYPE.OPTION:
				popupService.showOptions(function(selectedOption){
					$rootScope.openedByFastBy=true;
					switch (selectedOption) {
					case 0:
						// show Help
						if(Network.isConnected()){
							$state.go('options.customerService');
						}else{
							popupService.showNetworkError();
						}
						break;
					case 1:
		// show Program Guide
						if(Network.isConnected()){
							$state.go('options.programGuide');
						}else{
							popupService.showNetworkError();
						}
						break;
					}
				});
				break;
			}
			}, 80);
		}
	}
	$rootScope.openedByFastBy=false;
	UserDefaultDetails.clear();
	focusService.elements.product = [];
	focusService.elements.footer = [];
	focusService.elements.orderDetails = [];
		
	var selectedAuction;
	var currentAuctionId;
	var configMaxLimit;
	
	if (isUserLoggedIn) {
		var isActive=loginUserDetails.isActive();
		var isEligible=loginUserDetails.isEligible();
		if (!isEligible) {
			$rootScope.fastbuyclass="disable-green-btn";
			$rootScope.fastbuymessage=FASTBUY_INCOMPLETE;
		}else{
			var isEnable =loginUserDetails.getFastBuy();
			if (isEnable=="false") {
				$rootScope.fastbuyclass="disable-green-btn";
				$rootScope.fastbuymessage=FASTBUY_DISABLE;
			}else{
				$rootScope.fastbuyclass="green-btn";
				$rootScope.fastbuymessage="";
			}
		}
		hideHomeInput($rootScope);
	}else{
		$rootScope.fastbuyclass="disable-green-btn";
		$rootScope.fastbuymessage=FASTBUY_UNREGISTERED;
		showHomeInput($rootScope);
	}

	$rootScope.footerVisibility = true;
	$rootScope.disableHeaderLogin=false;
	$rootScope.loginDisable ="";
	$rootScope.userName =loginUserDetails.getUserName();

	
	var element =  focusService.elements.video[0];
	if (element) {
		element[0].attributes["up"].value="header.username";
	}
	loadAuction();
 	var auctionList = auctionDetails.getAuctionDetails();
 	if (!auctionList) {
 		var errorMessage="The next auction will start soon";
 		if (focusService.popupElement.length > 0) {
			focusService.closeDialog(false);
			setTimeout(function(){
	 			$state.go('home.noauction',{auctionError:errorMessage});
		},200);
		}else{
 			$state.go('home.noauction',{auctionError:errorMessage});
		} 
	}
 	
 	if(auctionList.groupAuctionType == 1 || auctionList.groupAuctionType == 2){
 			$scope.selectedOption=DEFAULT_CHOICE;
 	}else{
 		$scope.selectedOption="";
 	}
 	
 	setAuctionData(auctionList);
 	
 	var auctionInterval = 0;
	clearInterval(auctionInterval);
	var popupshown = false;
	startAuction();
	function startAuction(){
		auctionInterval = setInterval(function(){
			if(Network.isConnected()){
				 loadAuction();				
			}else{
				if(!popupshown){
				popupService.showNetworkError();
				popupshown = true;
				}
			}
	},POLLING_TIME);
	};
		
	
		setConfigData(ConfigData.getConfigration());
	
	if ($scope.limit > $scope.inStock) {
		$scope.limit = $scope.inStock;
	}

	
	if (ISLC) {
		$rootScope.orderButtonSyle={'visibility': 'visible'};
		$rootScope.itemInBagStyle={'visibility': 'visible'};
		$rootScope.showOrderButton=true;
	}else{
		highEndChecking(auctionList);
	}
	// add default 1 Qty and styling
	$scope.selectedQuantity = 1;
	clearItemInBag();
	$rootScope.showPrice=true;
	function clearItemInBag(){
		var length  = ItemCartList.size();
		if (length > 0) {
// setTimeout(function(){
				if (Network.isConnected() && isUserLoggedIn) {
					var orderDetails =fetchPriceResult.getOrderDetails();					
					ApiHelper.releaseOrder(httpservice,orderDetails.bucketId,function(successResponse){
						ItemCartList.clearCartList();
						$rootScope.cartEmpty ="empty";
						$rootScope.itemInBag =0;
					},function(errorResponse){
						// handle item in bag
						ItemCartList.clearCartList();
						$rootScope.cartEmpty ="empty";
						$rootScope.itemInBag =0;
// var error = ApiHelper.errorHandling(errorResponse);
// var params ={'message':error,'buttonText':'OK'};
// popupService.showErrorDialog(params);
					},false);
				}else{
					ItemCartList.clearCartList();
					$rootScope.cartEmpty ="empty";
					$rootScope.itemInBag =0;
				}
// },1000);
			}else{
			// handle it
			ItemCartList.clearCartList();
			$rootScope.cartEmpty ="empty";
			$rootScope.itemInBag =0;
		}
		
	};
	
	$scope.increaseQuantity = function() {
		$scope.maxlimiterror="";
		$scope.alertErrorQty ="";
		$rootScope.showPrice=true;
		$rootScope.itemInBag =0;
		if ($scope.selectedQuantity < $scope.limit && $scope.selectedQuantity < configMaxLimit) {
			$scope.selectedQuantity = ++$scope.selectedQuantity ;
		} else {
			// "Reached to highest quantity available"
			if(ISLC)
				$scope.maxlimiterror="Max limit is "+$scope.limit ;
				else
				$scope.maxlimiterror="You can select upto "+$scope.limit + " quantity" ;		}
		if ($scope.selectedQuantity >= configMaxLimit) {
			// "Reached to highest quantity from config"
			if(ISLC)
				$scope.maxlimiterror="Max limit is "+configMaxLimit ;
				else
				$scope.maxlimiterror="You can select upto "+configMaxLimit+ " quantity" ;
			}
		
		calculatePrice();
		checkBudgetPay(auctionList);
	};
	
	function calculatePrice(){
		var totalPrice;
		if(selectedAuction && selectedAuction.size == "BUY ALL"){
			totalPrice = auctionList.currentPrice*$scope.selectedQuantity * (auctionList.availableAuctions.length-1) +".";
		}else{
			totalPrice = auctionList.currentPrice*$scope.selectedQuantity +".";
		}
		var price = splitPrice(totalPrice);
		$scope.budgetPrice=parseCurreny((totalPrice*$scope.selectedQuantity)/$scope.noOfEmi);
		$rootScope.dollerAmount = price[0];
		$rootScope.centAmount = price[1];
	};
	
	$scope.decreaseQuantity = function() {
		$scope.maxlimiterror="";
		$scope.alertErrorQty ="";
		if($scope.selectedQuantity > 1){
			$scope.selectedQuantity=--$scope.selectedQuantity;
		}else {
			$scope.selectedQuantity=LOWEST_QTY;
			$rootScope.itemInBag =0;
		}
		calculatePrice();
		checkBudgetPay(auctionList);
	};
	
	$scope.saveUserName = function(username) {
		$scope.username =username;
		$rootScope.login_user_name = username;
	};
	
	function checkDefaultChoice(){
		$scope.alertErrorOption ="";
		$scope.choiceError="";
		if($scope.inStock == 0){
			$scope.maxlimiterror="Stock not available" ;
			return false;
		}
			if($scope.selectedOption == DEFAULT_CHOICE){
						$scope.alertErrorOption ="alert-choice";
						$scope.choiceError=BLANK_FIELD;
						showRequiredEror(1,REQUIRED_ERROR);
				return false;
			}
			return true;
	}
	function orderReserve(isForFastBuy){
		ItemCartList.clearCartList();
		var isBuyAll=false;
		$scope.alertErrorInput ="";
		$scope.alertErrorQty ="";
		$scope.inputError = "";
		if (isUserLoggedIn) {
			if (!isActive) {
				reserveOrderAll(false,isForFastBuy,isBuyAll);
				$state.go('home.blocked');
			} else if (!isEligible) {
				reserveOrderAll(false,isForFastBuy,isBuyAll);
				$state.go('home.eligible');
			}else{
				reserveOrderAll(true,isForFastBuy,isBuyAll);		
				}
		} else{
			if(ISLC)
			var error = checkLoginCredentials($scope.username);
			else
			var error = checkHomeCred($scope.username);
				if(error !== true ){
					$scope.alertErrorInput ="alert";
					if (!$scope.username) {
						showRequiredEror(0,REQUIRED_ERROR);
						$scope.inputError =BLANK_FIELD;
					}else{
						showRequiredEror(0,INVALID_ERROR);
						$scope.inputError =INVALID;
					}
				}else{
					if(checkDefaultChoice()){
					if(selectedAuction.size == "BUY ALL"){
						isBuyAll=true;
						var cartAvailableAuctions = auctionList.availableAuctions.filter(function(auction){
							return auction.stockCode != "-9999";
						});
						angular.forEach(cartAvailableAuctions,function(auction){
							ItemCartList.set(auction.auctionCode,auction);
							ItemCartList.setQty(auction.auctionCode,$scope.selectedQuantity);
							ItemCartList.setPrice(auction.auctionCode,auctionList.currentPrice);
						});
					}else{
					isBuyAll=false;
					ItemCartList.set(selectedAuction.auctionCode,selectedAuction);
					ItemCartList.setPrice(selectedAuction.auctionCode,auctionList.currentPrice);
					ItemCartList.setQty(selectedAuction.auctionCode,$scope.selectedQuantity);
					}
					reserveOrder($rootScope.login_user_name,isBuyAll,isForFastBuy,isUserLoggedIn);

					}
				}
		}
	}
	function reserveOrderAll(isEligible,isForFastBuy,isBuyAll){
		if(checkDefaultChoice()){
			if(selectedAuction.size == "BUY ALL"){
				GAHelper.sendEvent("Order Now","Reserve","Single");
				isBuyAll=true;
				var cartAvailableAuctions = auctionList.availableAuctions.filter(function(auction){
					return auction.stockCode != "-9999";
				});
				angular.forEach(cartAvailableAuctions,function(auction){
					ItemCartList.set(auction.auctionCode,auction);
					ItemCartList.setQty(auction.auctionCode,$scope.selectedQuantity);
					ItemCartList.setPrice(auction.auctionCode,auctionList.currentPrice);
				});
			}else{
			GAHelper.sendEvent("Order Now","Reserve","Multiple");
			isBuyAll=false;
			ItemCartList.set(selectedAuction.auctionCode,selectedAuction);
			ItemCartList.setPrice(selectedAuction.auctionCode,auctionList.currentPrice);
			ItemCartList.setQty(selectedAuction.auctionCode,$scope.selectedQuantity);
			}
			reserveOrder(null,isBuyAll,isForFastBuy,isUserLoggedIn,isEligible);
			}		
	}
	function showRequiredEror(index,error){
		var message ='Please enter the '+ error +' information (*/Red highlighted) for placing the order'
		var params ={'message':message,'buttonText':'OK'};
		popupService.showErrorDialog(params,function(){
				focusService.changeCurrentFocus("product",index);
		});
		return;
	}
	
	function reserveOrder(inputFieldValue,isBuyAll,isForFastBuy,isLoddedIn,isEligible){
		angular.forEach(ItemCartList.getAllCartList(),function(reserveItem){
			ItemCartList.setBidderId(reserveItem.auctionCode,0);
		});
		if(Network.isConnected()){
		popupService.showLoader();
		// User profile api hit
		ApiHelper.reserveOrder(httpservice,inputFieldValue,isBuyAll,function(responseData){
// console.log("RESEPONSE",responseData);
			if(responseData && responseData.items && (responseData.items.length > 0)  && responseData.items[0].bidderId ==0){
				popupService.hideLoader();
				var params ={'message':'Order can not be reserved','buttonText':'OK'};
				popupService.showErrorDialog(params);
			}else{
				$rootScope.cartEmpty ="";
				reserveOrderDetails.saveOrderDetails(responseData.items);
				updateItemCart(ItemCartList.getAllCartList(),responseData.items);
				var itemList  = ItemCartList.getRequest();
				$rootScope.itemInBag =itemList.length;
					// fetch price API
				if(isLoddedIn){
					if(isEligible){
					ApiHelper.userProfile(httpservice,loginUserDetails.userId(),
							function(responseData){
							ApiHelper.saveUserProfileData(responseData);
							ApiHelper.fetchPrice(httpservice, false,null,null,function(successResponse){
								popupService.hideLoader();
								fetchPriceResult.saveDetails(successResponse);
								if (isForFastBuy) {
									clearInterval(auctionInterval);	
									popupService.showFastBuyConfirmDialog(function(confirm){
										if (!confirm) {
											startAuction();
											clearItemInBag();
										}
									});
								}else{
										if(isEligible)
										$state.go('order.address');	
								}
							}, function(errorResponse){
								popupService.hideLoader();
								if (errorResponse.error  && errorResponse.error.message) {
									var params ={'message':errorResponse.error.message,'buttonText':'OK'};
									popupService.showErrorDialog(params);
								}
							});
							
						},function(errorResponse){
							popupService.hideLoader();
							var params ={'message':errorResponse.error.message,'buttonText':'OK'};
							popupService.showErrorDialog(params);
						});
				}}else{
					popupService.hideLoader();
					$rootScope.showLoginDialog=true;
					$rootScope.disableHeaderLogin=true;
					$rootScope.loginDisable ="login-disable";
					$state.go('home.login');
				}
			}
			},function(errorResponse){
					popupService.hideLoader();
					var params ={'message':errorResponse.error.message,'buttonText':'OK'};
					popupService.showErrorDialog(params);
		},false);
		}else{
			popupService.showNetworkError();
		}
	}
	
	
	
	$rootScope.orderNow = function() {
		orderReserve(false);
	};
	
	
	$rootScope.fastBuy = function() {
		if (isUserLoggedIn) {
			if (isEligible) {
				var isEnable =loginUserDetails.getFastBuy();
				if (isEnable=="true") {
					orderReserve(true);
				}else{
						ApiHelper.userProfile(httpservice,loginUserDetails.userId(),
								function(responseData){
								ApiHelper.saveUserProfileData(responseData);
								$state.go('profile.myprofile'); 
							},function(errorResponse){
								var params ={'message':errorResponse.error.message,'buttonText':'OK'};
								popupService.showErrorDialog(params);
							},true);
				}
			}else{
				$state.go('profile.myprofile');
			}
		}else{
			// $state.go('home.login');
		}
		
	};
	
	$scope.opneKeyBoard = function() {
		focusService.elementClickhandling();
	};
	
	$scope.showBudgetPayInfo = function() {
		popupService.showBudgetPay();
	};
	
	$scope.selectChoice = function(){
			var availableAuctions = auctionList.availableAuctions.filter(function(auction) {
			return ((auction.stockRemaining > 0) || (auction.auctionCode == "-9999"));
			});
		if(availableAuctions.length > 0){
		popupService.showChoiceSelectionDialog({
			title : DEFAULT_CHOICE,
			data  : availableAuctions,
			class : "shipping-title",
			defaultKey : $scope.selectedOption,
		},function(updatedData){
			if (updatedData) {
				$scope.alertErrorOption ="";
				selectedAuction = updatedData;
				$scope.selectedOption = selectedAuction.size;
				$scope.maxlimiterror="" ;
				if(auctionList.isBuyAll && selectedAuction.auctionCode=="-9999"){
					changeSelectedChoice(selectedAuction,true);
				}else{
					// refreshData(selectedAuction);
					changeSelectedChoice(selectedAuction,false);
				}
			}
		});
		}else{
			$scope.maxlimiterror="No Stock Available";
		}
	};
	
	function setAuctionData(auctionList){
		var availableAuctions = auctionList.availableAuctions;		
		angular.forEach(availableAuctions,function(auction){
			if(auction.auctionCode == "-9999"){
				auction.size="BUY ALL";
			}else if(selectedAuction && auction.auctionCode == selectedAuction.auctionCode){
				selectedAuction.stockRemaining = auction.stockRemaining;
			}
		});	
		
		switch (auctionList.groupAuctionType) {
		case 0:
				$scope.hideSelection = {
					'visibility' : 'hidden'
				}
				$scope.showSelection = false;
				break;
		case 1:
			$scope.hideSelection = {
				'visibility' : 'visible',
				'display' : 'block !important'
			}
			$scope.showSelection = true;
			break;
		case 2:
			$scope.hideSelection = {
				'visibility' : 'visible',
				'display' : 'block !important'
			}
			$scope.showSelection = true;
			break;
			}
		
		if(currentAuctionId != auctionList.auctionCode){
		currentAuctionId = auctionList.auctionCode;
		switch (auctionList.groupAuctionType) {
		case 0:
				$scope.hideSelection = {
					'visibility' : 'hidden'
				}
				$scope.showSelection = false;
				selectedAuction = auctionList;
				$scope.selectedOption="";
				break;
		case 1:
			$scope.hideSelection = {
				'visibility' : 'visible'
			}
			$scope.showSelection = true;
			$scope.selectedOption=DEFAULT_CHOICE;
// selectedAuction = availableAuctions[0];
			break;
		case 2:
			$scope.hideSelection = {
				'visibility' : 'visible'
			}
			$scope.showSelection = true;
			$scope.selectedOption=DEFAULT_CHOICE;
// selectedAuction = availableAuctions[0];
			break;
			}
			bindData(auctionList);
		}else{
			refreshData(auctionList);
		}
		
		// check for TJC
		if (!ISLC) {
			highEndChecking(auctionList);
		}
	}
	// HighEndAuction checking
	function highEndChecking(auctionList){
		if (auctionList) {
			preOrderChecking(auctionList);
			$rootScope.showHighEndAuction = auctionList.isHighEndAuction;
			if (auctionList.isHighEndAuction) {
				$rootScope.orderButtonSyle={'visibility': 'hidden'};
				$rootScope.itemInBagStyle={'visibility': 'hidden'};
				$rootScope.showOrderButton=false;
				$rootScope.showPrice = false;
				$scope.showPreOrder =false;
				
			}else{
				$rootScope.orderButtonSyle={'visibility': 'visible'};
				$rootScope.itemInBagStyle={'visibility': 'visible'};
				$rootScope.showOrderButton=true;
				$rootScope.showPrice = true;
			}
		}else{
			$rootScope.showHighEndAuction =false;
			$rootScope.orderButtonSyle={'visibility': 'visible'};
			$rootScope.itemInBagStyle={'visibility': 'visible'};
			$rootScope.showOrderButton=true;
			$scope.showPreOrder =false;
		}
	}
	// PreorderItem checking
	function preOrderChecking(auctionList){
		$rootScope.showPreOrder =auctionList.isPreorderItem;
		if (auctionList.isPreorderItem) {
			// PreorderItem Text show
			$rootScope.expexctedDate =auctionList.expectedDeliveryDate;
		}else{
			// PreorderItem Text hide
			$rootScope.expexctedDate="";
		}
	}
	
	function checkBudgetPay(auction){
		var isBudgetPayAvailable = true;
		if(isUserLoggedIn)
		var isBudgetPayAvailable = loginUserDetails.getBudgetPay();
		if(auction.offerBudgetPay && isBudgetPayAvailable){
			$scope.isBudgetAvailable=true;
			$scope.budgetPay = {
					'visibility' : 'visible'
				}
			var numberOfEmi=auction.numberOfEmi;
			var offerBudgetPay=auction.offerBudgetPay;
			var availableAuctions = auction.availableAuctions;
				// show Budgetpay UI
				var currentPrice;
				if(selectedAuction){
				if(selectedAuction.size == "BUY ALL"){
					currentPrice = (auction.currentPrice*$scope.selectedQuantity)*(availableAuctions.length-1);
				}else{
					currentPrice = auction.currentPrice*$scope.selectedQuantity;
				}
				}else{
					currentPrice = (auction.currentPrice*$scope.selectedQuantity);
				}
				$scope.noOfEmi=numberOfEmi;
				$scope.budgetPrice= CURRENCY+ parseCurreny((currentPrice)/numberOfEmi);
				$scope.isBudgetAvailable=true;
		}else{
			$scope.isBudgetAvailable=false;
			$scope.budgetPay = {
					'visibility' : 'hidden'
				};
		}

	};
	
	
	function bindData(auctionList){
		checkBudgetPay(auctionList);
		
		if(auctionList.groupAuctionType == 0)
		focusService.changeCurrentFocus("product",3);
		
		var price="";
		price = splitPrice(auctionList.currentPrice);
		$scope.inStock =auctionList.stockRemaining;
		$scope.limit = $scope.inStock;
		var startPrice = splitPrice(auctionList.startPrice);
		$scope.startPrice =startPrice[0]+ startPrice[1];
		$scope.stockCode = auctionList.stockCode;
		$rootScope.dollerAmount = price[0];
		$rootScope.centAmount = price[1];
		$scope.dollerPrice = price[0];
		$scope.centPrice = price[1];
		$scope.productDescription = auctionList.stockDescription;
		$scope.productImage = createImageUrl($scope.stockCode);
	}
	
	function refreshData(auctionList){
		var totalPrice;
		var inStock;
		var stockCode;
		var productDescription;
		var availableAuctions;
		
		if(auctionList.availableAuctions.length > 0)
			availableAuctions = auctionList.availableAuctions;

		if(!availableAuctions){
			 totalPrice = auctionList.currentPrice * $scope.selectedQuantity;
			 inStock  = auctionList.stockRemaining;
			 stockCode = auctionList.stockCode;
			 productDescription = auctionList.stockDescription;
		}else{
			if($scope.selectedOption == DEFAULT_CHOICE){
				 totalPrice = auctionList.currentPrice * $scope.selectedQuantity;
				 inStock =auctionList.stockRemaining;
				 stockCode = auctionList.stockCode;
				 productDescription = auctionList.stockDescription;
			}else{
			angular.forEach(availableAuctions,function(auction){
			if(auction.auctionCode == selectedAuction.auctionCode){
				$scope.selectedOption = selectedAuction.size;
				if($scope.selectedOption == "BUY ALL"){
					 totalPrice = auctionList.currentPrice * $scope.selectedQuantity *(availableAuctions.length-1);
					 inStock =auctionList.stockRemaining;
					 stockCode = auctionList.stockCode;
					 productDescription = auctionList.stockDescription;
				}else{
					 totalPrice = auctionList.currentPrice * $scope.selectedQuantity;
					 inStock  =selectedAuction.stockRemaining;
					 stockCode = selectedAuction.stockCode;
					 productDescription = selectedAuction.stockDescription;
				}
			}
			});
			}
		}
		setData(totalPrice,inStock,stockCode,productDescription);
		checkBudgetPay(auctionList);
	}
	function changeSelectedChoice(selectedAuction,isBuyAll){
		$scope.selectedOption = selectedAuction.size;
		var totalPrice;
		var inStock;
		var startPrice = splitPrice(auctionList.startPrice);
		var currentPrice = splitPrice(auctionList.currentPrice);
		var stockCode;
		var productDescription;
		if(isBuyAll){
			totalPrice= auctionList.currentPrice * $scope.selectedQuantity * (auctionList.availableAuctions.length-1);
			inStock = auctionList.stockRemaining;
			stockCode = auctionList.stockCode;
			productDescription = auctionList.stockDescription;
		}else{
			totalPrice= auctionList.currentPrice * $scope.selectedQuantity;
			inStock = selectedAuction.stockRemaining;
			stockCode = selectedAuction.stockCode;
			productDescription = selectedAuction.stockDescription;
		}
		setData(totalPrice,inStock,stockCode,productDescription);
		checkBudgetPay(auctionList);
	}
	
	function setConfigData(config){
		$scope.limit = config.maximumItemQty;
		configMaxLimit = config.maximumItemQty;
	}
	
	function updateItemCart(itemCart,reserveResponseItems){
			angular.forEach(reserveResponseItems,function(reserveItem){
				ItemCartList.setBidderId(reserveItem.auctionCode,reserveItem.bidderId);
				ItemCartList.setPrice(reserveItem.auctionCode,auctionList.currentPrice);
		});
	}
	
	 $scope.$on("$destroy", function () {
	     // Unbind angular event listeners
			clearInterval(auctionInterval);	
	   });
	 
	 function loadAuction(){
			if (Network.isConnected()) {
				ApiHelper.fetchAuction(httpservice,function(successResponse){
					auctionDetails.saveAuctions(successResponse);
					auctionList = auctionDetails.getAuctionDetails();
				 	checkBudgetPay(auctionList);
					setAuctionData(auctionList);
				},function(responseData){
						var errorMessage=ApiHelper.errorHandling(responseData);
						$state.go('home.noauction',{auctionError:errorMessage});
				});
			}else{
				// No Internet connection exit dialog application.
			}
	 }
	 
	 function setData(totalPrice,stockRemaining,stockCode,productDescription){
			var price = splitPrice(totalPrice);
			$scope.inStock =stockRemaining;
			$scope.limit = $scope.inStock;
			var startPrice = splitPrice(auctionList.startPrice);
			$scope.startPrice =startPrice[0]+ startPrice[1];
			$scope.stockCode = stockCode;
			$rootScope.dollerAmount = price[0];
			$rootScope.centAmount = price[1];
			var currentPrice = splitPrice(auctionList.currentPrice);
			$scope.dollerPrice = currentPrice[0];
			$scope.centPrice = currentPrice[1];
			$scope.productDescription = productDescription;
			$scope.productImage = createImageUrl($scope.stockCode);
			
	 }
} ])