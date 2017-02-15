// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
import { Admin } from '/imports/api/admin/admin.js';


/* PARAMETERS */

var console_prefix = "publish 'kitbags' : ";

/* PUBLISH */

Meteor.publish("kitbags",function() {
	// console.log('Publishing "kitbags" from apis > kitbags > server > publications.js!');
	console.log(console_prefix + "-----------------------------------------------------");
	console.log(console_prefix + "Meteor.publish('kitbags')");
	if (this.userId) {

		var searchObj;

		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"profile.userAssocOrg": 1, "profile.userType": 1}});

		if (typeof orgObj == "object" && typeof orgObj.profile == "object") {

			if (orgObj.profile.userType.toLowerCase() == "superadmin") {
				console.log("====> orgId ('userAssocOrg'): ", orgId);
				console.log("====>");
				console.log("====> SuperAdmin FOUND!!!!!!");
				console.log("====>");
				searchObj = {};
			} else {
				var orgId = orgObj.profile.userAssocOrg;
				console.log("====> orgId ('userAssocOrg'): ", orgId);
				searchObj = { "assocOrgId" : orgId };
			}

		} else {
			console.log("Meteor.publish('kitbags') - no org object or obj.profile object found");
			return null;
		}

	} else {
		console.log("Meteor.publish('kitbags') - no userId found");
		return null;
	}
	updateGlobalKitbagCountsObj("onKitbagsPublished");
	return kb.collections.Kitbags.find(searchObj);
});

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */

updateGlobalKitbagCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	/* Combined function replacing ALL+ACTIVE+HIDDEN */

	var countAll     = kb.collections.Kitbags.find( { status: { $in: appSettings.kitbags.statusesIncludedInAllCount } 	    }).count();
	var countActive  = kb.collections.Kitbags.find( { status: { $in: appSettings.kitbags.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = kb.collections.Kitbags.find( { status: { $in: appSettings.kitbags.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = kb.collections.Kitbags.find( { status: { $in: appSettings.kitbags.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allKitbags': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeKitbags': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenKitbags': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedKitbags': countTrashed } }, { upsert: true } );

	console.log("UPD: updateGlobalKitbagCountsObj() - Updated Kitbag Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);
};


/***************************************************************************/
/* COLLECTION HOOKS using https://atmospherejs.com/matb33/collection-hooks */
/***************************************************************************/

/* BEFORE */

kb.collections.Kitbags.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE KITBAGS.INSERT");
	globalBeforeInsertHook("beforeKitbagInsert", userId, doc, fieldNames, modifier, options);
});

kb.collections.Kitbags.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE KITBAGS.UPDATE");
	globalBeforeUpdateHook("beforeKitbagUpdate", userId, doc, fieldNames, modifier, options);
});

/* AFTER */

kb.collections.Kitbags.after.insert(function (userId = "unknown", doc, fieldNames, modifier) {
	console.log("HOOK: AFTER KITBAGS.INSERT");

	/* Update Kitbag List for associated Org */
	/* Use of .direct avoids the update hooks firing for this Org update */
		var pushed = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $push: { assocKitbagIds: doc._id } }
		);
		/* TODO: Better error handling if push fails */
		console.log("EVT: user: ", userId, "successfully associated new kitbag: ", doc._id, "with org: ", doc.assocOrgId);

	/* Update Kitbag Count for associated Org */
		var updateCount = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $inc: { assocKitbagCount: 1 } }
		);
		console.log("UPD: org: ", doc.assocOrgId, " updated assocKitbagCount to: ",kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount );

	/* Recalculate when new Kitbag is added */
		updateGlobalKitbagCountsObj("onKitbagInserted",doc.title);
});
kb.collections.Kitbags.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER KITBAGS.REMOVE");

	/* Update Org for associated Kitbag */
	/* Use of .direct avoids the update hooks firing for this Org update */
		var pulled = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $pull: { assocKitbagIds: doc._id } }
		);
		/* TODO: Better error handling if pull fails */
		console.log("EVT: user: ", userId, "successfully removed kitbag: ", doc._id, "from org: ", doc.assocOrgId);

	/* Update Kitbag Count for associated Org */
		var updateCount = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $inc: { assocKitbagCount: -1 } }
		);
		console.log("UPD: org: ", doc.assocOrgId, " updated assocKitbagCount to: ",kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount );

	/* Recalculate when new Kitbag is added */
		updateGlobalKitbagCountsObj("onKitbagRemoved",userId, doc, fieldNames, modifier);
});
kb.collections.Kitbags.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER KITBAGS.UPDATE");
	/* Recalculate when new existing Kitbag changes status - which could well render it outside of the count criteria */
	updateGlobalKitbagCountsObj("onKitbagUpdate",userId, doc, fieldNames, modifier);
	/* Update associated Org when new Kitbag is edited */
	// updateAssocOrgOnAddEdit("onKitbagUpdate",userId, doc, fieldNames, modifier);
});