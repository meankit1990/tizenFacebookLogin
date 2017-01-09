var ApiHelper = {};

// This method executed when http status is 200 then check the status code of
// response to decide the success or failure.
ApiHelper.successResponseHandling = function(successResponse, successCallback,
		failureCallback) {
	if (successResponse) {
		successCallback(successResponse);
	} else {
		// error response find error message at status ==-1
		if (failureCallback) {
			failureCallback(successResponse);
		}
	}
};

// This method is executed when http status is not 200.
ApiHelper.failureResponseHandling = function(failResponse, failureCallback) {
	if (failureCallback) {
		failureCallback(failResponse);
	}
};

ApiHelper.createCode = function(httpservice, successCallback, failureCallback) {
	var params = {
		"access_token" : APP_ID + "|" + CLIENT_TOKEN,
		"scope" : "public_profile,email"
	};
	httpservice.post(CREATE_CODE, angular.toJson(params), false).then(
			function(successResponse) {
				ApiHelper.successResponseHandling(successResponse,
						successCallback, failureCallback);
			},
			function(errorResponse) {
				ApiHelper.failureResponseHandling(errorResponse,
						failureCallback);
			});
};

ApiHelper.verify = function(httpservice, successCallback, failureCallback, code) {
	var params = {
		"access_token" : APP_ID + "|" + CLIENT_TOKEN,
		"code" : code
	};
	httpservice.post(VERIFY_LOGIN, angular.toJson(params), false).then(
			function(successResponse) {
				ApiHelper.successResponseHandling(successResponse,
						successCallback, failureCallback);
			},
			function(errorResponse) {
				ApiHelper.failureResponseHandling(errorResponse,
						failureCallback);
			});
};
ApiHelper.getUserDetails = function(httpservice, successCallback,
		failureCallback, accessToken) {
	httpservice.get(GET_USER_DATA + accessToken, false).then(
			function(successResponse) {
				console.log(angular.toJson(successResponse));
				ApiHelper.successResponseHandling(successResponse,
						successCallback, failureCallback);
			},
			function(errorResponse) {
				ApiHelper.failureResponseHandling(errorResponse,
						failureCallback);
			});
};
