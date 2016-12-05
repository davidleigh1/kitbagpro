/* IMPORT METEOR PACKAGES */

// import { Session } from 'meteor/session'




/* IMPORT PAGE COMPONENTS */

import './noListObjectsFound.html';
// import './noListObjectsFound.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { listOrgStatuses } from '/imports/api/orgs/orgs.js';




/* ONCREATED */

Template.noListObjectsFound.onCreated(function() {
});




/* ONRENDERED */

Template.noListObjectsFound.onRendered(function(){
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

Template.noListObjectsFound.helpers({
});




/* EVENTS */

Template.noListObjectsFound.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});