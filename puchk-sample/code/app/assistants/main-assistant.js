function MainAssistant() {}

MainAssistant.prototype.sts = function(txt) {
	$('status').innerHTML = txt;
};
MainAssistant.prototype.setup = function() {

	// use puchk update checking framework (http://www.jdf-software.com/puchk)
	// check only once every minute (0.017 hours)
	var update = new puchk(0.017, this);
	update.check();

};
MainAssistant.prototype.activate = function(event) {
};

MainAssistant.prototype.deactivate = function(event) {
};

MainAssistant.prototype.cleanup = function(event) {
};



/*********************************************************************************************/


