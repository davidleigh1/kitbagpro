// import { Session } from 'meteor/session'

import './itemView.html';
import './itemView.css';

import '/imports/ui/pages/kitbags/kitbagLine.js';
import '/imports/ui/pages/notFound/noListObjectsFound.js';

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Items } from '/imports/startup/both/item-schema.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/both/newItems.js';
import { listItemStatuses } from '/imports/api/items/items.js';

import '/imports/ui/components/urlImagePreviewRollover.html';


Template.itemView.onCreated(function() {
});


Template.itemView.onRendered(function(){

	// TODO: THIS IS UGLY! Need to find a way to check against a route name not template name
	// http://stackoverflow.com/questions/31006474/meteor-onrendered-doesnt-get-fired-again-after-second-render-iron-route

/*

	console.log("--- onRendered ------------------------------------------");
	console.log("FlowRouter: ",FlowRouter);
	console.log("getRouteName: " + FlowRouter.getRouteName());
	console.log("getParam: " + FlowRouter.getParam('_itemId'));
	console.log("getQueryParam: " + FlowRouter.getQueryParam());
	console.log("---------------------------------------------------------");
*/

	/* Check to see if the number of assigned Kitbags 'itemKbCount' (as maintained on the item document) is equal to the number of kitbags returned from the DB for this user. For non-SuperAdmin users, there would be no way to see an issue where an item was assigned to another organisation (to which they have no visibility) but the discrepency in the two counts would indicate an issue requiring attention  */
	if (int_itemBagsFound.get() != itemKbCount) {
		var message = "Error:\n\nA discrepency was found between the count on the item document ('itemAssocKitbagCount' = "+itemKbCount+") and the number of kitbags returned from the DB ('int_itemBagsFound' = "+int_itemBagsFound.get()+"). This could indicate kitbags or items are incorrectly associated to other orgs or objects. Please report this issue referencing Item ID: '"+FlowRouter.getParam('_itemId')+"'.";
		console.log(message);
		sAlert.error(message,{timeout: 'none'});
	}


});



// Template.myTemplateName.helpers
Template.itemView.helpers({
	isTrashed: function (itemId) {
		if (this.itemStatus.toLowerCase() == "trashed"){
			return true;
		} else {
			return false;
		}
	},
	assocKitbags: function () {
		/* Tidies up the assocKitbags array */
		/* TODO - Remove this if no longer required */
		var arr = this.assocKitbags;
		var prefix = "<code>";
		var joiner = "</code>, <code>";
		var suffix = "</code>";
		if (typeof arr != "object" || arr.length <= 0) {
			return false;
		} else {
			return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
		}
	},
	assocKitbags_BAK: function () {
		/* Tidies up the assocKitbags array */
		/* TODO - Remove this if no longer required */
		var newArray = [];
		if (typeof this.assocKitbags != "object" || this.assocKitbags.length <= 0) {
			return false;
		} else {
			$.each( this.assocKitbags , function( key, assignedBag ) {
				newArray.push({
					assignedBag:	assignedBag,
					kitbag_id: 		assignedBag.split("_")[0],
					kitbagId: 		assignedBag.split("_")[1],
					kitbagTitle: 	assignedBag.split("_")[2]
				})
			});
			console.log("assocKitbags()",newArray);
			return newArray;
		}
	},
	thisItem: function (thisItemId) {
		var myItem = Items.findOne({itemId: FlowRouter.getParam('_itemId') });
		//console.log("itemProfile",myItem);
		/* TODO - Find a better way to store/pass this value for checking once the int_itemBagsFound value is loaded */
		itemKbCount = myItem.itemAssocKitbagCount;
		return myItem;
	},
	thisKitbag: function (kitbagId) {
		// return Template.currentData().thisKitbag;
		// var myKitbag = Kitbags.findOne({_id: kitbag_id});
		var myKitbag = Kitbags.findOne({kitbagId: ""+kitbagId});
		return myKitbag;
	},
	joinTextInList: function (t1="",t2="",t3="",t4="",t5="") {
		// console.log("joinTextInList",t1,t2,t3,t4,t5);
		var newText = ((typeof t1=="string" && t1!="")?t1:"") + ((typeof t2=="string" && t2!="")?t2:"") + ((typeof t3=="string" && t3!="")?t3:"") + ((typeof t4=="string" && t4!="")?t4:"") + ((typeof t5=="string" && t5!="")?t5:"");
		return Spacebars.SafeString(newText);
	},
	// TODO - Is this used???
	// itemAssocKitbagIds: function () {
	// 	/* Tidies up the itemAssocKitbagIds array */
	// 	var arr = this.itemAssocKitbagIds;
	// 	var prefix = "<code>";
	// 	var joiner = "</code><br><code>";
	// 	var suffix = "</code>";
	// 	if (typeof arr != "object" || arr.length <= 0) {
	// 		return false;
	// 	} else {
	// 		return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
	// 	}
	// },
    toLower: function (str) {
      // console.log(str,str.toLowerCase());
      if (!str) { return str }
      return str.toLowerCase();
    },
	userNameLookup: function (userId, paramRequired) {
		var myUser = Meteor.users.findOne({_id: userId });
		// Items.findOne({itemId: FlowRouter.getParam('_itemId') });
		// console.log("myUser",myUser.profile.displayName);

		var data = {};
		data.uname = (myUser && myUser.profile.displayName)?myUser.profile.displayName:"Profile Name not found";
		data.dbId  = userId;
		data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
		data.url   = "/users/"+userId+"/view";
		data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

		return Spacebars.SafeString( data[paramRequired] );
	},
	noFilter: function () {
		// There is no user filter in minilists - so we just return a null value for objectsFiltered()
		return;
	},
	minilistFilter: function () {

		var newArray = [];
		if (typeof this.assocKitbags != "object" || this.assocKitbags.length <= 0) {
			return false;
		} else {
			$.each( this.assocKitbags , function( key, assignedBag ) {
				newArray.push( assignedBag );
			});
			// console.log("minilistFilter()",newArray);
		}

		return { "kitbagId": { $in: newArray } }

	}
});


// Template.myTemplateName.events
Template.itemView.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	},
	'click li.setItemStatus': function(event,a,b) {
		event.preventDefault();
		// var newStatus = event.target.categ.dataset.getAttribute('data-id')
		var field = "itemStatus";
		// newEvent = event;
		var parent = event.target.parentElement;
		var newValue = event.target.parentElement.getAttribute("data-status");
		console.log("EVENT updateItemField",this._id,field,newValue,parent);
		// Meteor.call("updateItemField",this._id,field,newValue);
	},
	'click .btn.trash': function(event) {
		event.preventDefault();
		var areYouSure = "Are you sure you want to trash item '"+this.itemTitle+"'?\n(ItemId: "+this.itemId+")";
		if ( confirm(areYouSure) ) {
			Meteor.call("setItemStatus",this._id, "Trashed");
		} else {
			return false;
		}
	},
	'click .btn.delete': function(event,a,b) {
		event.preventDefault();
		// console.log(this,a,b);

		var areYouSure = "Are you sure you want to permanently delete item '"+this.itemTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
		if ( confirm(areYouSure) ) {
			Meteor.call("deleteItem",this._id);
			// history.go(-1);
			FlowRouter.go("/items/list");
		} else {
			return false;
		}

	}
});