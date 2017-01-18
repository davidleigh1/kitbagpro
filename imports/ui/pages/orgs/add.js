/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */
import './add.html';
// import './add.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */
// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */
import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";



/* PARAMETERS */
var thisObj = "Orgs";



/* ONCREATED */
Template.orgAdd.onCreated(function() {
	console.log("Meteor.subscribe('orgs') removed");
	// Meteor.subscribe("orgs", {
	// 	onReady: function () {
	// 		console.log("orgAdd.onCreated.onReady and the 'orgs' actually arrive");
	// 	},
	// 	onError: function () {
	// 		console.log("orgAdd.onCreated.onError");
	// 	}
	// });
});




/* ONRENDERED */

Template.orgAdd.onRendered(function(){
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

Template.orgAdd.helpers({
	Orgs: function () {
		/* 
		Reference - autoform requires collection in windows scope
		But most isolated solution is to make collection available
		via the template helper in the relevant template
		See: https://github.com/aldeed/meteor-autoform/issues/1449
		*/
		return kb.collections[thisObj];
	}
});



/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";

AutoForm.hooks({
	insertOrgForm: {
		after: {
			// Replace `formType` with the form `type` attribute to which this hook applies
			method: function(error, result, arg3, arg4) {
				console.log("AutoForm.hooks.insertOrgForm.after: ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, result) {
			console.log("AutoForm.hooks.insertOrgForm.onSuccess: ", formType, result);
			var title = result.orgObj.title;
			sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong> Org: '<i>"+title+"</i>' was successfully created.", {
				html: true,
				onRouteClose: false
			});
			FlowRouter.go("/orgs/"+result.orgObj._id+"/view");
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.insertOrgForm.onError: ", formType, error, arg3, arg4);
			var msg = alertMsgPrefix + "<strong>Error: </strong><code>"+error.message+"</code>";
			sAlert.error(msg, {
				html: true,
				timeout: appSettings.sAlert.longTimeout
			});
		}

	}
});



/* EVENTS */

Template.orgAdd.events({
	// 'click button.submit': function(event) {
	// 	event.preventDefault();
	// 	alert('submit button!');
	// },
	// 'click button.cancel': function(event) {
	// 	event.preventDefault();
	// 	alert('cancel button!');
	// }
});