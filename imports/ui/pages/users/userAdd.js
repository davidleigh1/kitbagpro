/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */

import './userAdd.html';
import './userAdd.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';


/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
// import '/imports/api/items/items.js';
// import { appSettings } from '/imports/startup/both/sharedConstants.js';



/* ONCREATED */

Template.userAdd.onCreated(function() {
});




/* ONRENDERED */

Template.userAdd.onRendered(function(){

	/* NOTE - Only superAdmins should be able to select an organisation as all other users (i.e. orgAdmins) will be limited to creating users within their own org only  */

	/* Use case - when clicking "new user" within an organisation, the organization dropdown should be pre-populated */
	var thisOrg = FlowRouter.getParam("_orgId");
	/* Check that the orgId value provided is found in the dropdown */
	if ( jQuery("[name='profile.userAssocOrg']").find('option[value="'+thisOrg+'"]').length > 0 ) {
		jQuery("[name='profile.userAssocOrg']").val( thisOrg );
	} else {
		console.log("userAdd.onRendered() - '_orgId' value provided '"+thisOrg+"' not found in Org dropdown");
	}

});



/* HELPERS */

Template.userAdd.helpers({
	Users: function () {
		return userlist;
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
	onSuccess: function(formType, result) {
		console.log("SUCCESS! YEY! ", formType, result);
		// FlowRouter.go("/users/"+result.userId+"/view");
		FlowRouter.go("/users/list#"+result.userId);
	},

	// Called when any submit operation fails
	onError: function(formType, error, arg3, arg4) {
		// alert("ERROR! BOOO!");
	console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
	},


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