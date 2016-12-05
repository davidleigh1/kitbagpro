import './itemLine.html';
import './itemLine.css';
import './changeItemStatus.html';

import { Items } from '/imports/startup/both/item-schema.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';


trashItem = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setItemStatus",clickObj.itemObj._id, "Trashed");
};


Template.itemLine.helpers({
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
		// Items.findOne({itemId: FlowRouter.getParam('_itemId') });
		// console.log("myUser",myUser.profile.displayName);

		var data = {};
		data.uname = (myUser && myUser.profile.displayName)?myUser.profile.displayName:"Name not found";
		data.dbId  = userId;
		data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
		data.url   = "/users/"+userId+"/view";
		data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

		return Spacebars.SafeString( data[paramRequired] );
	}
});

Template.itemLine.events({
	'click .showDetail': function(event) {
		// et = event.target;
		// console.log(et);
		// $( et.parentElement.parentElement ).children( '.itemDetails' ).toggle();
		var o = $(event.target).data("item");
		FlowRouter.go("/items/"+o+"/view");
		// $(".objView-"+o).toggle();
	},
	'click .edit': function(event) {
		// TODO: Don't set in global scope!
		// et = event.target;
		// console.log(et);
		// TODO: Replace this show/hide/toggle bit with a global view controller!
		// $('.screen-wrapper').hide();
		// $('.itemAddEdit').toggle();
		// var findOne = {itemId:event.target.dataset.item};
		// var formId = "add-edit-item";
		FlowRouter.go("/items/"+event.target.dataset.item+"/edit");
		// editItem(findOne,formId);
	},
	'click .toggle-checked': function(event) {
		var checked = event.target.checked;
		Meteor.call("updateItem",this._id,!this.checked);
	},
	'click .delete': function(event) {

		event.preventDefault();
		var areYouSure = "Are you sure you want to permanently delete item '"+this.itemTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
		if ( confirm(areYouSure) ) {
			Meteor.call("deleteItem",this._id);
			// history.go(-1);
		} else {
			return false;
		}

	},
	'click .toggle-private': function(event){
		Meteor.call("setPrivateItem",this._id, !this.private);
	},
	'click .dropdown-menu a': function(event) {
		event.preventDefault();
		// console.log('a click: ',this,$(event.target).data('action'));
		var clickObj = {
			action: $(event.target).data('action'),
			itemId: $(event.target).data('item'),
			itemObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.target).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
	}
});

