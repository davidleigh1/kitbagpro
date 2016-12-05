import './myCustomFullPageAtForm.html';
import './myCustomFullPageAtForm.css';



/* ONCREATED */

Template.myCustomFullPageAtForm.onCreated(function() {
});



/* IMPORTANT - THE img- PREFIX IS REQUIRED IN ORDER THAT THE CLASSES CAN BE CORRECTLY ADDED AND REMOVED!! */
backgroundClasses = ["img-uh_italy", "img-tram", "img-icrc", "img-snow", "img-mada-evac", "img-forest_orange_blanket"];
non_active_backgrounds = ["img-wild"];

cyclebackgrounds_start = function() {
	// set interval
	currentBackground = 0;
	cyclebackgrounds_timer = setInterval(cyclebackgrounds_now, 10000);
};

cyclebackgrounds_now = function () {
	nextBackground = (currentBackground + 1 == backgroundClasses.length) ? 0 : currentBackground + 1;

	// console.log("cyclebackgrounds_now() currentBackground("+currentBackground+"): "+backgroundClasses[currentBackground]+ " / nextBackground("+nextBackground+"): "+backgroundClasses[nextBackground]);

	// var str = backgroundClasses[currentBackground] + " " + backgroundClasses[nextBackground];
	// jQuery(".fullpage-wrapper").toggleClass(str);

	jQuery(".fullpage-wrapper").removeClass (function (index, css) {
		return (css.match (/\bimg-\S+/g) || []).join(' ');
	});

	jQuery(".fullpage-wrapper").addClass ( backgroundClasses[nextBackground] );

	currentBackground = nextBackground;
};

cyclebackgrounds_abortTimer = function() { // to be called when you want to stop the timer
	console.log("cyclebackgrounds_abortTimer()!");
	if (typeof cyclebackgrounds_timer != "undefined"){
		clearInterval(cyclebackgrounds_timer);
	}
}



/* ONRENDERED */

Template.myCustomFullPageAtForm.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/

	jQuery(".fullpage-wrapper").addClass(backgroundClasses[0]);
	cyclebackgrounds_start();


/* TODO - Fix this so that the background stops loading indefinitely! */
 //    $(window).bind('beforeunload', function() {
 //        closingWindow();
 //    });

	// closingWindow = function(){
	// 	cyclebackgrounds_abortTimer();
	// }



});

Template.myCustomFullPageAtForm.helpers({
	atDisabled: function() {
		return AccountsTemplates.disabled();
	},
	atClass: function() {
		return AccountsTemplates.disabled() ? 'hidden' : '';
	},
	showStateTitle: function () {
		switch(AccountsTemplates.getState().toLowerCase()) {
			case "signin":
				return "Please sign in"
				break;
			case "signup":
				return "Please register"
				break;
			default:
				return AccountsTemplates.getState();
			break;
		}
	}
});
