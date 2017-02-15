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
	var thisCollectionName = "Orgs";
	var thisAction = "updated";


/* ONCREATED */
Template.orgEdit.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.orgEdit.onRendered(function(){
	// EMPTY
});


/* HELPERS */
Template.orgEdit.helpers({
	Orgs: function () {
		//console.log("'Orgs' CALLED! ------------------------",typeof kb);
		return kb.collections[thisCollectionName];
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedOrgDoc: function () {
		return kb.collections[thisCollectionName].findOne( GlobalHelpers.get_urlParam("_orgId") );
	}
	// isSelectedOrg: function () {
	// 	return GlobalHelpers.get_urlParam("_orgId");
	// },
	// disableButtons: function () {
	// 	return (FlowRouter.getRouteName() !== "orgEdit");
	// }
});



/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

AutoForm.hooks({
	updateOrgForm: {
		onSuccess: function(formType, resultObj) {
			console.log("AutoForm.hooks.updateOrgForm.onSuccess: ", formType, resultObj);
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.updateOrgForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
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