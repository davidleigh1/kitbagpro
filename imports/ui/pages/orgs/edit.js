/* IMPORT METEOR PACKAGES */
import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';




/* IMPORT PAGE COMPONENTS */
import './edit.html';
import './edit.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */
// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */
import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";



/* PARAMETERS */
var thisObj = "Orgs";



/* ONCREATED */
Template.orgEdit.onCreated(function() {
	Meteor.subscribe("orgs", {
		onReady: function () {
			console.log(">>> onReady and the 'orgs' actually arrive");
		},
		onError: function () {
			console.log(">>> onError");
		}
	});
});




/* ONRENDERED */
Template.orgEdit.onRendered(function(){
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

Template.orgEdit.helpers({
	Orgs: function () {
		console.log("'Orgs' CALLED! ------------------------",typeof kb);
		return kb.collections[thisObj];
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedOrgDoc: function () {
		return kb.collections[thisObj].findOne( GlobalHelpers.get_urlParam("_orgId") );
	},
	isSelectedOrg: function () {
		return GlobalHelpers.get_urlParam("_orgId");
	},
	// formType: function () {
	// 	if ( FlowRouter.getRouteName() == "itemEdit" ) {
	// 		return "update";
	// 	} else {
	// 		return "disabled";
	// 	}
	// },
	disableButtons: function () {
		return (FlowRouter.getRouteName() !== "orgEdit");
	}
});



/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";

AutoForm.hooks({
	updateOrgForm: {
		onSuccess: function(formType, result) {
			console.log("AutoForm.hooks.updateOrgForm.onSuccess: ", formType, result);
			console.log("TODO - CREATE GENERIC onUpdateSuccess PROTOTYPE!!!");
			var title = result.orgObj.title;
			sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong> Org: '<i>"+title+"</i>' was successfully updated.", {
				html: true,
				onRouteClose: false
			});
			FlowRouter.go("/orgs/"+result.orgObj._id+"/view");
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.updateOrgForm.onError: ", formType, error, arg3, arg4);
			var msg = alertMsgPrefix + "<strong>Error: </strong><code>"+error.message+"</code>";
			sAlert.error(msg, {
				html: true,
				timeout: appSettings.sAlert.longTimeout
			});
		}
  }
});



/* EVENTS */

Template.orgEdit.events({
	// 'click .item-row': function () {
	// 	Session.set("selectedOrgId", this._id);
	// },
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});