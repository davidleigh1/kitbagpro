// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';

import { Items } from '/imports/startup/both/item-schema.js';

import { appSettings } from '/imports/startup/both/sharedConstants.js';

// Meteor.publish("items",function() {
// 		// console.log('Publishing "items" from apis > items > server > publications.js!');
// 		updateItemCountsObj("onItemsPublished");
// 		return Items.find({});
// });


Meteor.publish("items",function() {
	// console.log('Publishing "orgs" from apis > orgs > server > publications.js!');

	console.log("---==----> Meteor.publish('items')");
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




// Meteor.publish("users", function(){
//   return Meteor.users.find({},{fields:{profile:1}})
// })

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
[ ] An 	existing	kitbag changes kitbagTitle (need to updated associated items)

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

// updateItem = function (requestor, userId, doc, fieldNames, modifier, options) {
// 	console.log("\nupdateItem() in /publications\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options, "\n\n");
// 	if (modifier) {

// 		modifier.$set = modifier.$set || {};

// 		/* Set New */
// 		modifier.$set["updatedAt"] = new Date();
// 		/* Delete Old */
// 		if (modifier.$unset) {
// 			delete modifier.$unset["updatedAt"];
// 		}

// 		/* Set New */
// 		modifier.$set["updatedBy"] = Meteor.userId() || "Unknown User";
// 		/* Delete Old */
// 		if (modifier.$unset) {
// 			delete modifier.$unset["updatedBy"];
// 		}

// 		modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.length : 0;
// 		// modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.count() : 0;
// 		console.log(typeof modifier.$set.assocKitbags, modifier.$set.assocKitbags, modifier.$set.assocKitbags.length );
// 	} else {
// 		console.log("updateItem() in /publications - No modifier found.")
// 	}

// 	if (requestor == "beforeItemInsert" && typeof doc == "object") {
// 		doc._id = doc.itemAssocOrg + "-" + doc.itemId;
// 		doc.createdAt = doc.createdAt || new Date();
// 		doc.createdBy = userId || Meteor.userId() || "Unknown User";
// 		doc.itemAssocKitbagCount = (typeof doc.assocKitbags == "object") ? doc.assocKitbags.length : 0;
// 	}


// };

updateAssocKitbagCountOnAddEdit = function (requestor, userId, doc, fieldNames, modifier, options) {
	/* Update associated Kitbag Count */
	console.log("=== updateAssocKitbagCountOnAddEdit ("+requestor+") =========================================");
	// console.log("\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options);
	// console.log( Orgs.findOne( {orgId: doc.kitbagAssocOrg}) );
	/* Then add our kitbagId to the orgAssocKitbagids array - and add a new array if one doesnt already exist */
	/* TODO - Shouldnt need to add a new array if SimpleSchema is handling that for us...  */
	try{
		// console.log("UPSERT {orgId: "+doc.kitbagAssocOrg+" (doc.kitbagAssocOrg)} , { $push: { orgAssocKitbagids: "+doc.kitbagId+" (doc.kitbagId) }}");
		// Orgs.direct.update( {orgId: doc.kitbagAssocOrg} , { $push: { orgAssocKitbagIds: doc.kitbagId }} );

		var kitbagCount = (typeof doc == "object" && typeof doc.assocKitbags == "object") ? assocKitbags.length : 0;

		// doc._id

		// console.log("modifier: ",requestor, doc, fieldNames, modifier, options);

		// Orgs.direct.update( {orgId: doc.kitbagAssocOrg} , { $push: { orgAssocKitbagCount: orgAssocKitbagCount.count() }} );
	} catch (err) {
		console.log("\n\nERROR: "+err+"\n\n");
		return false;
	}
	// console.log( Orgs.findOne( {orgId: doc.kitbagAssocOrg}) );
	console.log("=== /updateAssocKitbagCountOnAddEdit ========================================================");
};

/* AUTOMATED JOBS / HOOKS */

Items.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ITEMS.INSERT");
	/* Recalculate when new Kitbag is added */
	// updateKitbagCountsObj("onKitbagInserted",doc.kitbagTitle);
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
	/* Recalculate when new existing Kitbag changes kitbagStatus - which could well render it outside of the count criteria */
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