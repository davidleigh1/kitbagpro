/* IMPORT PAGE COMPONENTS */
	import './line.html';


/* IMPORT PROJECT OBJECTS */
	// import { kb } from '/imports/startup/both/sharedConstants.js';


/* PARAMETERS */
	var thisCollectionName = "Users";


/* UTIL FUNCTIONS */
	trashUser = function (clickObj) {
		// console.log('deleteKb: ',clickObj);
		Meteor.call("setUserStatus",clickObj.userObj._id, "Trashed");
	};


/* HELPERS */
	Template.userLine.helpers({
		isOrgUsersList: function () {
			/*
			NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
			All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
			*/
			return "orgUsers"==Template.parentData().listType;
		},
		log: function() {
			// console.log(this);
		},
		isCurrentUser: function() {
			if (Meteor.userId() == this._id) {
				return true;
			} else {
				return false;
			}
		}
	});

/* EVENTS */
	Template.userLine.events({
		// 'click button.view': function(event) {
		// 	// console.log("$(event.target)",$(event.target),"event.target.dataset.user",event.target.dataset.user);
		// 	var o = $(event.target).data("user");
		// 	FlowRouter.go("/users/"+o+"/view");
		// },
		// 'click button.edit': function(event) {
		// 	// console.log("$(event.target)",$(event.target),"event.target.dataset.user",event.target.dataset.user);
		// 	FlowRouter.go("/users/"+event.target.dataset.user+"/edit");
		// },
		/* See: http://stackoverflow.com/questions/22962386/ for use of 'event.currentTarget' */
		'click .view': function(event) {
			event.preventDefault();
			FlowRouter.go("/"+ thisCollectionName.toLowerCase() +"/"+event.currentTarget.dataset.doc+"/view");
		},
		'click .edit': function(event) {
			event.preventDefault();
			FlowRouter.go("/"+ thisCollectionName.toLowerCase() +"/"+event.currentTarget.dataset.doc+"/edit");
		},
		'click .delete': function(event) {
			event.preventDefault();
			globalDelete("DeletedByUser", thisCollectionName, this, Meteor.userId(), "/"+ thisCollectionName.toLowerCase() +"/list");
			// var areYouSure = "Are you sure you want to permanently delete user '"+this.username+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
			// if ( confirm(areYouSure) ) {
			// 	Meteor.call("deleteUser",this._id);
			// 	// history.go(-1);
			// 	FlowRouter.go("/users/list");
			// } else {
			// 	return false;
			// }
		}
	});
