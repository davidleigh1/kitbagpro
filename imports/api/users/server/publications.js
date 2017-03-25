// # definition of this collection

import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
import { Admin } from '/imports/api/admin/admin.js';



/* PARAMETERS */
	var console_prefix = "PUB: 'users' - ";


/* PUBLISH */
Meteor.publish("users", function () {
	console.log('Publishing "users" from apis > users > server > publications.js!');
	if (this.userId) {
		var searchObj;
		var requiredUserfields = {
			// "displayName": 1,
			// "username": 1,
			// "emails": 1,
			// "profile": 1,
			// "createdAt": 1,
			// "services": 1,
			// "status": 1,
			// "type": 1,
			// "assocOrgId": 1
		};
		var userObj = Meteor.users.findOne({_id: this.userId}, {fields: {"assocOrgId": 1, "type": 1}});
		if (typeof userObj == "object" && userObj.type) {

			switch( userObj.type.toLowerCase() ) {
				case "superadmin":
					/* SUPERADMINS GET ALL USERS FROM *ALL* ORGS */
					console.log(console_prefix + "SuperAdmin found");
					searchObj = {};
					break;
				case "orgadmin":
				case "orgmanager":
					/* ORG ADMINS AND ORG MANAGERS GET ALL USERS FROM *THEIR* ORG ONLY */
					searchObj = { "assocOrgId": userObj.assocOrgId };
					break;
				case "user":
				default:
					/* USERS ONLY GET THEMSELVES */
					searchObj = { _id: this.userId };
					break;
			}
		} else {
			console.log(console_prefix + "Error - No user object found");
			return null;
		}
	} else {
		console.log(console_prefix + "Error - No userId found");
		return null;
	}
	// updateGlobalOrgCountsObj("onOrgsPublished");
	return kb.collections.Users.find(searchObj, requiredUserfields);
});


userUpdateHook = function (requestor, userId, doc, fieldNames, modifier, options) {
	console.log("userUpdateHook()\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options, "\n\n");

	if (!modifier) {
		console.log("userUpdateHook() - No modifier found.  Returning.")
		return;
	}

	modifier.$set = modifier.$set || {};
	// modifier.$unset = modifier.$unset || {};
	// modifier.$set.profile = modifier.$set.profile || {};

	/* TODO: Only update Updated Date if something actually changed. Not just on a create/update! */

	/* Set New */
	modifier.$set["updatedAt"] = new Date();
	/* Delete Old */
	if (modifier.$unset) {
		delete modifier.$unset["updatedAt"];
	}

	/* Set New */
	modifier.$set["updatedBy"] = Meteor.userId() || "Unknown User";
	/* Delete Old */
	if (modifier.$unset) {
		delete modifier.$unset["updatedBy"];
	}

	// /* Dynamic Field - Count Kitbags */
	if (typeof modifier.$set["assocKitbagIds"] == "object"){
		/* Set in $set object */
		modifier.$set["assocKitbagCount"] = modifier.$set["assocKitbagIds"].length;
		/* Remove in $unset object to avoid duplication */
		if (modifier.$unset) {
			delete modifier.$unset["assocKitbagCount"];
		}
	}

};



/***************************************************************************/
/* COLLECTION HOOKS using https://atmospherejs.com/matb33/collection-hooks */
/***************************************************************************/

/* BEFORE */

// kb.collections.Users.before.insert(function (userId, doc, fieldNames, modifier, options) {
// 	console.log("HOOK: BEFORE KB.COLLECTIONS.USERS.INSERT");
// 	// globalBeforeInsertHook("beforeKitbagInsert", userId, doc, fieldNames, modifier, options);
// });


Meteor.users.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE METEOR.USERS.INSERT");
	if (!userId) {
		console.log("Update to Meteor.users by server. 'userId' not passed to hook. Skipping userUpdateHook();");
		return;
	}
	/* TODO - ADD LOG FOR NEW USER CREATION ATTEMPT */
	/* TODO - ADD LOG FOR NEW USER CREATION SUCCESS */

	globalBeforeInsertHook("beforeUserInsert", userId, doc, fieldNames, modifier, options);

	/* Update associated Kitbag Count */
	userUpdateHook("beforeUserInsert", userId, doc, fieldNames, modifier, options);
});


Meteor.users.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK: BEFORE METEOR.USERS.UPDATE");
	if (!userId) {
		console.log("Update to Meteor.users by server. 'userId' not passed to hook. Skipping userUpdateHook();");
		return;
	}

	globalBeforeUpdateHook("beforeUserUpdate", userId, doc, fieldNames, modifier, options);

	/* Update associated Kitbag Count */
	userUpdateHook("beforeUserUpdate", userId, doc, fieldNames, modifier, options);
});




