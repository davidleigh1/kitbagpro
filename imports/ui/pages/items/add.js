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
	var thisCollectionName = "Items";
	var thisAction = "created";


/* ONCREATED */
	Template.itemAdd.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
	Template.itemAdd.onRendered(function(){
		if(!FlowRouter) {
			alert("Router not loaded yet!!!");
		}else{
			var thisKitbag = FlowRouter.getParam('_kitbagId');
			$("select[name='assocKitbagsArray']").val(thisKitbag);
		}
	});


/* HELPERS */
	Template.itemAdd.helpers({
		Items: function () {
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
	insertItemForm: {
		after: {
			method: function(error, result, arg3, arg4) {
				// console.log("AutoForm.hooks.insertItemForm.after: ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, resultObj) {
			// console.log("AutoForm.hooks.insertItemForm.onSuccess: ",formType, resultObj);
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
	}
});


/* EVENTS */
	Template.itemAdd.events({
		// EMPTY
	});