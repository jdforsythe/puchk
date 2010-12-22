puchk
Palm (webOS) Update Check Framework
v1.0.1
JDF Software
http://www.jdf-software.com/puchk
jdfsoftware@gmail.com

Please e-mail me if you are using puchk in your app!

=============================

Description:

puchk is a framework for displaying update notifications to users of your webOS apps. It is intended for developers of webOS SDK (and possibly hybrid SDK/PDK) apps. The framework checks the version installed on the user's device against the most recent version, parsed from your app details page on Palm's web server. If there is a newer version available, the app will display a scene with your notification text and buttons to allow the user to update (by bringing up the Palm App Catalog to your app's detail page) or continue using the currently-installed version of the app.

The framework has been updated to check for the update asynchronously, and therefore not interrupt your app.
It has also become extremely easy to plug into your new or existing applications.

=========
Changelog
=========
1.0.1
- simplified some code for speed improvements
- fixed a typo in the alert dialog localization keys
1.0.0:
- ease of use improvements
- added "dismiss forever" functionality

0.6.1:
- fixes the install failure issue by closing the app after the App Catalog has launched

0.6.0:
- better localization including:
  - workaround for webOS bug that fails to localize app titles via Mojo.Controller.appInfo.title
  - using keys for localization strings

0.5.1:
- Ares sample app and framework code

0.5.0:
- further fixes string localization
- using RegExp to parse the web site instead of simple string searches (in case you use the text "Version:" in your app description)
- added functionality to only check after minimum number of hours
- renamed all the functions to begin with puchk to prevent interference with your apps

=====
USAGE
=====

There is now only one file you need worry about in the puchk framework, puchk.js

1) include the file in index.html (or alternatively, sources.json)
<script type="text/javascript" src="puchk.js"></script>

2) in your first scene's setup() method:
var update = new puchk(hours, this);
update.check();

where "hours" is the MINIMUM number of hours between update checks, and "this" is just "this"

That's it! puchk update checking is now enabled in your app! Check it out!


=====================================
TESTING PUCHK IN YOUR APP
=====================================

There are a couple different methods to test the framework in your app, depending on whether your app is already published.

If your app is already published - you cannot submit an app with a lower version number to Palm for publishing, but there's nothing that says you can't test the updated app with a lower version number in the emulator or on your own device. So lower the version number in appinfo.json for testing, to ensure that the update scene is pushed properly. Be sure to change the version number back before trying to publish! Or you can do as the sample app does and in puchk.js, in this.isNewer(), you can explicitly set the current version for testing, instead of reading it from appinfo.json.

If your app is new and hasn't been published, you can simply edit the var url="" under doUpdateCheck() to use an app id from an existing published app that has a higher version number. Pick any app you want and put the id in the line like this:

Previous line of code:
	var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;

New line of code:
	var url = "http://developer.palm.com/webChannel/index.php?packageid=com.jdfsoftware.tuneyourguitarpro";
	(Hint: Tune Your Guitar Pro is currently at v1.0.1 as of May 28, 2010)

This will fool puchk into getting the version for the other app with a higher version number for your testing purposes. Be sure to change the code back before publishing!
