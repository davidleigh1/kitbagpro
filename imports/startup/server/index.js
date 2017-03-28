// # import server startup through a single index entry point

console.log("RUN: server.index.js");

console.log("============================================================");
console.log("======   SERVER STARTUP at '/startup/server/index.js' ======");
console.log("============================================================");

// import { Meteor } from 'meteor/meteor';

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
// import '../imports/startup/server/fixtures.js';
import './fixtures.js';
// import './globalFunctions.js';
import { kb } from "/imports/startup/both/sharedConstants.js";

/*
	// Not loaded...
	import '../imports/startup/server/kadira.js';
*/


// This file configures the Accounts package to define the UI of the reset
// password email.
// import '../imports/startup/server/reset-password-email.js';

// Set up some rate limiting and other important security settings.
// import '../imports/startup/server/security.js';

// This defines all the collections, publications and methods that the
// application provides as an API to the client.


console.log("IMPORT register-api.js");
import './register-api.js';

/* GLOBAL FUNCTIONS */

globalIsThisObjectUnique = function (objId, objectType) {
	console.log("FN: globalIsThisObjectUnique()", objId, objectType);
	/*
	TODO: Previously the following switch used 'objectType.toLowerCase'
	Please confirm calling functions use the correct obj name + case!
	*/

	var isFound = kb.collections[objectType].findOne({ _id:objId }) || false;
	console.log("isFound:\n", isFound, "\nreturning: ",!isFound);
	/* Invert as the function returns true if unique */
	return !isFound;

	// Making this generic now!
	// switch ( objectType ) {
	// 	case "Orgs":
	// 		isFound = kb.collections[objectType].findOne({ _id:objId });
	// 		console.log("isFound:\n", isFound);
	// 		if (isFound) {
	// 			return false;
	// 		} else {
	// 			/* No duplicate found - we're good to go! */
	// 			return true;
	// 		}
	// 		break;
	// 	case "kitbag":
	// 	case "kitbags":
	// 		isFound = Kitbags.findOne({ _id:objId });
	// 		console.log("isFound:\n",isFound);
	// 		if (isFound) {
	// 			return false;
	// 		} else {
	// 			/* No duplicate found - we're good to go! */
	// 			return true;
	// 		}
	// 		break;
	// 	default:
	// 		/* If not found assume object is indeed unique */
	// 		return true;
	// }
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

		// modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.length : 0;
		// modifier.$set.itemAssocKitbagCount = (typeof modifier.$set.assocKitbags == "object") ? modifier.$set.assocKitbags.count() : 0;
		// console.log(typeof modifier.$set.assocKitbags, modifier.$set.assocKitbags, modifier.$set.assocKitbags.length );
	} else {
		console.log("globalBeforeInsertHook() in /startup/server/index.js - No modifier found.")
	}

	if (requestor == "beforeItemInsert" && typeof doc == "object") {
		doc._id = doc.assocOrgId + "-" + doc._id;
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = doc.createdBy || userId || Meteor.userId() || "Unknown User";
		console.log("\nTODO: globalBeforeInsertHook() - Is this count required here???  See reference to 'itemAssocKitbagCount' above! \n");
		doc.assocKitbagCount = (typeof doc.assocKitbagsArray == "object") ? doc.assocKitbagsArray.length : 0;
	}

	if (requestor == "beforeOrgInsert" && typeof doc == "object") {
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = doc.createdBy || userId || Meteor.userId() || "Unknown User";
		// doc.assocKitbagCount = (typeof doc.assocKitbags == "object") ? doc.assocKitbags.length : 0;
	}

	if (requestor == "beforeKitbagInsert" && typeof doc == "object") {
		console.log("\n\n-------- IN beforeKitbagInsert --------\n", doc, "\n----------------\n");
 		// var orgId = FlowRouter.getParam('_orgId');
      	// doc.assocOrgId = orgId;
		// doc._id = "xxxx" + doc.assocOrgId + "-" + doc._id;
		doc._id = doc.assocOrgId + "-" + doc._id;
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = doc.createdBy || userId || Meteor.userId() || "Unknown User";
		console.log("\n\n-------- OUT beforeKitbagInsert --------\n", doc, "\n----------------\n");
      	return doc;
	}

	if (requestor == "beforeUserInsert" && typeof doc == "object") {
		console.log("\n\n-------- IN beforeUserInsert --------\n", doc, "\n----------------\n");
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = doc.createdBy || userId || Meteor.userId() || "Unknown User";
		console.log("\n\n-------- OUT beforeUserInsert --------\n", doc, "\n----------------\n");
	}
	
	if (requestor == "beforeUserUpdate" && typeof doc == "object") {
		console.log("\n\n-------- IN beforeUserUpdate --------\n", doc, "\n----------------\n");
		// doc._id = tempDocId;
		// doc._id = doc.assocOrgId + "-" + doc._id;
		doc.createdAt = doc.createdAt || new Date();
		doc.createdBy = doc.createdBy || userId || Meteor.userId() || "Unknown User";
		doc.assocKitbagCount = (typeof doc.assocKitbagIds == "object") ? doc.assocKitbagIds.length : 0;
		console.log("\n\n-------- OUT beforeUserUpdate --------\n", doc, "\n----------------\n");
	}
};
globalBeforeUpdateHook = function (requestor, userId, doc, fieldNames, modifier, options) {
	console.log("\n globalBeforeUpdateHook() in /startup/server/index.js\n\nrequestor\n",requestor, "\n\nuserId\n",userId, "\n\ndoc\n",doc, "\n\nfieldNames\n",fieldNames, "\n\nmodifier\n",modifier, "\n\noptions\n",options, "\n\n");

	// TODO --- WHAT WAS THE INTENTION OF THIS CHECK?? TO DETECT A CHANGE IN ORGID ON UPDATE??
	// if (doc.orgId) {
	// 	console.log("Is Org!");
	// 	if (modifier.$set.orgId && modifier.$set.orgId != doc._id) {
	// 		console.log("OrgId has changed!");
	// 		doc._id = modifier.$set.orgId;
	// 	}else{
	// 		console.log("OrgId no change!");
	// 	}
	// }


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

		/* Update Kitbag Count if assocKitbagsArray field exists */
		if (doc.assocKitbagsArray) {
			modifier.$set.assocKitbagCount = (typeof modifier.$set.assocKitbagsArray == "object") ? modifier.$set.assocKitbagsArray.length : 0;
			console.log("\n\n\n","modifier.$set.assocKitbagCount",modifier.$set.assocKitbagCount,"\n\n\n");
			// console.log(typeof modifier.$set.assocKitbags, modifier.$set.assocKitbags, modifier.$set.assocKitbags.length );
		}
	} else {
		console.log("globalBeforeUpdateHook() in /startup/server/index.js - No modifier found.")
	}
};

/* GLOBAL METHODS */

Meteor.methods({
	updateDoc: function(updatedObj, objId){
		console.log("FN: -GENERIC- updateDoc()", arguments);

		var thisCollectionName = updatedObj.$set.collection;

		var success = kb.collections[thisCollectionName].update( objId, updatedObj );

		if (success) {
			var updatedDoc = kb.collections[thisCollectionName].findOne( objId );			
			var returnObj = {
				"id": objId,
				"obj": updatedDoc,
				"thisAction": "update",
				"thisCollectionName": thisCollectionName,
				"title": updatedDoc.title || updatedDoc.displayName
			};
			console.log("generic.update() - updated "+thisCollectionName+" '"+returnObj.title+"' with this returnObj{}\n", returnObj);
			return returnObj;
		} else {
			console.log("ERROR: generic.update(>> "+thisCollectionName+" <<) failed.");
		}
	},
	deleteDoc: function(requestor, collectionName, assocObj = {}, userId){
		console.log("FN: -GENERIC- deleteDoc()",arguments);
		// var res = MyCollections["Orgs"].findOne(id);
		var res = kb.collections[collectionName].findOne(assocObj._id);

		serverlog({
			actor: userId,
			subject: "deleteDoc()",
			object: collectionName,
			message: "User '"+userId+"' requested to delete "+collectionName+": '"+assocObj._id+"'"
		});

		// if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
		// 	// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');

		// 	var msg = 'ERROR: You are not authorized to trash items owned by other users [error code: 34.6]';
		// 	console.log(msg);
		// 	serverlog({
		// 		actor: userId,
		// 		subject: org_id,
		// 		object: "Org",
		// 		message: msg
		// 	});
		// 	return false;
		// } else {
			kb.collections[collectionName].remove(assocObj._id);
			serverlog({
				actor: userId,
				subject: "deleteDoc()",
				object: collectionName,
				message: "User '"+userId+"' successfully deleted "+collectionName+": '"+assocObj._id+"'"
			});
			return true;
		// }
	},
	setDocStatus: function(docCollection, docId, newStatus){
		console.log("FN: -GENERIC- setDocStatus()",arguments);
		var success = kb.collections[docCollection].update(docId, { $set: {status: newStatus}});
		console.log("Status set: ", success, kb.collections[docCollection].findOne(docId) );
	},
	setDocField: function(docCollection, docId, docfield, newValue){
		console.log("FN: -GENERIC- setDocField()", docCollection, docId, docfield, newValue);
		var success = kb.collections[docCollection].update( docId , { $set: { docfield : newValue } });
		console.log("Field updated: ", success, docCollection, docId, docfield, newValue );
	},

	printLine: function(){
		console.log("\n\n\n------------------------------------------------------\n\n");
	}
});


