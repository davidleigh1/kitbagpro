/* IMPORT METEOR PACKAGES */
	import { Meteor } from 'meteor/meteor'
	// import { Session } from 'meteor/session'
	import { Template } from 'meteor/templating';
	import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './edit.html';
	// import './edit.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/kitbags/kitbagLine.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollectionName = "Users";
	var thisAction = "updated";
	var thisUrlId = "_userId";


/* ONCREATED */
Template.userEdit.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.userEdit.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am itemAdd - rendered!");
});



/* HELPERS */
Template.userEdit.helpers({
	Users: function () {
		return kb.collections[thisCollectionName];
		// return Meteor.users;
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;	
	},	
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedUserDoc: function () {
		return kb.collections[thisCollectionName].findOne( GlobalHelpers.get_urlParam(thisUrlId) );
	}
});


/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

AutoForm.hooks({
	updateUserForm: {
		/*
		onSuccess: function(formType, result) {
			console.log("SUCCESS! YEY! ", result);
			FlowRouter.go("/users/"+result.updatedUserId+"/view");
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
		*/
		onSuccess: function(formType, resultObj) {
			console.log("AutoForm.hooks.updateUserForm.onSuccess: ", arguments);			
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.updateUserForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}		
  }
});



/* EVENTS */
Template.userEdit.events({
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});