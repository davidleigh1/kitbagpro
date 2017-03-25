import './line.html';
import './line.css';
import './changeStatus.html';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* PARAMETERS */
var thisCollection = "Orgs";

/* HELPERS */

Template.orgLine.helpers({
	trashOrActive: function(labelOrTitle) {
		// console.log(this.status);
		var statusObj = {};
		if (this.status == "Trashed"){
			statusObj.label = "Make <span class='label label-success'>Active</span>";
			statusObj.title = "Restore this Organisation";
		} else {
			statusObj.label = "Trash";
			statusObj.title = "Trash this Organisation";
		}
		return Spacebars.SafeString( statusObj[labelOrTitle] );
	}
});

Template.orgLine.events({
	// 'click .dropdown-menu a': function(event) {
	// 	event.preventDefault();
	// 	// console.log('a click: ',this,$(event.target).data('action'));
	// 	var clickObj = {
	// 		action: $(event.target).data('action'),
	// 		orgId: $(event.target).data('org'),
	// 		orgObj: this
	// 	};
	// 	if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
	// 		window[$(event.target).data('action')](clickObj);
	// 	} else {
	// 		console.log("Alert: 'action' function was not found (code: 0147)");
	// 	};
	// },
	'click .view': function(event) {
		event.preventDefault();
		FlowRouter.go("/orgs/"+this._id+"/view");
	},
	'click .edit': function(event) {
		event.preventDefault();
		FlowRouter.go("/orgs/"+this._id+"/edit");
	},
	'click .trash': function(event) {
		event.preventDefault();
		console.log("TODO: Create globalTrash()!");
		// console.log("click trash function");
		var newStatus = ("Trashed" == this.status) ? "Active" : "Trashed";
		Meteor.call("setDocStatus", thisCollection, this._id, newStatus);
	},
	'click .delete': function(event) {
		event.preventDefault();
		globalDelete("DeletedByUser", "Orgs", this, Meteor.userId(), "/orgs/list");
	},
	'click .createKitbag': function(event) {
		event.preventDefault();
		FlowRouter.go("/kitbags/create/"+this._id);
	},
	'click .createUser': function(event) {
		event.preventDefault();
		FlowRouter.go("/users/create/"+this._id);
	},
	// 'click .toggle-checked': function(event) {
	// 	event.preventDefault();
	// 	var checked = event.target.checked;
	// 	Meteor.call("updateOrg",this._id,!this.checked);
	// },
	// 'click .toggle-private': function(event){
	// 	event.preventDefault();
	// 	// Meteor.call("setPrivateOrg",this._id, !this.private);
	// 	console.log("TODO: Deprecate .toggle-private and setPrivateOrg()");
	// },
});

