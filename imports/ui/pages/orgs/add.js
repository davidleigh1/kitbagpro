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
	var thisCollectionName = "Orgs";
	var thisAction = "created";
	var thisUrlId = "_orgId";	


/* ONCREATED */
Template.orgAdd.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.orgAdd.onRendered(function(){
	// EMPTY
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
		return kb.collections[thisCollectionName];
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;
	}
});


/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

AutoForm.hooks({
	insertOrgForm: {
		after: {
			// Replace `formType` with the form `type` attribute to which this hook applies
			method: function(error, result, arg3, arg4) {
				// console.log("AutoForm.hooks.insertOrgForm.after: ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, resultObj) {
			// console.log("AutoForm.hooks.insertOrgForm.onSuccess: ", formType, resultObj);
			// console.log("Calling globalOnSuccess()", thisCollectionName, thisAction, resultObj);
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			// console.log("AutoForm.hooks.insertOrgForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
			
		}

	}
});



/* EVENTS */
Template.orgAdd.events({
	// EMPTY
});