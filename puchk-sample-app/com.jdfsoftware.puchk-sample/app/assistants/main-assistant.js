function MainAssistant() {}

MainAssistant.prototype.setup = function() {
	this.puchkDoUpdateCheck();
};

MainAssistant.prototype.puchkDoUpdateCheck = function() {
	// URL to the app details page for your app
	var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;
	
	// do AJAX request
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.puchkGotResults.bind(this), // if you get results, check to see if there's an update
		// we're only concerned with success
	});
	
}

MainAssistant.prototype.puchkGotResults = function(transport) {
	
	// the entire HTML source of the Palm app details web page into a string	
	var HTMLStr = transport.responseText;
	
	// look for Version: in the source and get the text between that and <br/>, this is the version string
	var start = HTMLStr.indexOf("Version: ");
	var end = HTMLStr.indexOf("<br/>", start);
	
	var version = HTMLStr.slice(start+9, end);	
		
	// if the returned version is greater than the current version
	if (this.puchkVerComp(version)) {
				
		// show update dialog
		this.controller.showAlertDialog({                            
            		onChoose: function(value) {                                         
                		if (value === "update") {                                      
                			this.puchkLaunchUpdate();                            
                		}                                                           
            		},                                                                  
            		title: $L("Update Available"),                                 
            		message: Mojo.Controller.appInfo.title + " v" + version + " " + $L("is available. Would you like to update?"),
            		choices: [                                                          
            			{ label: $L("Download Update"), value: "update", type: "affirmative" },
            			{ label: $L("Cancel"), value: "cancel", type: "negative" }      
            		]                                                                   
        	});          	
	}
			
	// if there's no update, do nothing
}

MainAssistant.prototype.puchkLaunchUpdate = function() {
	// when the update button is tapped, send the user to the App Catalog for your app	
	var url = "http://developer.palm.com/appredirect/?packageid=" + Mojo.Controller.appInfo.id;

	this.controller.serviceRequest('palm://com.palm.applicationManager',
		{
		method:'open',
		parameters:{target: url}
		});
}

MainAssistant.prototype.puchkVerComp = function(v) {
	
	var upd = this.puchkSplitVer(v); // most up-to-date version, from the Palm app details page
	var cur = this.puchkSplitVer(Mojo.Controller.appInfo.version); // get current app version from appinfo.js
	
	// upd can't be lower than cur or it wouldn't be published
	if (	(upd.major > cur.major) // this is a new major version
			|| ( (upd.major == cur.major) && (upd.minor > cur.minor) ) // this is a new minor version
			|| ( (upd.major == cur.major) && (upd.minor == cur.minor) && (upd.build > cur.build) ) // this is a new build version
		) { return true;}
	
	// otherwise, return false, that there isn't an update
	else { return false; }
}

MainAssistant.prototype.puchkSplitVer = function(v) {
	
	var x = v.split('.');
	
    // get the integers of the version parts, or 0 if it can't parse (i.e. 1.4.0 = 1, 4, 0) 
    var major = parseInt(x[0]) || 0;
    var minor = parseInt(x[1]) || 0;
    var build = parseInt(x[2]) || 0;
    return {
        major: major,
        minor: minor,
        build: build
    };
    	
}

MainAssistant.prototype.activate = function(event) {};

MainAssistant.prototype.deactivate = function(event) {};

MainAssistant.prototype.cleanup = function(event) {};
