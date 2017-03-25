/* IMPORT METEOR PACKAGES */
	import { Meteor } from 'meteor/meteor'
	// import { Session } from 'meteor/session'
	import { Template } from 'meteor/templating';
	import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './add.html';
	import './add.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/kitbags/kitbagLine.js';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollectionName = "Users";
	var thisAction = "created";


/* ONCREATED */
	Template.userAdd.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
Template.userAdd.onRendered(function(){

	/* NOTE - Only superAdmins should be able to select an organisation as all other users (i.e. orgAdmins) will be limited to creating users within their own org only  */

	/* Use case - when clicking "new user" within an organisation, the Organisation dropdown should be pre-populated */
	var thisOrg = FlowRouter.getParam("_orgId");
	/* Check that the orgId value provided is found in the dropdown */
	if ( jQuery("[name='assocOrgId']").find('option[value="'+thisOrg+'"]').length > 0 ) {
		jQuery("[name='assocOrgId']").val( thisOrg );
	} else {
		console.log("userAdd.onRendered() - '_orgId' value provided '"+thisOrg+"' not found in Org dropdown");
	}

});



/* HELPERS */

Template.userAdd.helpers({
	Users: function () {
		return kb.collections[thisCollectionName];
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;
	}
});

AutoForm.hooks({
	insertUserForm: {
		after: {
			method: function(error, result, arg3, arg4) {
				// alert("AFTER!");
				// console.log("AFTER! ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, resultObj) {
			// FlowRouter.go("/users/list#"+result.userId);
			console.log("AutoForm.hooks.insertUserForm.onSuccess: ",formType);
			globalOnSuccess(thisCollectionName, thisAction, resultObj);			
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.insertUserForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
	}
});



/* EVENTS */

Template.userAdd.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});