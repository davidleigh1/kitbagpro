import './line.html';
import './line.css';
import './changeStatus.html';

// import { Items } 	from '/imports/startup/both/item-schema.js';
// import { Kitbags } 	from '/imports/startup/both/kitbag-schema.js';


trashKitbag = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setKitbagStatus",clickObj.kitbagObj._id, "Trashed");
};


Template.kitbagLine.helpers({
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

		var data = {};
		data.uname = (myUser && myUser.profile.displayName)?myUser.profile.displayName:"Name not found";
		data.dbId  = userId;
		data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
		data.url   = "/users/"+userId+"/view";
		data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

		return Spacebars.SafeString( data[paramRequired] );
	},
	isOrgView: function () {
		/*
		NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
		All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
		*/
		return "orgView"==Template.parentData().listType;
	},
	isItemView: function () {
		/*
		NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
		All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
		*/
		return "itemView"==Template.parentData().listType;
	},
	thisKitbag: function () {
		//return Template.parentData();
		return Template.currentData().thisKitbag;
		// console.log("listType",argument,Template.currentData() );
	},
	changeKitbagStatus: function () {
		var kbs = (this.kitbagStatus == "Active") ? "Hidden" : "Active";
		var icon = (kbs == "Active") ? "eye" : "eye-slash";
		var html = " Make "+kbs;
		return {'icon':icon, 'html':html};
	}
});

Template.kitbagLine.events({
	'click .showDetail': function(event) {
		// et = event.target;
		// console.log(et);
		// $( et.parentElement.parentElement ).children( '.kitbagDetails' ).toggle();
		var o = $(event.target).data("kitbag");
		FlowRouter.go("/kitbags/"+o+"/view");
		// $(".objView-"+o).toggle();
	},
	'click .edit': function(event) {
		// TODO: Don't set in global scope!
		// et = event.target;
		// console.log(et);
		// TODO: Replace this show/hide/toggle bit with a global view controller!
		// $('.screen-wrapper').hide();
		// $('.kitbagAddEdit').toggle();
		// var findOne = {kitbagId:event.target.dataset.kitbag};
		// var formId = "add-edit-kitbag";
		FlowRouter.go("/kitbags/"+event.target.dataset.kitbag+"/edit");
		// editKitbag(findOne,formId);
	},
	'click .toggle-checked': function(event) {
		var checked = event.target.checked;
		Meteor.call("updateKitbag",this._id,!this.checked);
	},
	'click .delete': function(event) {

		event.preventDefault();
		var areYouSure = "Are you sure you want to permanently delete kitbag '"+this.kitbagTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
		if ( confirm(areYouSure) ) {
			Meteor.call("deleteKitbag",this._id);
			// history.go(-1);
		} else {
			return false;
		}

	},
	'click .toggle-private': function(event){
		Meteor.call("setPrivateKitbag",this._id, !this.private);
	},
	'click .dropdown-menu a': function(event) {
		event.preventDefault();
		// console.log('a click: ',this,$(event.target).data('action'));
		var clickObj = {
			action: $(event.target).data('action'),
			kitbagId: $(event.target).data('kitbag'),
			kitbagObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.target).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
	}
});

// OTHER CONTENT AVAILABLE IN kitbagLine.js in OLD folder
