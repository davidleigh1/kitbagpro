/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './userEdit.html';
// import './userEdit.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
import { UserList } from '/imports/startup/both/user-schema.js';
// import { appSettings } from '/imports/startup/both/sharedConstants.js';


/* ONCREATED */

Template.userEdit.onCreated(function() {

	Meteor.subscribe("userlist", {
		onReady: function () {
			console.log(">>> onReady and the 'userlist' actually arrive");
			// window.myItems = Items.find().fetch();
		},
		onError: function () {
			console.log(">>> onError");
		}
	});

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

// Template.itemEdit.helpers({
// });
Template.userEdit.helpers({
	Users: function () {
		return Meteor.users;
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedUserDoc: function () {
		thisUser = Meteor.users.findOne({"profile.userId":FlowRouter.getParam("_userId")});
		console.log("selectedUserDoc()",thisUser);
		return jQuery.isEmptyObject(thisUser) ? {} : thisUser;
		// return Meteor.users.findOne({itemId:GlobalHelpers.get_urlParam("_userId")});
	},
	// isSelectedUser: function () {
	// 	return GlobalHelpers.get_urlParam("_userId");
	// 	// return Session.equals("selectedItemId", this._id);
	// },
	// formType: function () {
	// 	if ( FlowRouter.getRouteName() == "userEdit" ) {
	// 		return "update";
	// 	} else {
	// 		return "disabled";
	// 	}
	// },
	disableButtons: function () {
		return (FlowRouter.getRouteName() !== "userEdit");
	}
});



AutoForm.hooks({
	updateUserForm: {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// updatedObj = result;
			console.log("SUCCESS! YEY! ", result);
			FlowRouter.go("/users/"+result.updatedUserId+"/view");
		},
		// Called when any submit operation fails
		onError: function(formType, error, arg3, arg4) {
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
  }
});



/* EVENTS */

Template.userEdit.events({
	'click .user-row': function () {
		Session.set("selectedUserId", this._id);
	},
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});