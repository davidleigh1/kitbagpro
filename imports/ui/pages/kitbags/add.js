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


/* PARAMETERS*/
	var thisCollectionName = "Kitbags";
	var thisAction = "created";


/* ONCREATED */
Template.kitbagAdd.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.kitbagAdd.onRendered(function(){
	// EMPTY
});


/* HELPERS */
Template.kitbagAdd.helpers({
	Kitbags: function () {
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
	insertKitbagForm: {
		after: {
			// Replace `formType` with the form `type` attribute to which this hook applies
			method: function(error, result, arg3, arg4) {
				// console.log("AutoForm.hooks.insertKitbagForm.after: ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, resultObj) {
			// console.log("AutoForm.hooks.insertKitbagForm.onSuccess: ",formType, resultObj);
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
	}
});



/* EVENTS */
Template.kitbagAdd.events({
	// EMPTY
});