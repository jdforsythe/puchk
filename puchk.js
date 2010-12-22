/******************************
 *
 * puchk - Palm update check
 * v1.0.1
 * December 2, 2010
 *
 * http://www.jdf-software.com/puchk
 *
 * usage:
 *
 * var update = new puchk(hours, this);
 * update.check();
 *
 * where "hours" is the minimum number of hours between updates
 * and "this" is actually just the word "this"
 *
 ******************************/

function puchk(interval, parent) {

	this.interval = interval;
	this.cont = parent.controller;

	// Mojo.Log.info("puchk: Interval = " + this.interval);

	// since last check cookie
	this.cookie = new Mojo.Model.Cookie(Mojo.Controller.appInfo.title + "_puchk");


/****************************************************
	// reset cookie every time - turn this on for testing (it will cause the app to ignore the interval)
	var expire = new Date();
	expire.setTime(expire.getTime() - 100000);
	this.cookie.remove();
/****************************************************/

	this.cookieData = this.cookie.get();


	/* methods ***************************************/
	this.check = function() {

		// Mojo.Log.info("puchk: Beginning puchk update check...");

		// if there's no cookie, then this is the first run, or the interval has expired
		if (!this.cookieData) {

			// Mojo.Log.info("puchk: interval has expired, checking for update...");
	
			// URL to your app details page on Palm's web site
			var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;
	
			// do AJAX request
			var request = new Ajax.Request(url, {
				method: 'get',
				evalJSON: 'false',
				onSuccess: this.results.bind(this) // if you get results, check to see if there's an update
				// we're only concerned with success
			});
		}

		// else if the cookie exists, do nothing
		else {
			// Mojo.Log.info("puchk: Too soon to check for updates (or user dismissed forever)");
		}
	
	};

	this.results = function(transport) {

		// Mojo.Log.info("puchk: Got data from Palm's site...");

		// expire is now + (interval(hours) * 3600000 milliseconds per hour)
		var expire = new Date();
		expire.setTime(expire.getTime()+(this.interval*3600000));

		// Mojo.Log.info("puchk: Setting cookie...");

		// set a new cookie to expire at interval hours from now
		// cookie doesn't need any data in it
		this.cookie.put({},expire);

		// Mojo.Log.info("puchk: Cookie set; parsing version number from Palm data...");
	
		// the entire HTML source of the Palm app details web page into a string	
		var HTMLStr = transport.responseText;
	
		// regular expression that looks for a string of the form "Version: #.#.#<br/>" in the web page
		// and returns only the "Version: #.#.#" part (JavaScript supports lookaheads but not lookbehinds)
		var patt = /Version:\s[0-9\.]+(?=<br\/>)/;

		// use the pattern to get the match from the web page
		var toSlice = HTMLStr.match(patt).toString();

		// JavaScript doesn't support lookbehinds, so we need to slice "Version: " (9 chars) from the beginning of the string
		// leaving us with a nice "#.#.#"
		if (toSlice) {
			var version = toSlice.slice(9);

			// Mojo.Log.info("puchk: Got version number from Palm data, checking if it is newer..."); 

			// if the returned version is greater than the current version
			if (this.isNewer(version)) {

				// Mojo.Log.info("puchk: There is an update, displaying dialog...");

				var appData = {
						title: $L(Mojo.Controller.appInfo.title),
						version: version
						};

				try {

					// show update dialog
					this.cont.showAlertDialog({
					//Mojo.Controller.showAlertDialog({

					onChoose: function(value) {

						if (value === "update") {
									    
						this.updateApp();
						window.close(); // force app to close to prevent failed update installs
                        // use the next line instead of window.close() if you have a multi-stage app - thanks sidamos!
                        // Mojo.Controller.getAppController().closeAllStages();
						}

						else if (value === "never") {

						// write cookie that will "never" expire (10 years from today)
						var ex = new Date();
						ex.setTime(ex.getTime() + (315576000000)); // now plus 10 years in milliseconds

						// Mojo.Log.info("puchk: Setting forever cookie...");

						this.cookie = new Mojo.Model.Cookie(Mojo.Controller.appInfo.title + "_puchk");
						this.cookie.put({},ex);
						}
					},
										             
					title: $L({value: "Update Available", key: "puchk_dialog_title"}),

					message: $L({value: "#{title} v#{version} is available. Would you like to update?", key: "puchk_dialog_message"}).interpolate(appData),

					choices: [                                                          
					{ label: $L({value: "Download Update", key: "puchk_download_label"}), value: "update", type: "affirmative" },
					{ label: $L({value: "Never Ask Me Again", key: "puchk_never_label"}), value: "never", type: "negative" },
					{ label: $L({value: "Cancel", key: "puchk_cancel_label"}), value: "cancel", type: "dismiss" }
					]

					});

					// Mojo.Log.info("puchk: Showed update dialog...");

				}

				catch (e) {
					// Mojo.Log.error(e);
				}

			}
			
			// if there's no update, do nothing
			//else {
				// Mojo.Log.info("puchk: There is no update available.");
			//}

		}

		// if toSlice didn't exist, we probably got the error page from Palm, which means the site
		// is down for some reason, so don't bother checking for updates
		//else {
			// Mojo.Log.info("puchk: Palm's site data did not provide a version number. Cancelling update check.");
		//}

	};


	this.updateApp = function() {

		// Mojo.Log.info("puchk: Opening App Catalog for update...");

		// when the update button is tapped, send the user to the App Catalog for your app	
		var url = "http://developer.palm.com/appredirect/?packageid=" + Mojo.Controller.appInfo.id;

		this.controller.serviceRequest('palm://com.palm.applicationManager',
			{
			method:'open',
			parameters:{target: url}
			});
	};



	this.isNewer = function(v) {
		var upd = this.splitVer(v); // most up-to-date version, from the Palm app details page
		var cur = this.splitVer(Mojo.Controller.appInfo.version); // get current app version from appinfo.js
	
		// if the major, minor, or build part of the version (x.x.x) is greater than the current, there's an update
        // returns true if there's an update, false if not
        return upd.major > cur.major || (upd.major == cur.major && upd.minor > cur.minor) || (upd.major == cur.major && upd.minor == cur.minor && upd.build > cur.build);
	};

	this.splitVer = function(v) {

		// Mojo.Log.info("puchk: Parsing the version numbers...");
	
		var x = v.split('.');
	
		// get the integers (base 10) of the version parts, or 0 if it can't parse (i.e. 1.4.0 = 1, 4, 0) 
		var major = parseInt(x[0],10) || 0;
		var minor = parseInt(x[1],10) || 0;
		var build = parseInt(x[2],10) || 0;
		return {
			major: major,
			minor: minor,
			build: build
		};
	};
}
