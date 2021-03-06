/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './customAtForm.html';
	import './customAtForm.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// Empty


/* IMPORT PROJECT OBJECTS */
	// Empty


/* THIS TEMPLATE OVERRIDES THE STANDARD >ATFORM TEMPLATE */
	// See: https://github.com/meteor-useraccounts/core/issues/300
	// Other templates: https://github.com/meteor-useraccounts/bootstrap/tree/master/lib
	// .replaces() is dependent on  aldeed:template-extension  see: https://github.com/meteor-useraccounts/core/issues/212#issuecomment-67810815

// Template.customAtForm.replaces("atForm");


/* ONCREATED */

Template.customAtForm.onCreated(function() {
});




/* ONRENDERED */

Template.customAtForm.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
});



/* HELPERS */

Template.customAtForm.helpers({
});




/* EVENTS */

Template.customAtForm.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});