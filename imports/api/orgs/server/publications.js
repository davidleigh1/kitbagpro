// # definition of this collection

import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";
import { Admin } from '/imports/api/admin/admin.js';


/* PARAMETERS */

var console_prefix = "publish 'orgs' : ";

/* PUBLISH */

Meteor.publish("orgs",function() {
	// console.log('Publishing "orgs" from apis > orgs > server > publications.js!');
	console.log(console_prefix + "-----------------------------------------------------");
	console.log(console_prefix + "Meteor.publish('orgs')");
	if (this.userId) {

		var searchObj;

		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"profile.userAssocOrg": 1, "profile.userType": 1}});

		console.log("***** orgObj *****",orgObj);


		if (typeof orgObj == "object" && typeof orgObj.profile == "object") {
			var orgId = orgObj.profile.userAssocOrg;
			console.log(console_prefix + "User's Associated Org: ", orgId);
			
			if (orgObj.profile.userType.toLowerCase() == "superadmin") {
				console.log(console_prefix + "User is SuperAdmin!!!!!!");
				searchObj = {};
			} else {
				searchObj = orgId;
			}

		} else {
			console.log(console_prefix + "Meteor.publish('org') - no org object or obj.profile object found");
			return null;
		}

	} else {
		console.log(console_prefix + "Meteor.publish('org') - no userId found");
		return null;
	}
	console.log(console_prefix + "searchObj is '"+searchObj+"'");
	return kb.collections.Orgs.find(searchObj);
});

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */

updateOrgCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	/* Combined function replacing ALL+ACTIVE+HIDDEN */
	var countAll     = kb.collections.Orgs.find( { status: { $in: appSettings.orgs.statusesIncludedInAllCount } 	}).count();
	var countActive  = kb.collections.Orgs.find( { status: { $in: appSettings.orgs.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = kb.collections.Orgs.find( { status: { $in: appSettings.orgs.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = kb.collections.Orgs.find( { status: { $in: appSettings.orgs.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allOrgs': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeOrgs': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenOrgs': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedOrgs': countTrashed } }, { upsert: true } );

	console.log("Updated Org Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);
};



/***************************************************************************/
/* COLLECTION HOOKS using https://atmospherejs.com/matb33/collection-hooks */
/***************************************************************************/

/* BEFORE */

kb.collections.Orgs.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK - BEFORE ORGS.INSERT");
	/* Override _id parameter */
	/* Count kitbags and set the associated Kitbag Count  */
	try{
		globalBeforeInsertHook("beforeOrgInsert", userId, doc, fieldNames, modifier, options);
	} catch(err) {
		console.log("\n\n=== ERROR ===\n\n"+err+"\n\n=============\n\n");
	}
});
kb.collections.Orgs.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("HOOK - BEFORE ORGS.UPDATE");
	/* Override _id parameter */
	/* Count kitbags and set the associated Kitbag Count  */
	try{
		globalBeforeUpdateHook("beforeOrgUpdate", userId, doc, fieldNames, modifier, options);
	} catch(err) {
		console.log("\n\n=== ERROR ===\n\n"+err+"\n\n=============\n\n");
	}
});


/* AFTER */

kb.collections.Orgs.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.INSERT");
	/* Recalculate when new Org is added */
	updateOrgCountsObj("onOrgInserted",doc.title);
});
kb.collections.Orgs.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.REMOVE", "\n", userId, "\n", doc, "\n", fieldNames, "\n", modifier);
	serverlog("User X deleted Org Y");
	/* Recalculate when existing Org is deleted */
	updateOrgCountsObj("onOrgRemoved",doc.title);
});
kb.collections.Orgs.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.UPDATE");
	/* Recalculate when new existing Org changes status - which could well render it outside of the count criteria */
	updateOrgCountsObj("onOrgUpdate",doc.title);

	if (doc.title !== this.previous.title) {
		console.log("\n\n=== SERVER SIDE ==================\nNow updating all Kitbags associated with OrgId '"+doc._id+"'\nto reflect change in 'kitbagAssocOrgTitle' from '"+this.previous.title+"' to '"+doc.title+"'\n===================================\n\n");
		// TODO - Log name change to the logging table

		/*

		IMPORTANT: Following an Org name change, we will increment through all of the Kitbags looking for the matching orgID in each Kitbag's kitbagAssocOrg field rather than retrieving the list of orgAssocKitbagids from the Org and just matching by Kitbag IDs
		* This approach should be more reliable as we are basing our search/replace on a simple, mandatory text field (kitbagAssocOrg) on each document - rather than on one single, non-mandatory array (orgAssocKitbagids) which is potentially more corruptible
		* This approach is more fault-tolerant overall
		* This better supports data imports and APIs where the kitbags records for each Org would be uploaded independently (and after!) the main Org document

		 */

		// TODO - Log successful update + name change AGAINST EACH KITBAG to the logging table
		kb.collections.Kitbags.update(
			{ assocOrg: doc._id },
			{ $set: {assocOrgTitle: doc.title } },
			{ multi:true },
			function( error, result) {
    			if ( error ) console.log ( error ); //info about what went wrong
    			if ( result ) console.log ( "Successful update to records: ", result ); //the _id of new object if successful
  			}
  		);

	}else{
		console.log("\n\n=== SERVER SIDE ==================\ntitle not updated!\n===================================\n\n");
	}
});












































