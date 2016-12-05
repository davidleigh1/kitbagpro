// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/startup/both/item-schema.js';
import { UserList } from '/imports/startup/both/user-schema.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';


Meteor.publish("userlist", function () {
	console.log('Publishing "userList" from apis > users > server > publications.js!');
	var userData = Meteor.users.find({}, {
		fields: {
			"username": 1,
			"emails": 1,
			"profile": 1,
			"createdAt": 1,
			"services": 1,
			//"userType": 1
		}
	});
	// console.log("\n\nuserData:\n",userData,"\n\n");
	return userData;
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
	modifier.$set["profile.updatedAt"] = new Date();
	/* Delete Old */
	if (modifier.$unset) {
		delete modifier.$unset["profile.updatedAt"];
	}

	/* Set New */
	modifier.$set["profile.updatedBy"] = Meteor.userId() || "Unknown User";
	/* Delete Old */
	if (modifier.$unset) {
		delete modifier.$unset["profile.updatedBy"];
	}

	// /* Dynamic Field - Count Kitbags */
	if (typeof modifier.$set["profile.userKitbags"] == "object"){
		/* Set in $set object */
		modifier.$set["profile.userKitbagCount"] = modifier.$set["profile.userKitbags"].length;
		/* Remove in $unset object to avoid duplication */
		if (modifier.$unset) {
			delete modifier.$unset["profile.userKitbagCount"];
		}
	}

	// console.log(modifier);
	// console.log(typeof modifier.$set);
	// //console.log(typeof modifier.$set["profile.userKitbags"]);
	// // console.log(typeof modifier.$set.["profile.userKitbags"]);
	// console.log("=======================================");
	// console.log(typeof modifier.$set["profile.userKitbags"]);
	// console.log(modifier.$set["profile.userKitbags"].length);
};


Meteor.users.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE USERS.INSERT");
	if (!userId) {
		console.log("Update to Meteor.users by server. 'userId' not passed to hook. Skipping userUpdateHook();");
		return;
	}
	/* TODO - ADD LOG FOR NEW USER CREATION ATTEMPT */
	/* TODO - ADD LOG FOR NEW USER CREATION SUCCESS */

	/* Update associated Kitbag Count */
	userUpdateHook("beforeUserInsert", userId, doc, fieldNames, modifier, options);
});

Meteor.users.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE USERS.UPDATE");
	if (!userId) {
		console.log("Update to Meteor.users by server. 'userId' not passed to hook. Skipping userUpdateHook();");
		return;
	}
	/* Update associated Kitbag Count */
	userUpdateHook("beforeUserUpdate", userId, doc, fieldNames, modifier, options);
});