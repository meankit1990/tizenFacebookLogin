const
BASE_PATH_OF_ROUTING = "";
var isTv = true;
if (BASE_PATH_OF_ROUTING) {
	isTv = false
}
const
IS_TV = isTv;
const
APP_ID = "1348530005191138";
const
CLIENT_TOKEN = "ffe8dcbe4a8559494c238bfe6a071695";
const
CREATE_CODE = "https://graph.facebook.com/v2.6/device/login";
const
VERIFY_LOGIN = "https://graph.facebook.com/v2.6/device/login_status";
const 
GET_USER_DATA = "https://graph.facebook.com/v2.6/me?fields=name,picture.type(large),email,gender&access_token=";
