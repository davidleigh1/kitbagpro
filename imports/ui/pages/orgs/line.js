import './line.html';
import './line.css';
import './changeStatus.html';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* PARAMETERS */
var thisObj = "Orgs";


trashOrg = function (clickObj) {
	console.log('======= trashOrg() =======',clickObj);
	// Meteor.call("setOrgStatus",clickObj.orgObj._id, "Trashed");
	// setDocStatus: function(docCollection, docId, newStatus){
	Meteor.call("setDocStatus", thisObj, clickObj.orgObj._id, "Trashed");
};


Template.orgLine.helpers({
	// EMPTY
});

Template.orgLine.events({
	'click .view': function(event) {
		FlowRouter.go("/orgs/"+this._id+"/view");
	},
	'click .edit': function(event) {
		FlowRouter.go("/orgs/"+this._id+"/edit");
	},
	'click .delete': function(event) {
		event.preventDefault();
		globalDelete("DeletedByUser", "Orgs", this, Meteor.userId(), "/orgs/list");
	},
	'click .addKitbag': function(event) {
		FlowRouter.go("/kitbags/create/"+this._id);
	},
	'click .toggle-checked': function(event) {
		var checked = event.target.checked;
		Meteor.call("updateOrg",this._id,!this.checked);
	},
	'click .toggle-private': function(event){
		// Meteor.call("setPrivateOrg",this._id, !this.private);
		console.log("TODO: Deprecate .toggle-private and setPrivateOrg()");
	},
	'click .dropdown-menu a': function(event) {
		event.preventDefault();
		// console.log('a click: ',this,$(event.target).data('action'));
		var clickObj = {
			action: $(event.target).data('action'),
			orgId: $(event.target).data('org'),
			orgObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.target).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
	}
});

