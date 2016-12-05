// # import server startup through a single index entry point

console.log("RUNNING server.index.js");


// import { Meteor } from 'meteor/meteor';

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
// import '../imports/startup/server/fixtures.js';
import './fixtures.js';
import '/imports/startup/both/schema-kitbags.js';
// import './schema-kitbags.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
// import '/imports/startup/both/schema-orgs.js';
// import './schema-orgs.js';
// import '/imports/startup/both/schema-items.js';
// import './schema-items.js';

/*
	// Not loaded...
	import '../imports/startup/server/kadira.js';
*/


// This file configures the Accounts package to define the UI of the reset password email.
	// import '../imports/startup/server/reset-password-email.js';

// Set up some rate limiting and other important security settings.
	// import '../imports/startup/server/security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
//console.log('SKIPPING api.js');
console.log("IMPORT register-api.js");
import './register-api.js';

globalIsThisObjectUnique = function (objId, objectType) {
	console.log("globalIsThisObjectUnique()",objId, objectType);
	var isFound;
	switch ( objectType.toLowerCase() ) {
		case "org":
		case "orgs":
 			isFound = Orgs.findOne({ _id:objId });
 			console.log("isFound:\n",isFound);
 			if (isFound) {
 				return false;
 			} else {
 				/* No duplicate found - we're good to go! */
 				return true;
 			}
		default:
			/* If not found assume object is indeed unique */
			return true;
	}
};
globalBeforeInsertHook = function (requestor, userId, doc, fieldNames, modifier, options) {
	console.log("\n globalBeforeInsertHook() in startup/server/index.js\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options, "\n\n");
	if (modifier) {

		modifier.$set = modifier.$set || {};

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

		modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.length : 0;
		// modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.count() : 0;
		console.log(typeof modifier.$set.assocKitbags, modifier.$set.assocKitbags, modifier.$set.assocKitbags.length );
	} else {
		console.log("globalBeforeInsertHook() in /startup/server/index.js - No modifier found.")
	}

	if (requestor == "beforeItemInsert" && typeof doc == "object") {
		doc._id = doc.itemAssocOrg + "-" + doc.itemId;
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = userId || Meteor.userId() || "Unknown User";
		doc.itemAssocKitbagCount = (typeof doc.assocKitbags == "object") ? doc.assocKitbags.length : 0;
	}

	if (requestor == "beforeOrgInsert" && typeof doc == "object") {
		doc._id = doc.orgId;
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = userId || Meteor.userId() || "Unknown User";
		// doc.orgAssocKitbagCount = (typeof doc.assocKitbags == "object") ? doc.assocKitbags.length : 0;
	}
};
globalBeforeUpdateHook = function (requestor, userId, doc, fieldNames, modifier, options) {
	console.log("\n globalBeforeUpdateHook() in /startup/server/index.js\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options, "\n\n");

	if (doc.orgId) {
		console.log("Is Org!");
		if (modifier.$set.orgId && modifier.$set.orgId != doc._id) {
			console.log("OrgId has changed!");
			doc._id = modifier.$set.orgId;
		}else{
			console.log("OrgId no change!");
		}
	}


	if (modifier) {

		modifier.$set = modifier.$set || {};

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

		if (doc.itemAssocKitbagCount) {
			modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.length : 0;
			// modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.count() : 0;
			console.log(typeof modifier.$set.assocKitbags, modifier.$set.assocKitbags, modifier.$set.assocKitbags.length );
		}
	} else {
		console.log("globalBeforeUpdateHook() in /startup/server/index.js - No modifier found.")
	}
};