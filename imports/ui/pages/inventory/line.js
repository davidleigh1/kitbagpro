/* IMPORT PAGE COMPONENTS */
	import './line.html';
	import './line.css';
	import './changeStatus.html';


/* IMPORT PROJECT OBJECTS */
	import { kb } from '/imports/startup/both/sharedConstants.js';


/* PARAMETERS */
	var thisCollectionName = "Items";


/* UTIL FUNCTIONS */
	trashItem = function (clickObj) {
		// Required - Called from Action Menu
		globalTrash("TrashedByUser", thisCollectionName, clickObj.itemObj, Meteor.userId(), "#");
	};

	// trashItem = function (clickObj) {
	// 	// console.log('deleteKb: ',clickObj);
	// 	Meteor.call("setItemStatus",clickObj.itemObj._id, "Trashed");
	// };


/* HELPERS */
	Template.inventoryLine.helpers({
		isItemList: function () {
			/*
			NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
			All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
			*/
			return "itemList"==Template.parentData().listType;
		},
		lookupUser: function (userId,reqField) {
			console.log("lookupUser: ",userId);
			var uname = GlobalHelpers.lookupNameFromUser(userId,reqField);
			console.log("lookupUser: ",uname);
			return uname;
		}
	});


/* EVENTS */
Template.inventoryLine.events({
	/* See: http://stackoverflow.com/questions/22962386/ for use of 'event.currentTarget' */
	'click .showDetail': function(event) {
		// var o = $(event.target).data("item");
		var o = event.currentTarget.dataset.item;
		FlowRouter.go("/"+ thisCollectionName.toLowerCase() +"/"+o+"/view");
	},
	'click .edit': function(event) {
		/* See: http://stackoverflow.com/questions/22962386/ for use of 'event.currentTarget' */
		FlowRouter.go("/"+ thisCollectionName.toLowerCase() +"/"+event.currentTarget.dataset.item+"/edit");
	},
	'click .toggle-checked': function(event) {
		var checked = event.currentTarget.checked;
		Meteor.call("updateItem",this._id,!this.checked);
	},
	'click .delete': function(event) {
		event.preventDefault();
		var skipUserConfirmation;
			if (event.shiftKey) {
				console.log("shift key was down!!!");
				skipUserConfirmation = true;
			}		
		globalDelete("DeletedByUser/Inventory", thisCollectionName, this, Meteor.userId(), "/"+ thisCollectionName.toLowerCase() +"/list", skipUserConfirmation);
	},
	'click .toggle-private': function(event){
		Meteor.call("setPrivateItem",this._id, !this.private);
	},
	'click .dropdown-menu a': function(event) {
		event.preventDefault();
		// console.log('a click: ',this,$(event.target).data('action'));
		var clickObj = {
			action: $(event.currentTarget).data('action'),
			itemId: $(event.currentTarget).data('item'),
			itemObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.currentTarget).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
	}
});

