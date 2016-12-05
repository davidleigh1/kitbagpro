// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';

import { appSettings } from '/imports/startup/both/sharedConstants.js';

Meteor.publish("orgs",function() {
	// console.log('Publishing "orgs" from apis > orgs > server > publications.js!');
	console.log(">>-->-->> Meteor.publish('orgs')");
	if (this.userId) {

		var searchObj;

		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"profile.userAssocOrg": 1, "profile.userType": 1}});

		if (typeof orgObj == "object" && typeof orgObj.profile == "object") {

			if (orgObj.profile.userType.toLowerCase() == "superadmin") {
				console.log(">>-->-->> orgId ('userAssocOrg'): ", orgId);
				console.log(">>-->-->>");
				console.log(">>-->-->> SuperAdmin FOUND!!!!!!");
				console.log(">>-->-->>");
				searchObj = {};
			} else {
				var orgId = orgObj.profile.userAssocOrg;
				console.log(">>-->-->> orgId ('userAssocOrg'): ", orgId);
				searchObj = { "orgId" : orgId };
			}

		} else {
			console.log(">>-->-->> Meteor.publish('org') - no org object or obj.profile object found");
			return null;
		}

	} else {
		console.log(">>-->-->> Meteor.publish('org') - no userId found");
		return null;
	}
	// updateOrgCountsObj("onOrgsPublished");
	return Orgs.find(searchObj);
});

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */

updateOrgCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	/* Combined function replacing ALL+ACTIVE+HIDDEN */
	var countAll     = Orgs.find( { orgStatus: { $in: appSettings.orgs.statusesIncludedInAllCount } 	}).count();
	var countActive  = Orgs.find( { orgStatus: { $in: appSettings.orgs.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = Orgs.find( { orgStatus: { $in: appSettings.orgs.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = Orgs.find( { orgStatus: { $in: appSettings.orgs.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allOrgs': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeOrgs': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenOrgs': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedOrgs': countTrashed } }, { upsert: true } );

	console.log("Updated Org Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);

};








Orgs.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.INSERT");
	/* Recalculate when new Org is added */
	// updateAllOrgsCount("onOrgInserted",doc.orgTitle);
	// updateActiveOrgsCount("onOrgInserted",doc.orgTitle);
	// updateHiddenOrgsCount("onOrgInserted",doc.orgTitle);
	updateOrgCountsObj("onOrgInserted",doc.orgTitle);
});
Orgs.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.REMOVE", "\n", userId, "\n", doc, "\n", fieldNames, "\n", modifier);
	serverlog("User X deleted Org Y");
	/* Recalculate when existing Org is deleted */
	// updateAllOrgsCount("onOrgRemoved",doc.orgTitle);
	// updateActiveOrgsCount("onOrgRemoved",doc.orgTitle);
	// updateHiddenOrgsCount("onOrgRemoved",doc.orgTitle);
	updateOrgCountsObj("onOrgRemoved",doc.orgTitle);
});
Orgs.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER ORGS.UPDATE");
	/* Recalculate when new existing Org changes orgStatus - which could well render it outside of the count criteria */
	// updateAllOrgsCount("onOrgUpdate",doc.orgTitle);
	// updateActiveOrgsCount("onOrgUpdate",doc.orgTitle);
	// updateHiddenOrgsCount("onOrgUpdate",doc.orgTitle);
	updateOrgCountsObj("onOrgUpdate",doc.orgTitle);

	if (doc.orgTitle !== this.previous.orgTitle) {
		console.log("\n\n=== SERVER SIDE ==================\nNow updating all Kitbags associated with OrgId '"+doc.orgId+"'\nto reflect change in 'kitbagAssocOrgTitle' from '"+this.previous.orgTitle+"' to '"+doc.orgTitle+"'\n===================================\n\n");
		// TODO - Log name change to the logging table

		/*

		IMPORTANT: Following an Org name change, we will increment through all of the Kitbags looking for the matching orgID in each Kitbag's kitbagAssocOrg field rather than retrieving the list of orgAssocKitbagids from the Org and just matching by Kitbag IDs
		* This approach should be more reliable as we are basing our search/replace on a simple, mandatory text field (kitbagAssocOrg) on each document - rather than on one single, non-mandatory array (orgAssocKitbagids) which is potentially more corruptible
		* This approach is more fault-tolerant overall
		* This better supports data imports and APIs where the kitbags records for each Org would be uploaded independently (and after!) the main Org document

		 */

		// TODO - Log successful update + name change AGAINST EACH KITBAG to the logging table
		Kitbags.update(
			{ kitbagAssocOrg: doc.orgId },
			{ $set: {kitbagAssocOrgTitle: doc.orgTitle } },
			{ multi:true },
			function( error, result) {
    			if ( error ) console.log ( error ); //info about what went wrong
    			if ( result ) console.log ( "Successful update to records: ", result ); //the _id of new object if successful
  			}
  		);

	}else{
		console.log("\n\n=== SERVER SIDE ==================\norgTitle not updated!\n===================================\n\n");
	}
});

Orgs.before.insert(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE ORGS.INSERT");
	/* Override _id parameter */
	/* Count kitbags and set the associated Kitbag Count  */
	try{
		globalBeforeInsertHook("beforeOrgInsert", userId, doc, fieldNames, modifier, options);
	} catch(err) {
		console.log("\n\n=== ERROR ===\n\n"+err+"\n\n=============\n\n");
	}
});


Orgs.before.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("BEFORE ORGS.UPDATE");
	/* Override _id parameter */
	/* Count kitbags and set the associated Kitbag Count  */
	try{
		globalBeforeUpdateHook("beforeOrgUpdate", userId, doc, fieldNames, modifier, options);
	} catch(err) {
		console.log("\n\n=== ERROR ===\n\n"+err+"\n\n=============\n\n");
	}
});












































