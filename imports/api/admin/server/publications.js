// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';

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
	updateCounts: function (requestor) {
		console.log("updateCounts() requested by: " + requestor);
		updateOrgCountsObj(requestor);
		updateKitbagCountsObj(requestor);
		updateItemCountsObj(requestor);
	},
	assignAllKBs: function (requestor) {
		console.log("reassignAllKBs() requested by: " + requestor);

		var allKbs = Kitbags.find().fetch();

		if (!allKbs){
			console.log("No 'allKbs' found!");
			return false;
		}

		/* Clear all orgAssocKitbagIds fields and orgAssocKitbagCount fields */
		Orgs.direct.update(
			{ },
			{ $unset: { orgAssocKitbagIds: "", orgAssocKitbagCount: "" } },
			{ multi: true }
		);

		// console.log('Unset - now returning');
		// return;

		// it'll only come here after the subscription is ready, no .fetch required
		_.forEach(allKbs, function(item){
		    console.log( item );
		    // assignKBtoOrg(item.kitbagId);
		    // TODO - Maybe we can skip the Org lookup in assignKBtoOrg when it is provides as argument.
		    // In some cases we might have the OrgId easily accessable when we make the call
		    Meteor.call("assignKBtoOrg", item.kitbagId );
		});


	}



});