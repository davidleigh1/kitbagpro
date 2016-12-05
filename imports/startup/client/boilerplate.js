/* IMPORT METEOR PACKAGES */

// import { Session } from 'meteor/session'




/* IMPORT PAGE COMPONENTS */

import './thisTemplate.html';
import './thisTemplate.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';




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
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});