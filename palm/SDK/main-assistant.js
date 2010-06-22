function MainAssistant() {}

MainAssistant.prototype.setup = function() {
	/* Usage:
	 * this.puchkDoUpdateCheck(interval);
	 * where interval is the minimum number of hours between update checks
	 */
	this.puchkDoUpdateCheck(24);

	// for testing you can use:
	// 30 seconds:
	// this.puchkDoUpdateCheck(0.0083);
	// 1 minute:
	// this.puchkDoUpdateCheck(0.0167);
	// 5 minutes:
	// this.puchkDoUpdateCheck(0.083);
	// etc.
};

MainAssistant.prototype.puchkDoUpdateCheck = function(interval) {

	this.puchkInterval = interval;

	// reference to the cookie, if it exists
	this.puchkCookieRef = new Mojo.Model.Cookie(Mojo.Controller.appInfo.title + "_puchk");

	// get the cookie
	this.puchkCookie = this.puchkCookieRef.get();

	// if there's no cookie, then this is the first run, or the interval has expired
	// because the cookie expires after the given amount of time
	if (!this.puchkCookie) {
	
		// URL to your app details page on Palm's web site
		var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;
	
		// do AJAX request
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'false',
			onSuccess: this.puchkGotResults.bind(this), // if you get results, check to see if there's an update
			// we're only concerned with success
		});
	}

	// else if the cookie exists, do nothing since the interval hasn't expired
	
}

MainAssistant.prototype.puchkGotResults = function(transport) {

	// if we have success in the AJAX request, then we have an actual check occurring and we can
	// set a cookie

	// expire is now + (interval(hours) * 3600000 milliseconds per hour)
	var expire = new Date();
	expire.setTime(expire.getTime()+(this.puchkInterval*3600000));

	// set a new cookie to expire at interval hours from now
	this.puchkCookieRef.put({},expire);
	
	// the entire HTML source of the Palm app details web page into a string	
	var HTMLStr = transport.responseText;
	
	// regular expression that looks for a string of the form "Version: #.#.#<br/>" in the web page
	// and returns only the "Version: #.#.#" part (JavaScript supports lookaheads but not lookbehinds)
	var patt = /Version:\s[0-9\.]+(?=<br\/>)/;

	// use the pattern to get the match from the web page
	var toSlice = HTMLStr.match(patt).toString();

	// JavaScript doesn't support lookbehinds, so we need to slice "Version: " (9 chars) from the beginning of the string
	// leaving us with a nice "#.#.#"
	var version = toSlice.slice(9);
		
	// if the returned version is greater than the current version
	if (this.puchkVerComp(version)) {

		var appData = {
				title: $L(Mojo.Controller.appInfo.title),
				version: version
				};
				
		// show update dialog
		this.controller.showAlertDialog({                            
            		onChoose: function(value) {                                         
                		if (value === "update") {                                      
                			this.puchkLaunchUpdate();
					window.close();                            
                		}                                                           
            		},                                                                  
            		title: $L({value: "Update Available", key: "puchk_dialog_title"}),                                 
			message: $L({value: "#{title} v#{version} is available. Would you like to update?", key: "puchk_dialog_message"}).interpolate(appData),
            		choices: [                                                          
            			{ label: $L({value: "Download Update", key: "puchk_download_label"}), value: "update", type: "affirmative" },
            			{ label: $L({value: "Cancel", key: "puchk_cancel_label"}), value: "cancel", type: "negative" }      
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
