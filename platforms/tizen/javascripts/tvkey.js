tizen.tvinputdevice.registerKey("Exit");
var EXIT_KEY = 27;
if(IS_TV){
	EXIT_KEY = tizen.tvinputdevice.getKey("Exit").code;
}
var tvKey = {
	KEY_CANCEL_KEYBOARD : 65385,
	KEY_DONE_KEYBOARD : 65376,
	KEY_BACK : 8,
	KEY_RETURN : 10009,
	KEY_EXIT : EXIT_KEY,
	KEY_UP : 38,
	KEY_DOWN : 40,
	KEY_LEFT : 37,
	KEY_RIGHT : 39,
	KEY_ENTER : 13,
	KEY_5 : 53,
	KEY_7 : 55,

};
