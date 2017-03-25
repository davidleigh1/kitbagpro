/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	import './view.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/kitbags/line.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';
	import '/imports/ui/components/urlImagePreviewRollover.html';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollectionName = "Items";
	var thisAction = "view";
	var thisUrlId = "_itemId";

/* ONCREATED */
	Template.itemView.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
	Template.itemView.onRendered(function(){
		/* Check to see if the number of assigned Kitbags 'itemKbCount' (as maintained on the item document)
		is equal to the number of kitbags returned from the DB for this user. For non-SuperAdmin users,
		there would be no way to see an issue where an item was assigned to another organisation
		(to which they have no visibility) but the discrepency in the two counts would indicate an issue
		requiring attention */
		// if (int_itemBagsFound.get() != itemKbCount) {
		// 	var message = "Error:\n\nA discrepency was found between the count on the item document ('assocKitbagCount' = "+itemKbCount+") and the number of kitbags returned from the DB ('int_itemBagsFound' = "+int_itemBagsFound.get()+"). This could indicate kitbags or items are incorrectly associated to other orgs or objects. Please report this issue referencing Item ID: '"+FlowRouter.getParam('_itemId')+"'.";
		// 	console.log(message);
		// 	sAlert.error(message,{timeout: 'none'});
		// }
	});


/* TEMPLATE HELPERS */
	Template.itemView.helpers({
		assocKitbagsArray: function () {
			/* Tidies up the assocKitbags array */
			/* TODO - Remove this if no longer required */
			var arr = this.assocKitbagsArray;
			var prefix = "<code>";
			var joiner = "</code><br><code>";
			var suffix = "</code>";
			if (typeof arr != "object" || arr.length <= 0) {
				return false;
			} else {
				return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
			}
		},
		// assocKitbags_BAK: function () {
		// 	/* Tidies up the assocKitbags array */
		// 	/* TODO - Remove this if no longer required */
		// 	var newArray = [];
		// 	if (typeof this.assocKitbags != "object" || this.assocKitbags.length <= 0) {
		// 		return false;
		// 	} else {
		// 		$.each( this.assocKitbags , function( key, assignedBag ) {
		// 			newArray.push({
		// 				assignedBag:	assignedBag,
		// 				kitbag_id: 		assignedBag.split("_")[0],
		// 				kitbagId: 		assignedBag.split("_")[1],
		// 				title: 	assignedBag.split("_")[2]
		// 			})
		// 		});
		// 		console.log("assocKitbags()",newArray);
		// 		return newArray;
		// 	}
		// },
		thisItem: function ( thisItemId = FlowRouter.getParam('_itemId') ) {
			// var myItem = kb.collections[thisCollectionName].findOne({itemId: FlowRouter.getParam('_itemId') });
			var myItem = kb.collections.Items.findOne( thisItemId );
			// console.log("\n\n", "thisItem() - ", thisItemId, myItem, "\n\n\n")
			//console.log("itemProfile",myItem);
			/* TODO - Find a better way to store/pass this value for checking once the int_itemBagsFound value is loaded */
			// itemKbCount = myItem.assocKitbagCount;
			return myItem;
		},
		thisKitbag: function (kitbag_id) {
			var myKitbag = kb.collections.Kitbags.findOne( kitbag_id );
			// TODO: Can we delete this?
			console.log("\n\n\n", "thisKitbag() - ", thisKitbag ,"\n\n\n")

			return myKitbag;
		},
		noFilter: function () {
			// There is no user filter in minilists - so we just return a null value for objectsFiltered()
			return;
		},
		// minilistFilter: function () {
		minilistFilter_assocKitbags: function () {

			/* This is a specific (per template) version of this function */

			var newArray = [];
			if (typeof this.assocKitbagsArray != "object" || this.assocKitbagsArray.length <= 0) {
				return false;
			} else {
				// $.each( this.assocKitbagsArray , function( key, assignedBag ) {
				// 	newArray.push( assignedBag );
				// });
				// return { "kitbagId": { $in: newArray } }
				return { "_id": { $in: this.assocKitbagsArray } }
			}


		}
	});


/* EVENTS */
	Template.itemView.events({
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