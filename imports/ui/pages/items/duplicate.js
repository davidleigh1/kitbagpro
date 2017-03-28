/* IMPORT METEOR PACKAGES */
	import { Meteor } from 'meteor/meteor'
	// import { Session } from 'meteor/session'
	import { Template } from 'meteor/templating';
	import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './duplicate.html';
	import './duplicate.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/items/itemLine.js';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS */
	var thisCollectionName = "Items";
	var thisAction = "created from duplicate";
	var thisUrlId = "_itemId";


/* ONCREATED */
Template.itemDuplicate.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.itemDuplicate.onRendered(function(){
	globalDuplicate(thisCollectionName,"itemPrefix");
});


/* HELPERS */
Template.itemDuplicate.helpers({
	Items: function () {
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
	},	
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedItemDoc: function () {
		return kb.collections[thisCollectionName].findOne(GlobalHelpers.get_urlParam(thisUrlId));
	}
});


/* HOOKS */
AutoForm.hooks({
	duplicateItemForm: {
		onSuccess: function(formType, resultObj) {
			// console.log("AutoForm.hooks.duplicateItemForm.onSuccess: ", formType, resultObj);
			// console.log("Calling globalOnSuccess()", thisCollectionName, thisAction, resultObj);		
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			// console.log("AutoForm.hooks.insertItemForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
  }
});


/* EVENTS */
Template.itemDuplicate.events({
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});