// import { Session } from 'meteor/session'

import './userView.html';
// import './userView.css';

import '/imports/ui/pages/kitbags/line.js';
import '/imports/ui/pages/notFound/noListObjectsFound.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/schema-user.js';

import { listItemStatuses } from '/imports/api/items/items.js';

import '/imports/ui/components/urlImagePreviewRollover.html';


Template.userView.onCreated(function() {

	// console.log("--- onCreated ------------------------------------------");
	// console.log("FlowRouter: ",FlowRouter);
	// console.log("getRouteName: " + FlowRouter.getRouteName());
	// console.log("getParam: " + FlowRouter.getParam('_userId'));
	// console.log("getQueryParam: " + FlowRouter.getQueryParam());
	// console.log("---------------------------------------------------------");

});


Template.userView.onRendered(function(){

	// console.log("--- onRendered ------------------------------------------");
	// console.log("FlowRouter: ",FlowRouter);
	// console.log("getRouteName: " + FlowRouter.getRouteName());
	// console.log("getParam: " + FlowRouter.getParam('_userId'));
	// console.log("getQueryParam: " + FlowRouter.getQueryParam());
	// console.log("---------------------------------------------------------");

});



// Template.myTemplateName.helpers
Template.userView.helpers({
	// isTrashed: function (userId) {
	// 	if (this.profile.userStatus && this.profile.userStatus.toLowerCase() == "trashed"){
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// },
	userEmail: function () {
		//console.log("userEmail",this.emails);
		return this.emails[0]["address"];
	},
	assocKitbags: function () {
		/* Tidies up the userKitbags array */
		/* TODO - Remove this if no longer required */
		var arr = this.profile.userKitbags;
		var prefix = "<code>";
		var joiner = "</code>, <code>";
		var suffix = "</code>";
		if (typeof arr != "object" || arr.length <= 0) {
			return false;
		} else {
			return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
		}
	},
	thisUser: function (thisUserId) {
		// var myUser = UserList.findOne({"profile.userId": FlowRouter.getParam('_userId') });
		var myUser = Meteor.users.findOne({"profile.userId": FlowRouter.getParam('_userId') });
		// var myUser = UserList.findOne({}).fetch();
		//console.log("itemProfile",FlowRouter.getParam('_userId'),myUser);
		return myUser;
	},
	thisKitbag: function (kitbagId) {
		// return Template.currentData().thisKitbag;
		// var myKitbag = Kitbags.findOne({_id: kitbag_id});
		var myKitbag = Kitbags.findOne({kitbagId: ""+kitbagId});
		return myKitbag;
	},
	// userNameLookup: function (userId, paramRequired) {
	// 	var myUser = Meteor.users.findOne({_id: userId });
	// 	// Items.findOne({itemId: FlowRouter.getParam('_itemId') });
	// 	// console.log("myUser",myUser.profile.displayName);

	// 	console.log("TODO: Replace local userNameLookup() (userView.js) with global function!");

	// 	var data = {};
	// 	data.uname = (myUser && myUser.profile.displayName)?myUser.profile.displayName:myUser.username;
	// 	data.dbId  = userId;
	// 	data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
	// 	data.url   = "/users/"+userId+"/view";
	// 	data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

	// 	return Spacebars.SafeString( data[paramRequired] );
	// },
	noFilter: function () {
		// There is no user filter in minilists - so we just return a null value for objectsFiltered()
		return;
	},
	minilistFilter: function () {

		var newArray = [];
		if (typeof this.userKitbags != "object" || this.userKitbags.length <= 0) {
			return false;
		} else {
			$.each( this.userKitbags , function( key, assignedBag ) {
				newArray.push( assignedBag );
			});
		}

		// return { "kitbagId": { $in: newArray } }
		return { "_id": { $in: newArray } }

	}
});


// Template.myTemplateName.events
Template.userView.events({
	'click a.btn.forcePasswordChange': function(event) {
		event.preventDefault();
		console.log("forcePasswordChange() ",event);
		/* Note - forceUserPasswordChange requires the _id rather than the userId */
		forceUserPasswordChange(this._id);
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	},
	'click li.setUserStatus': function(event,a,b) {
		event.preventDefault();
		// var newStatus = event.target.categ.dataset.getAttribute('data-id')
		var field = "userStatus";
		// newEvent = event;
		var parent = event.target.parentElement;
		var newValue = event.target.parentElement.getAttribute("data-status");
		//console.log("EVENT updateUserField",this._id,field,newValue,parent);
		// Meteor.call("updateItemField",this._id,field,newValue);
	},
	'click .btn.trash': function(event) {
		event.preventDefault();
		var areYouSure = "Are you sure you want to trash user '"+this.username+"'?\n(UserId: "+this.profile.userId+")";
		if ( confirm(areYouSure) ) {
			Meteor.call("setUserStatus",this._id, "Trashed");
		} else {
			return false;
		}
	},
	'click .btn.delete': function(event,a,b) {
		event.preventDefault();
		// console.log(this,a,b);

		var areYouSure = "Are you sure you want to permanently delete user '"+this.username+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
		if ( confirm(areYouSure) ) {
			Meteor.call("deleteUser",this._id);
			// history.go(-1);
			FlowRouter.go("/users/list");
		} else {
			return false;
		}

	}
});