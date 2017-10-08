// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
import { Admin } from '/imports/api/admin/admin.js';


/* PARAMETERS */
	var console_prefix = "PUB: 'items' - ";

/* PUBLISH */
Meteor.publish("items", function() {
	console.log(console_prefix + "Meteor.publish('items') ---------------------------");
	if (this.userId) {
		var searchObj;
		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"assocOrgId": 1, "type": 1}});
		if (typeof orgObj == "object") {

			if (orgObj.type && orgObj.type.toLowerCase() == "superadmin") {
				console.log(console_prefix + "SuperAdmin found");
				searchObj = {};
			} else {
				var orgId = orgObj.assocOrgId;
				searchObj = { "assocOrgId" : orgId };
			}
		} else {
			console.log(console_prefix + "Error - No org object found");
			return null;
		}
	} else {
		console.log(console_prefix + "Error - No userId found");
		return null;
	}
	updateGlobalItemCountsObj("onItemsPublished");
	return kb.collections.Items.find(searchObj);
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

updateGlobalItemCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	console.log("FN: updateGlobalItemCountsObj()");
	/* Combined function replacing ALL+ACTIVE+HIDDEN */
	var countAll     = kb.collections.Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInAllCount } 		}).count();
	var countActive  = kb.collections.Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = kb.collections.Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = kb.collections.Items.find( { itemStatus: { $in: appSettings.items.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allItems': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeItems': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenItems': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedItems': countTrashed } }, { upsert: true } );

	console.log("UPD: updateGlobalItemCountsObj() - Updated Item Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);
};


	// updateAssocKitbagCountOnAddEdit = function (requestor, userId, doc, fieldNames, modifier, options) {
	// 	/* Update associated Kitbag Count */
	// 	console.log("=== updateAssocKitbagCountOnAddEdit ("+requestor+") =========================================");

	// 	/* Then add our kitbagId to the orgAssocKitbagids array - and add a new array if one doesnt already exist */
	// 	 TODO - Shouldnt need to add a new array if SimpleSchema is handling that for us...  
	// 	try{

	// 		var kitbagCount = (typeof doc == "object" && typeof doc.assocKitbags == "object") ? assocKitbags.length : 0;

	// 	} catch (err) {
	// 		console.log("\n\nERROR: "+err+"\n\n");
	// 		return false;
	// 	}
	// 	console.log("=== /updateAssocKitbagCountOnAddEdit ========================================================");
	// };


/***************************************************************************/
/* COLLECTION HOOKS using https://atmospherejs.com/matb33/collection-hooks */
/***************************************************************************/

/* BEFORE */

kb.collections.Items.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE ITEMS.INSERT");

	if (doc && !doc.distributionToKitbags && doc.assocKitbagsArray.length > 0 && !modifier) {

		/* Add distributionToKitbags Object */
		console.log("Adding distributionToKitbags Object");
		doc.distributionToKitbags = {};
		doc.assocKitbagsArray.forEach(function (kitbagId, key) {
		// jQuery.each(doc.assocKitbagsArray, function(index, kitbagId) {
			doc.distributionToKitbags[ kitbagId ] = {
				"qInitialAssign": doc.qRecommended || kb.collections.Kitbags.findOne(kitbagId)["qRecommended"]
			}
			console.log("Added 'qInitialAssign' of "+doc.distributionToKitbags[ kitbagId ].qInitialAssign+" to kitbag: "+kitbagId);
		});

	}

	/* Update associated Kitbag Count */
	globalBeforeInsertHook("beforeItemInsert", userId, doc, fieldNames, modifier, options);
});

kb.collections.Items.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE ITEMS.UPDATE");

	if (modifier && !modifier.$set.distributionToKitbags && modifier.$set.assocKitbagsArray.length > 0 ) {
		/* Add distributionToKitbags Object */
		console.log("Copying distributionToKitbags object from doc to modifier.$set (was missing!)");
		modifier.$set.distributionToKitbags = doc.distributionToKitbags;
	} else {
		modifier.distributionToKitbags = {};
	}

	/* REVERSING ORDER TO CHECK DISTRIBTION FIRST TO REMOVE ANY KITBAGS WHICH ARE NOW REMOVED FROM ASSOCKITBAGARRAY */


	// _.each( modifier.$set.distributionToKitbags, function (distributionKitbagId, distributionObj) {
	Object.keys( modifier.$set.distributionToKitbags ).forEach(function (distributionKitbagId, index) {
		// modifier.$set.distributionToKitbags.forEach(function (kitbagId, key) {
		// if ( modifier.$set.assocKitbagsArray.find( distributionKitbagId )  ){
		if ( modifier.$set.assocKitbagsArray.indexOf( distributionKitbagId ) > -1 ){
			console.log("OK! Kitbag (" + distributionKitbagId + ") found in 'distributionToKitbags' and 'assocKitbagsArray'");
			return;
		} else {
			console.log("NO LONGER ASSOCIATED! Kitbag (" + distributionKitbagId + ") was not found in 'assocKitbagsArray'.  Will remove from 'distributionToKitbags'");
			console.log( JSON.stringify( modifier.$set.distributionToKitbags) );
			delete modifier.$set.distributionToKitbags[ distributionKitbagId ];
			console.log( JSON.stringify( modifier.$set.distributionToKitbags) );
		}
	});

	/* NOW CHECK ASSOCKITBAGS TO ENSURE ALL KITBAGS ARE ALSO IN DISTRIBUTION OBJECT */

	modifier.$set.assocKitbagsArray.forEach(function (kitbagId, key) {
		console.log(kitbagId, key);
		if ( modifier.$set.distributionToKitbags[ kitbagId ]  ){
			console.log("Kitbag (" + kitbagId + ") already exists in 'distributionToKitbags'");
			return;
		} else {
			console.log("Kitbag (" + kitbagId + ") not found.  Adding to 'distributionToKitbags'");
			modifier.$set.distributionToKitbags[ kitbagId ] = {
				"qInitialAssign": modifier.$set.qRecommended || kb.collections.Kitbags.findOne(kitbagId)["qRecommended"]
			}
			console.log("Added 'qInitialAssign' of "+modifier.$set.distributionToKitbags[ kitbagId ] && modifier.$set.distributionToKitbags[ kitbagId ].qInitialAssign+" to kitbag: "+kitbagId);
		}
	});


/* Update associated Kitbag Count */
	globalBeforeUpdateHook("beforeItemUpdate", userId, doc, fieldNames, modifier, options);
});

/* AFTER */

kb.collections.Items.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER ITEMS.INSERT");
	/* Recalculate when new Kitbag is added */
	updateGlobalItemCountsObj("onItemInserted",doc.title);
	/* Update associated Org when new Kitbag is added */
	// updateAssocOrgOnAddEdit("onKitbagInserted",userId, doc, fieldNames, modifier);
});
kb.collections.Items.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER ITEMS.REMOVE");
	/* Recalculate when new Kitbag is added */
	updateGlobalItemCountsObj("onItemRemoved",userId, doc, fieldNames, modifier);
});

kb.collections.Items.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER ITEMS.UPDATE");
	/* Recalculate when new existing Kitbag changes status - which could well render it outside of the count criteria */
	// updateKitbagCountsObj("onKitbagUpdate",userId, doc, fieldNames, modifier);
	/* Update associated Kitbag Count */
	updateGlobalItemCountsObj("onItemUpdated",userId, doc, fieldNames, modifier);
	// updateAssocKitbagCountOnAddEdit("onItemUpdate",userId, doc, fieldNames, modifier);

		var updateCount = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $inc: { assocKitbagCount: -1 } }
		);


	
});