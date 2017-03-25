// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
import { Admin } from '/imports/api/admin/admin.js';


/* PARAMETERS */
	var console_prefix = "PUB: 'kitbags' - ";

/* PUBLISH */
Meteor.publish("kitbags", function() {
	console.log(console_prefix + "Meteor.publish('kitbags') ---------------------------");
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
		var insertSuccess = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $push: { assocKitbagIds: doc._id } }
		);
		/* TODO: Better error handling if push fails */

		if (insertSuccess) {
			console.log("EVT: User '", userId, "' successfully associated a new kitbag '", doc.title, "' (", doc._id, ") with org '", doc.assocOrgId, "'");
		} else {
			var errorText = "Error: User '"+ userId+ "' unsuccessfully attempted to add new kitbag '"+ doc.title+ "' ("+ doc._id+ ") associated with org '"+ doc.assocOrgId+ "'. Server error at 'Kitbags.after.insert' hook";
			var errorId = " [Error 940]";
			console.log("ERROR: ", errorText + errorId)
			throw new Meteor.Error(940, "Unable to add new kitbag");
		}

	/* Update Kitbag Count for associated Org */
		var updateCountSuccess = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $inc: { assocKitbagCount: 1 } }
		);

		if (updateCountSuccess) {
			console.log("UPD: org: "+ doc.assocOrgId+ " updated assocKitbagCount to: "+kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount);
		} else {
			var errorText2 = "Error: Unable to increment 'assocKitbagCount'. Server error at 'Kitbags.after.insert' hook";
			var errorId2 = " [Error 941]";
			console.log(errorText2 + errorId2);
			// throw new Meteor.Error(941, errorText2);
			/* TODO - Should be a global function for sAlerts! */
			// sAlert.warning(errorText2 + errorId2, {
			// 	html: true,
			// 	timeout: appSettings.sAlert.longTimeout
			// });
		}

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
		var updateCountSuccess = kb.collections["Orgs"].direct.update(
			{ _id: doc.assocOrgId },
			{ $inc: { assocKitbagCount: -1 } }
		);

		if (updateCountSuccess) {
			console.log("UPD: org: ", doc.assocOrgId, " updated assocKitbagCount to: ",kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount);
		} else {
			var errorText2 = "Error: Unable to increment 'assocKitbagCount'. Server error at 'Kitbags.after.remove' hook";
			var errorId2 = " [Error 1033]";
			console.log(errorText2 + errorId2);
			// throw new Meteor.Error(1033, errorText2);
			/* TODO - Should be a global function for sAlerts! */
			// sAlert.warning(errorText2 + errorId2, {
			// 	html: true,
			// 	timeout: appSettings.sAlert.longTimeout
			// });


		}

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