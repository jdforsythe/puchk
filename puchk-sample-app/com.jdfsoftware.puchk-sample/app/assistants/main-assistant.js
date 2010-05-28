function MainAssistant() {}

MainAssistant.prototype.setup = function() {
<<<<<<< HEAD
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
=======
	/* Usage:
	 * this.puchkDoUpdateCheck(interval);
	 * where interval is the minimum number of hours between update checks
	 */
	this.puchkDoUpdateCheck(24);
};

MainAssistant.prototype.puchkDoUpdateCheck = function(interval) {

	this.interval = interval;

	// reference to the cookie, if it exists
	this.puchkCookieRef = new Mojo.Model.Cookie(Mojo.Controller.appInfo.title + "_puchk");

	// get the cookie
	this.puchkCookie = this.puchkCookieRef.get();

	// if there's no cookie, then this is the first run, or the interval has expired
	// because the cookie expires after the given amount of time
	if (!this.puchkCookie) {
	
		// using Tune Your Guitar Pro (at v1.0.1 at the time of this writing) to force the update scene
		var url = "http://developer.palm.com/webChannel/index.php?packageid=com.jdfsoftware.tuneyourguitarpro";
		// in your app, you would use the following:
		//var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;
	
		// do AJAX request
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'false',
			onSuccess: this.puchkGotResults.bind(this), // if you get results, check to see if there's an update
			// we're only concerned with success
		});
	}

	// else if the cookie exists, do nothing since the interval hasn't expired
>>>>>>> testing
	
}

MainAssistant.prototype.puchkGotResults = function(transport) {
<<<<<<< HEAD
=======

	// if we have success in the AJAX request, then we have an actual check occurring and we can
	// set a cookie

	// expire is now + (interval(hours) * 3600000 milliseconds per hour)
	var expire = new Date();
	expire.setTime(expire.getTime()+(this.interval*3600000));

	// set a new cookie to expire at interval hours from now
	this.puchkCookieRef.put({},expire);
>>>>>>> testing
	
	// the entire HTML source of the Palm app details web page into a string	
	var HTMLStr = transport.responseText;
	
	// look for Version: in the source and get the text between that and <br/>, this is the version string
	var start = HTMLStr.indexOf("Version: ");
	var end = HTMLStr.indexOf("<br/>", start);
	
	var version = HTMLStr.slice(start+9, end);	
		
	// if the returned version is greater than the current version
	if (this.puchkVerComp(version)) {
<<<<<<< HEAD
=======

		var appData = {
				title: Mojo.Controller.appInfo.title,
				version: version
				};
>>>>>>> testing
				
		// show update dialog
		this.controller.showAlertDialog({                            
            		onChoose: function(value) {                                         
                		if (value === "update") {                                      
                			this.puchkLaunchUpdate();                            
                		}                                                           
            		},                                                                  
            		title: $L("Update Available"),                                 
<<<<<<< HEAD
            		message: Mojo.Controller.appInfo.title + " v" + version + " " + $L("is available. Would you like to update?"),
=======
			message: $L("#{title} v#{version} is available. Would you like to update?").interpolate(appData),
>>>>>>> testing
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
