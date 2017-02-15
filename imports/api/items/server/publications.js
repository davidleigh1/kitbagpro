// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';

import { Admin } from '/imports/api/admin/admin.js';

import { Items } from '/imports/startup/both/item-schema.js';


Meteor.publish("items",function() {

	console.log("PUBLISH: Meteor.publish('items')");
	if (this.userId) {

		var searchObj;

		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"profile.userAssocOrg": 1, "profile.userType": 1}});

		if (typeof orgObj == "object" && typeof orgObj.profile == "object") {

			if (orgObj.profile.userType.toLowerCase() == "superadmin") {
				console.log("---==----> orgId ('userAssocOrg'): ", orgId);
				console.log("---==---->");
				console.log("---==----> SuperAdmin FOUND!!!!!!");
				console.log("---==---->");
				searchObj = {};
			} else {
				var orgId = orgObj.profile.userAssocOrg;
				console.log("---==----> orgId ('userAssocOrg'): ", orgId);
				searchObj = { "itemAssocOrg" : orgId };
			}

		} else {
			console.log("---==---->Meteor.publish('items') - no org object or obj.profile object found");
			return null;
		}

	} else {
		console.log("---==---->Meteor.publish('items') - no userId found");
		return null;
	}
	updateItemCountsObj("onItemsPublished");
	return Items.find(searchObj);
});


/*

We need to trigger jobs to update Item-related calculated fields in response to the following events:
[X] A 	new 		item is added via form (and in the future via import)
[ ] An 	existing	item changes associatedOrg (this should only be possible by SuperAdmin)
[X] An 	existing	item changes associatedKitbag
[ ] An 	existing	item changes status (especially if it changes into or out of the list of active statuses)
[ ] An 	existing	item is deleted (deleted by SuperAdmin rather than trashing - which is only a change of status)
[ ] An 	existing	item changes itemId (need to updated associated kitbags)
[ ] An 	existing	item changes itemTitle (need to updated associated kitbags)
[ ] An 	existing	kitbag changes status (especially if it changes into or out of the list of active statuses)
[ ] An 	existing	kitbag changes kitbagId (need to updated associated items)
[ ] An 	existing	kitbag changes title (need to updated associated items)

Item-related counts include:

admin.countAll
admin.countActive
admin.countHidden
admin.countRetired
admin.countTrashed
items.assocKitbags [array rather than count]
items.itemAssocKitbagCount

*/

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */

updateItemCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	/* Combined function replacing ALL+ACTIVE+HIDDEN */
	var countAll     = Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInAllCount } 		}).count();
	var countActive  = Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allItems': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeItems': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenItems': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedItems': countTrashed } }, { upsert: true } );

	console.log("Updated Item Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);

};


updateAssocKitbagCountOnAddEdit = function (requestor, userId, doc, fieldNames, modifier, options) {
	/* Update associated Kitbag Count */
	console.log("=== updateAssocKitbagCountOnAddEdit ("+requestor+") =========================================");

	/* Then add our kitbagId to the orgAssocKitbagids array - and add a new array if one doesnt already exist */
	/* TODO - Shouldnt need to add a new array if SimpleSchema is handling that for us...  */
	try{

		var kitbagCount = (typeof doc == "object" && typeof doc.assocKitbags == "object") ? assocKitbags.length : 0;

	} catch (err) {
		console.log("\n\nERROR: "+err+"\n\n");
		return false;
	}
	console.log("=== /updateAssocKitbagCountOnAddEdit ========================================================");
};

/* AUTOMATED JOBS / HOOKS */

Items.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ITEMS.INSERT");
	/* Recalculate when new Kitbag is added */
	// updateKitbagCountsObj("onKitbagInserted",doc.title);
	/* Update associated Org when new Kitbag is added */
	// updateAssocOrgOnAddEdit("onKitbagInserted",userId, doc, fieldNames, modifier);
});
Items.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ITEMS.REMOVE");
	/* Recalculate when new Kitbag is added */
	// updateKitbagCountsObj("onKitbagRemoved",userId, doc, fieldNames, modifier);
});

Items.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ITEMS.UPDATE");
	/* Recalculate when new existing Kitbag changes status - which could well render it outside of the count criteria */
	// updateKitbagCountsObj("onKitbagUpdate",userId, doc, fieldNames, modifier);
	/* Update associated Kitbag Count */
	// updateAssocKitbagCountOnAddEdit("onItemUpdate",userId, doc, fieldNames, modifier);
});

Items.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE ITEMS.INSERT");
	/* Update associated Kitbag Count */
	globalBeforeInsertHook("beforeItemInsert", userId, doc, fieldNames, modifier, options);
});

Items.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE ITEMS.UPDATE");
	/* Update associated Kitbag Count */
	// updateItem("beforeItemUpdate", userId, doc, fieldNames, modifier, options);
	globalBeforeUpdateHook("beforeItemUpdate", userId, doc, fieldNames, modifier, options);
});