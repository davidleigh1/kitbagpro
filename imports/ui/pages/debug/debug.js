// var newobj = int_resultsCount.get();
// newobj["foo"] = "bar";
// int_resultsCount.set(newobj);



/* IMPORT METEOR PACKAGES */

// import { Session } from 'meteor/session'




/* IMPORT PAGE COMPONENTS */

import './debug.html';
import './debug.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/startup/both/item-schema.js';
// import { UserList } from '/imports/startup/both/user-schema.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';




/* ONCREATED */

Template.debug.onCreated(function() {
});




/* ONRENDERED */

Template.debug.onRendered(function(){
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

Template.debug.helpers({
	prettyjson: function (json) {
		console.log("prettyjson: ",json,window[json]);
		pretty = JSON.stringify(window[json],null,2);
		return pretty;
	},
	pretty_obj_resultsCount: function (json) {
		var myObj = obj_resultsCount.get();
		console.log("pretty_obj_resultsCount: ",obj_resultsCount,myObj);
		pretty2 = JSON.stringify(myObj,null,2);
		return pretty2;
	},
	int_resultsCount: function (json) {
		console.log("int_resultsCount: ",int_resultsCount);
		pretty3 = JSON.stringify(int_resultsCount,null,2);
		return pretty3;
	}
});




/* EVENTS */

Template.debug.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});