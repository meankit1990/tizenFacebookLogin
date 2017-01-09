.directive('terms', [ '$state','focusService', function($state,focusService) {
	return {
		link : function(scope, element, attribute) {
			scope.$watch(attribute.tabindex, function() {
				if (attribute.tabindex == 0) {
					element.focus();
				}
			});
			var scrollValue = 50;
			var currentScrollValue = 0;

			var maxScroll = element[0].scrollHeight;
			element.on("keydown", function(event) {
				scope.$apply(function() {
					switch (event.keyCode) {
					case tvKey.KEY_DOWN:
						/*
						 * console.log("KEY DOWN EVENT",event.keyCode); if
						 * (currentScrollValue < maxScroll) { currentScrollValue +=
						 * scrollValue; if (currentScrollValue > maxScroll) {
						 * currentScrollValue = maxScroll; }
						 * element[0].scrollTop = currentScrollValue; }
						 */
						break;
					case tvKey.KEY_UP:
						/*
						 * if (currentScrollValue > 0) { currentScrollValue -=
						 * scrollValue; if (currentScrollValue < 0) {
						 * currentScrollValue = 0; } element[0].scrollTop =
						 * currentScrollValue; }
						 */
						break;
					case tvKey.KEY_ENTER:
						putData(TERMS_ACCEPTED, true);
						GAHelper.sendEvent("T&C", "Agree");
						$state.go('home.singleProduct');
						break;

					case tvKey.KEY_EXIT:
						focusService
								.keyBoardExit();
						break;
					case tvKey.KEY_RETURN:
						focusService
						.keyBoardExit();
						break;
					}
				});
			});
		}
	};
} ])
