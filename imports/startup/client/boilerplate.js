/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './thisTemplate.html';
	import './thisTemplate.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/kitbags/line.js';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS */
	var thisCollectionName = "Orgs|Kitbags|Items|Users";


/* ONCREATED */
	Template.thisTemplate.onCreated(function() {
	});

/* ONRENDERED */

	Template.thisTemplate.onRendered(function(){
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

Template.thisTemplate.helpers({
});




/* EVENTS */

Template.thisTemplate.events({
	'click button.submit': function(event) {
		event.preventDefault();
		event.stopPropagation();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		event.stopPropagation();		
		alert('cancel button!');
	}
});