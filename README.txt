puchk
Palm (webOS) Update Check Framework
v0.6.0
JDF Software
http://www.jdf-software.com/
http://github.com/jdfsoftware/puchk
jdfsoftware@gmail.com

Please e-mail me if you are using puchk in your app so I can link to it from the puchk web page!

=============================

Description:

puchk is a framework for displaying update notifications to users of your webOS apps. It is intended for developers of webOS SDK (and possibly hybrid SDK/PDK) apps. The framework checks the version installed on the user's device against the most recent version, parsed from your app details page on Palm's web server. If there is a newer version available, the app will display a scene with your notification text and buttons to allow the user to update (by bringing up the Palm App Catalog to your app's detail page) or continue using the currently-installed version of the app.

The framework has been updated to check for the update asynchronously, and therefore not interrupt your app.
It has also become extremely easy to plug into your new or existing applications.

=========
Changelog
=========

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

===================
USAGE FOR SDK APPS
===================

There is now only one file you need worry about in the puchk framework, /palm/main-assistant.js

1) Copy and paste everything from this file, below (and not including) the setup() function, into your app's main (first scene) assistant file.

2) Find and replace (normally CTRL+H on Windows or Linux) "MainAssistant" with the name of your assistant (e.g. "FirstAssistant", etc.)

3) Modify the call to this.doUpdateCheck(interval); in your setup() function. interval is the number of hours you want to require in between update checks (so if the user uses your app multiple times per day, it will only check after the number of hours has elapsed).

4) Optionally, you can edit the text that is shown in the dialog. This is in the gotResults() function.

That's it! puchk update checking is now enabled in your app! Check it out!

===================
USAGE FOR ARES APPS
===================

There is now only one file you need worry about in the puchk framework, /palm/ares-main-assistant.js

1) Copy and paste everything from this file, below (and not including) the setup() or cleanup() functions, into your app's main (first scene) assistant file.

2) Modify the call to this.doUpdateCheck(interval); in your setup() function. interval is the number of hours you want to require in between update checks (so if the user uses your app multiple times per day, it will only check after the number of hours has elapsed).

4) Optionally, you can edit the text that is shown in the dialog. This is in the gotResults() function.

That's it! puchk update checking is now enabled in your app! Check it out!


=====================================
TESTING PUCHK IN YOUR APP
=====================================

There are a couple different methods to test the framework in your app, depending on whether your app is already published.

If your app is already published - you cannot submit an app with a lower version number to Palm for publishing, but there's nothing that says you can't test the updated app with a lower version number in the emulator or on your own device. So lower the version number in appinfo.json for testing, to ensure that the update scene is pushed properly. Be sure to change the version number back before trying to publish!

If your app is new and hasn't been published, you can simply edit the var url="" under doUpdateCheck() to use an app id from an existing published app that has a higher version number. Pick any app you want and put the id in the line like this:

Previous line of code:
	var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;

New line of code:
	var url = "http://developer.palm.com/webChannel/index.php?packageid=com.jdfsoftware.tuneyourguitarpro";
	(Hint: Tune Your Guitar Pro is currently at v1.0.1 as of May 28, 2010)

This will fool puchk into getting the version for the other app with a higher version number for your testing purposes. Be sure to change the code back before publishing!
