var GAHelper = {};
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js',
		'ga');
ga('create', GA_ID, 'auto');
ga('set', 'appName', APP_NAME);
ga('set', 'appVersion', APP_VERSION);
ga('set', 'checkProtocolTask', function() {
});

GAHelper.sendPageView = function(pageUrl, pageTitle) {
	ga('send', 'pageview', {
		page : pageUrl,
		title : pageTitle
	});
}

GAHelper.sendEvent = function(category, action, label) {
	ga('send', {
		hitType : 'event',
		eventCategory : category,
		eventAction : action,
		eventLabel : label
	});
}

GAHelper.sendScreenView = function(screenName) {
	ga('send', 'screenview', {
		'appName' : APP_NAME,
		'screenName' : screenName
	});
}