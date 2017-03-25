// # definition of this collection

import { kb } from "/imports/startup/both/sharedConstants.js";

import { Admin } from '/imports/api/admin/admin.js';



Meteor.publish("admin",function() {
	console.log('Publishing "Admin" from apis > admin > server > publications.js!');
		return Admin.find({

			/* TODO - Do we want to allow Server to publish all fields of the Org record? */

			// $or: [
			// 	// Or collection entry is NOT set to PRIVATE i.e. entry is PUBLIC
			// 	{ private: {$ne: true} },
			// 	// Or the owner of the entry is the current user -- regardless of the private setting
			// 	{ owner: this.userId }
			// ]
		});
});

/* Admin Only Methods */

Meteor.methods({
	updateGlobalCounts: function (requestor) {
		console.log("EVT: updateGlobalCounts() requested by: " + requestor);
		updateGlobalOrgCountsObj(requestor);
		updateGlobalKitbagCountsObj(requestor);
		updateGlobalItemCountsObj(requestor);
	},
	assignAllKBs: function (requestor) {
		console.log("EVT: reassignAllKBs() requested by: " + requestor);

		var allKbs = kb.collections.Kitbags.find().fetch();

		if (!allKbs){
			console.log("ERR: No 'allKbs' found!");
			return false;
		}

		/* Clear all assocKitbagIds fields and assocKitbagCount fields */
		kb.collections.Orgs.direct.update(
			{ },
			{ $unset: { assocKitbagIds: "", assocKitbagCount: "" } },
			{ multi: true }
		);

		// console.log('Unset - now returning');
		// return;

		// it'll only come here after the subscription is ready, no .fetch required
		_.forEach(allKbs, function(kitbagDoc){
		    // console.log( kitbagDoc );
		    // assignKBtoOrg(item.kitbagId);
		    // TODO - Maybe we can skip the Org lookup in assignKBtoOrg when it is provides as argument.
		    // In some cases we might have the OrgId easily accessable when we make the call
		    Meteor.call("assignKBtoOrg", kitbagDoc );
		});

		console.log("LOG: reassignAllKBs() completed!");

	}



});