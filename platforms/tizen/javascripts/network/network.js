var Network = {
	cType : null,
	contype : null,
	connected : true
};
Network.init = function() {
	Network.UpdateConnectionType(undefined);
	webapis.network.addNetworkStateChangeListener(function(connectionType) {
		Network.UpdateConnectionType(connectionType);
	});
};
Network.UpdateConnectionType = function(connectionType) {
	if (connectionType) {
		Network.cType = connectionType;
	} else {
		Network.cType = webapis.network.getActiveConnectionType();
	}
	switch (Network.cType) {
	case 0:
	case 5:
		Network.contype = "DISCONNECTED";
		Network.connected = false;
		break;
	case 1:
		Network.contype = "WIFI";
		Network.connected = true;
		break;
	case 2:
		Network.contype = "CELLULAR";
		Network.connected = true;
		break;
	case 3:
		Network.contype = "ETHERNET";
		Network.connected = true;
		break;
	case 4:
		Network.contype = "RECONNECTED";
		Network.connected = true;
		break;

	default:
		Network.contype = "Unknown";
		Network.connected = false;
		break;
	}
};

Network.isConnected = function() {
	if (IS_TV) {
		return Network.connected;
	} else {
		return true;
	}
};