// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
import { Admin } from '/imports/api/admin/admin.js';


/* PARAMETERS */
	var console_prefix = "PUB: 'inventory' - ";

/* PUBLISH */
Meteor.publish("inventory", function() {
	console.log(console_prefix + "Meteor.publish('inventory') ---------------------------");
	if (this.userId) {
		return kb.collections.inventory.find( this.userId );
	} else {
		console.log(console_prefix + "Error - No userId found");
		return null;
	}
});

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */


/***************************************************************************/
/* COLLECTION HOOKS using https://atmospherejs.com/matb33/collection-hooks */
/***************************************************************************/

/* BEFORE */

kb.collections.inventory.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE INVENTORY.INSERT");
	globalBeforeInsertHook("beforeInventoryInsert", userId, doc, fieldNames, modifier, options);
});

kb.collections.inventory.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE INVENTORY.UPDATE");
	globalBeforeUpdateHook("beforeInventoryUpdate", userId, doc, fieldNames, modifier, options);
});

/* AFTER */

kb.collections.inventory.after.insert(function (userId = "unknown", doc, fieldNames, modifier) {
	console.log("HOOK: AFTER INVENTORY.INSERT");

	/* Update Kitbag List for associated Org */
	/* Use of .direct avoids the update hooks firing for this Org update */
		// var insertSuccess = kb.collections["Orgs"].direct.update(
		// 	{ _id: doc.assocOrgId },
		// 	{ $push: { assocKitbagIds: doc._id } }
		// );
		/* TODO: Better error handling if push fails */

		// if (insertSuccess) {
		// 	console.log("EVT: User '", userId, "' successfully associated a new kitbag '", doc.title, "' (", doc._id, ") with org '", doc.assocOrgId, "'");
		// } else {
		// 	var errorText = "Error: User '"+ userId+ "' unsuccessfully attempted to add new kitbag '"+ doc.title+ "' ("+ doc._id+ ") associated with org '"+ doc.assocOrgId+ "'. Server error at 'inventory.after.insert' hook";
		// 	var errorId = " [Error 940]";
		// 	console.log("ERROR: ", errorText + errorId)
		// 	throw new Meteor.Error(940, "Unable to add new kitbag");
		// }

	/* Update Kitbag Count for associated Org */
		// var updateCountSuccess = kb.collections["Orgs"].direct.update(
		// 	{ _id: doc.assocOrgId },
		// 	{ $inc: { assocKitbagCount: 1 } }
		// );

		// if (updateCountSuccess) {
		// 	console.log("UPD: org: "+ doc.assocOrgId+ " updated assocKitbagCount to: "+kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount);
		// } else {
		// 	var errorText2 = "Error: Unable to increment 'assocKitbagCount'. Server error at 'inventory.after.insert' hook";
		// 	var errorId2 = " [Error 941]";
		// 	console.log(errorText2 + errorId2);
		// }
});

kb.collections.inventory.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER INVENTORY.REMOVE");

	/* Update Org for associated Kitbag */
	/* Use of .direct avoids the update hooks firing for this Org update */
		// var pulled = kb.collections["Orgs"].direct.update(
		// 	{ _id: doc.assocOrgId },
		// 	{ $pull: { assocKitbagIds: doc._id } }
		// );
		// /* TODO: Better error handling if pull fails */
		// console.log("EVT: user: ", userId, "successfully removed kitbag: ", doc._id, "from org: ", doc.assocOrgId);

	/* Update Kitbag Count for associated Org */
		// var updateCountSuccess = kb.collections["Orgs"].direct.update(
		// 	{ _id: doc.assocOrgId },
		// 	{ $inc: { assocKitbagCount: -1 } }
		// );

		// if (updateCountSuccess) {
		// 	console.log("UPD: org: ", doc.assocOrgId, " updated assocKitbagCount to: ",kb.collections["Orgs"].findOne(doc.assocOrgId).assocKitbagCount);
		// } else {
		// 	var errorText2 = "Error: Unable to increment 'assocKitbagCount'. Server error at 'inventory.after.remove' hook";
		// 	var errorId2 = " [Error 1033]";
		// 	console.log(errorText2 + errorId2);
		// }
});

kb.collections.inventory.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("HOOK: AFTER INVENTORY.UPDATE");
});