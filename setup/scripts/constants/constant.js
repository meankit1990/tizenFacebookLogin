const
DEBUG = false;
const
// BASE_PATH_OF_ROUTING = "./appLauncher/app/LC";
BASE_PATH_OF_ROUTING = "";
var isTv = true;
if (BASE_PATH_OF_ROUTING) {
	isTv = false
}
const
IS_TV = isTv;

const
SPLASH_TIME = 3000;

const
POLLING_TIME = 5000;
// Key for URL encryption
const
SHARED_SECRET = "x58gBlWvSfGICPbA0K77hg";

const
CONFIG = BASE_URL + "config";
const
TERMS_CONDITIONS = BASE_URL + "termsandconditions";
const
LOGIN = BASE_URL + "login";
const
REGISTRATION = BASE_URL + "registration";
const
PROFILE = BASE_URL + "profile";
const
USER_PROFILE = PROFILE + "?userId=";
const
FASTBUY_ENABLE_DISABLE = BASE_URL + "enableDisableFastbuy";
const
FETCH_AUCTION = BASE_URL + "fetchauction";
const
RESERVE_ORDER = BASE_URL + "reserveorder";
const
RELEASE_ORDER = BASE_URL + "releaseOrder";
const
FETCH_PRICE = BASE_URL + "priceDetail";
const
PLACE_ORDER = BASE_URL + "placeOrder";
const
FORGOT_PASSWORD = BASE_URL + "forgotPassword";
const
PROGRAMME_GUIDE = BASE_URL + "guide?timezone=utc";

const
EMPTY = "";
const
LOWEST_QTY = 1;
const
PIN = "pin";
const
SELECT_OPTION = "Select option";

const
REQUIRED_ERROR = "required";
const
INVALID_ERROR = "valid";

// Fast buy Messages
const
FASTBUY_UNREGISTERED = "Login and opt for fast buy to enable 1- click ordering";
const
FASTBUY_DISABLE = "Visit user profile page and opt for fast buy to enable 1-click ordering";

const
FASTBUY_INCOMPLETE = FASTBUY_DISABLE;

const
FASTBUY_INCOMPLETE_ADDRESS = "Please update your payment and address details to enable fast buy. Call customer care at 1-877-899-0078";

// Dialog Type
var PopUpMODE = {
	NONE : 0,
	LOADER : 1,
	ERROR : 2,
	SELECTION : 3,
	INFO : 4,
	AUTOCLOSE : 5,
	NETWORKERROR : 6
};

// BackHandling to show the popup.
var POPUPTYPE = {
	OPTION : 0,
	PROFILE : 1
};

// Selection Dialog
var DEFAUTL_DETAILS_TYPE = {
	SHIPPING_ADDRESS : "shippingAddress",
	BILLING_ADDRESS : "billingAddress",
	SHIPPING_METHOD : "shippingMethod",
	APPLIED_COUPON_CODE : "couponCode",
	APPLIED_CREDIT : "storeCredit",
	CARD_INDEX : "cardIndex",
	BUDGET_PAY_SELECTED : "budgetPaySelected"
};

// ERROR MESSAGE
const
NO_INTERNET_CONNECTION = "Oops! There is no network connection";

// Api Error
const
COMMON_API_ERROR = "Something went wrong, Please Try again later";
const
TIMEOUT_ERROR = "There seems to be some technical issue. Please try again.";
