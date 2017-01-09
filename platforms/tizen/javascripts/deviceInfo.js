var ProductInfo = {
//	model : null,
	uid : null,
/*	firmware : null,
	realModel : null,
	smartTvType : null,
	smartTvServerVersion : null,
	version : null*/
};
/*
ProductInfo.getDeviceInfo = function() {
	this.uid = webapis.productinfo.getDuid();
	this.firware = webapis.productinfo.getFirmware();
	this.model = webapis.productinfo.getModel();
	this.modelCode = webapis.productinfo.getModelCode();
	this.realModel = webapis.productinfo.getRealModel();
	this.smartTvType = webapis.productinfo.getSmartTVServerType();
	this.smartTvServerVersion = webapis.productinfo.getSmartTVServerVersion();
	this.version = webapis.productinfo.getVersion();
	return this;
};
*/
ProductInfo.getDeviceUUID = function() {
	return webapis.productinfo.getDuid();
}
ProductInfo.getDeviceType = function() {
	return "SmartTv";
}
ProductInfo.getDevice = function() {
	return "Tizen";
}

ProductInfo.getVersion = function() {
	return webapis.productinfo.getVersion();
}

