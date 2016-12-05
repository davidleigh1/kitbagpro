import './orgLine.html';
import './orgLine.css';
import './changeOrgStatus.html';

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';



trashOrg = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setOrgStatus",clickObj.orgObj._id, "Trashed");
};


Template.orgLine.helpers({
	isOwner: function () {
		return this.owner == Meteor.userId();
	},
	lookupUser: function (userId,reqField) {
		console.log("lookupUser: ",userId);
		var uname = GlobalHelpers.lookupNameFromUser(userId,reqField);
		console.log("lookupUser: ",uname);
		return uname;
	},
	userNameLookup: function (userId, paramRequired) {
		var myUser = Meteor.users.findOne({_id: userId });
		// Orgs.findOne({orgId: FlowRouter.getParam('_orgId') });
		// console.log("myUser",myUser.profile.displayName);

		var data = {};
		data.uname = (myUser && myUser.getDisplayName)?myUser.getDisplayName:(myUser && myUser.username)?myUser.username:"("+userId+")";
		data.dbId  = userId;
		data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
		data.url   = "/users/"+userId+"/view";
		data.html  = "<a href='"+data.url+"' title='DBID: "+userId+"'>"+data.uname+"</a>";

		return Spacebars.SafeString( data[paramRequired] );
	}
});

Template.orgLine.events({
	'click .showDetail': function(event) {
		// et = event.target;
		// console.log(et);
		// $( et.parentElement.parentElement ).children( '.orgDetails' ).toggle();
		FlowRouter.go("/orgs/"+this._id+"/view");
		// $(".objView-"+o).toggle();
	},
	'click .edit': function(event) {
		// TODO: Don't set in global scope!
		// et = event.target;
		// console.log(et);
		// TODO: Replace this show/hide/toggle bit with a global view controller!
		// $('.screen-wrapper').hide();
		// $('.orgAddEdit').toggle();
		// var findOne = {orgId:event.target.dataset.org};
		// var formId = "add-edit-org";
		FlowRouter.go("/orgs/"+this._id+"/edit");
		// editOrg(findOne,formId);
	},
	'click .toggle-checked': function(event) {
		var checked = event.target.checked;
		Meteor.call("updateOrg",this._id,!this.checked);
	},
	'click .delete': function(event) {

		event.preventDefault();
		globalfn_deleteOrg( this, Meteor.userId(), "/orgs/list" );

		// var areYouSure = "Are you sure you want to permanently delete org '"+this.orgTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
		// if ( confirm(areYouSure) ) {
		// 	Meteor.call("deleteOrg",this._id);
		// 	// history.go(-1);
		// } else {
		// 	return false;
		// }

	},
	'click .toggle-private': function(event){
		Meteor.call("setPrivateOrg",this._id, !this.private);
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

