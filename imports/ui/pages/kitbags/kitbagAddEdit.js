import { Session } from 'meteor/session'

import './kitbagAddEdit.html';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { listKitbagStatuses } from '/imports/api/kitbags/kitbags.js';

/* Orgs are required for the Org dropdown */
/* TODO - Dropdown only shown if user is admin and/or is associated to more than one org  -  otherwise can only add a personal kitbag*/
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
// import { listOrgStatuses } from '/imports/api/orgs/orgs.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';


/* ONCREATED */

Template.kitbagAddEdit.onCreated(function() {
	console.log("Template.kitbagAddEdit.onCreated -------------------------------------- onCreated");

	this.subscribe("kitbags", {
		onReady: function () {

			console.log("onReady And the 'kitbags' Items actually Arrive", arguments);
		},
		onError: function () { console.log("onError", arguments); }
	});


	// var handle = Meteor.subscribe('posts');
	// Tracker.autorun(function() {
});


/* ONRENDERED */

Template.kitbagAddEdit.onRendered(function(){

	/* NOTE - Only superAdmins should be able to select an organisation as all other users (i.e. orgAdmins) will be limited to creating users within their own org only  */
	/* Use case - when clicking "new user" within an organisation, the organization dropdown should be pre-populated */
	var thisOrg = FlowRouter.getParam("_orgId");
	/* Check that the orgId value provided is found in the dropdown */
	if ( jQuery("[name='kitbagAssocOrg']").find('option[value="'+thisOrg+'"]').length > 0 ) {
		jQuery("[name='kitbagAssocOrg']").val( thisOrg );
	} else {
		console.log("userAdd.onRendered() - '_orgId' value provided '"+thisOrg+"' not found in Org dropdown");
	}

});


// Template.kitbagAddEdit.helpers

Template.kitbagAddEdit.helpers({
	orgs: function () {
		if (Session.get('hideFinished')) {
			var r1 = Orgs.find({checked: {$ne: true}});
			// console.log(r1);
			return r1;
		} else {
			var r2 = Orgs.find();
			// console.log(r2);
			return r2;
		}
	},
	// getSchemaVar: function (param) {
	// 	console.log('getSchemaVar: ',param);
	// 	return param;
	// }
	listKitbagStatuses: function () {
		console.log(listKitbagStatuses);
		return listKitbagStatuses;
	},
});



// Template.kitbagAddEdit.events

Template.kitbagAddEdit.events({
	// 'submit .kitbagAddEdit': function(event) {
	'click button.submit': function(event) {
		event.preventDefault();

		// ===================================================================================
		// ALWAYS ASSUMING HERE THAT THIS IS A NEW KITBAG === NO OPTION TO EDIT YET!!!!!!!!!!!
		// ===================================================================================


		// Create and autopopulate the ID field for the getObjFromForm function to read
		$("#kitbagId").val( GlobalHelpers.idGenerator(uniqueIds.kbPrefix) );

		// Get kitbag details from form
		var kbFormObj = getObjFromForm("add-edit-kitbag","add");

		if (typeof kbFormObj == "object") {
			// Add to collection
			// http://stackoverflow.com/questions/16439055/retrieve-id-after-insert-in-a-meteor-method-call
			Meteor.call("addKitbag", kbFormObj);
			// Add kitbag ID to assocKitbags field of the record for the assocOrg
			// We don't know if there is already a kitbag assocated with this Org
			Meteor.call("assignKBtoOrg", kbFormObj.kitbagId, kbFormObj.kitbagAssocOrg);
		} else {
			sAlert.error('<samp>getObjFromForm()</samp> failed to provide <samp>kbFormObj{}</samp> so the insert action was cancelled.<br>Hint: Check <samp>getObjFromForm()</samp>; Missing <samp>bagName</samp>; etc [error code: 0013.1]', {html: true,timeout: 10000,onRouteClose: false,position: 'top',});
			console.log('ERROR: getObjFromForm() failed to provide kbFormObj{}. DB insert action cancelled. Hint: Check getObjFromForm(); Missing bagName;  [error code: 0013.1]');
			return false;
		}

		/* TODO: Add notification for success or failure */

		/* If failure - then return to edit! */

		/*
			If success - show the object in context,
			meaning in object view or if not available then browse object list
		*/


		// Clear the input field which is not required when using non-CSS UI
		jQuery(".add-edit-kitbag")[0].reset();
		// Close form
		FlowRouter.go('/bags/'+kbFormObj.kitbagId+'/view');
		// $(".kitbagAddEdit").hide();
		// Prevent the default page refresh which occurs when clicking submit
		// return false;
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		$(".add-edit-kitbag")[0].reset();
		$(".kitbagAddEdit").hide();
		// Prevent the default page refresh which occurs when clicking submit
		return false;
	}
});