// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
import { Kitbags } from '/imports/startup/both/kitbag-schema.js';

import { appSettings } from '/imports/startup/both/sharedConstants.js';

/* PUBLISH */

Meteor.publish("kitbags",function() {
	// console.log('Publishing "orgs" from apis > orgs > server > publications.js!');

	console.log("====> Meteor.publish('kitbags')");
	if (this.userId) {

		var searchObj;

		var orgObj = Meteor.users.findOne({_id: this.userId}, {fields: {"profile.userAssocOrg": 1, "profile.userType": 1}});

		if (typeof orgObj == "object" && typeof orgObj.profile == "object") {

			if (orgObj.profile.userType.toLowerCase() == "superadmin") {
				console.log("====> orgId ('userAssocOrg'): ", orgId);
				console.log("====>");
				console.log("====> SuperAdmin FOUND!!!!!!");
				console.log("====>");
				searchObj = {};
			} else {
				var orgId = orgObj.profile.userAssocOrg;
				console.log("====> orgId ('userAssocOrg'): ", orgId);
				searchObj = { "kitbagAssocOrg" : orgId };
			}

		} else {
			console.log("Meteor.publish('kitbags') - no org object or obj.profile object found");
			return null;
		}

	} else {
		console.log("Meteor.publish('kitbags') - no userId found");
		return null;
	}
	updateKitbagCountsObj("onKitbagsPublished");
	return Kitbags.find(searchObj);
});

/* For Meteor Collection Hooks (https://atmospherejs.com/matb33/collection-hooks) */

updateKitbagCountsObj = function (requestor,userId, doc, fieldNames, modifier){
	/* Combined function replacing ALL+ACTIVE+HIDDEN */
	var countAll     = Kitbags.find( { kitbagStatus: { $in: appSettings.kitbags.statusesIncludedInAllCount } 	    }).count();
	var countActive  = Kitbags.find( { kitbagStatus: { $in: appSettings.kitbags.statusesIncludedInActiveCount } 	}).count();
	var countHidden  = Kitbags.find( { kitbagStatus: { $in: appSettings.kitbags.statusesIncludedInHiddenCount } 	}).count();
	var countTrashed = Kitbags.find( { kitbagStatus: { $in: appSettings.kitbags.statusesIncludedInTrashedCount }	}).count();

	Admin.update( {'id':'counts'}, { '$set':{ 'counts.allKitbags': countAll } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.activeKitbags': countActive } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.hiddenKitbags': countHidden } }, { upsert: true } );
	Admin.update( {'id':'counts'}, { '$set':{ 'counts.trashedKitbags': countTrashed } }, { upsert: true } );

	console.log("Updated Kitbag Counts ("+requestor+") > "+ "all: "+ countAll + " | active: "+ countActive + "| hidden: "+ countHidden + "| trashed: "+ countTrashed);
};

updateAssocOrgOnAddEdit = function (requestor, doc, fieldNames, modifier, options) {
	/* Update associated Org when new Kitbag is added */
	// assocOrg.update( { '$set':{ 'orgAssocKitbagids': newCount } }, { upsert: true } );

	/* Fetch the associated Org record (not the curson!) that relates to our Kitbag */
	// var assocOrg = Orgs.findOne( {orgId: doc.kitbagAssocOrg} );
	console.log("=== updateAssocOrgOnAdd ("+requestor+") =========================================");
	console.log(doc);
	console.log( Orgs.findOne( {orgId: doc.kitbagAssocOrg}) );
	/* Then add our kitbagId to the orgAssocKitbagids array - and add a new array if one doesnt already exist */
	/* TODO - Shouldnt need to add a new array if SimpleSchema is handling that for us...  */
	try{
		console.log("UPSERT {orgId: "+doc.kitbagAssocOrg+" (doc.kitbagAssocOrg)} , { $push: { orgAssocKitbagids: "+doc.kitbagId+" (doc.kitbagId) }}");
		Orgs.direct.update( {orgId: doc.kitbagAssocOrg} , { $push: { orgAssocKitbagIds: doc.kitbagId }} );

		console.log("modifier: ",requestor, doc, fieldNames, modifier, options);

		Orgs.direct.update( {orgId: doc.kitbagAssocOrg} , { $push: { orgAssocKitbagCount: orgAssocKitbagCount.count() }} );
	} catch (err) {
		console.log("\n\nERROR: "+err+"\n\n");
		return false;
	}
	console.log( Orgs.findOne( {orgId: doc.kitbagAssocOrg}) );
	console.log("=== /updateAssocOrgOnAdd ========================================================");
};


Kitbags.after.insert(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER KITBAGS.INSERT");
	/* Recalculate when new Kitbag is added */
	updateKitbagCountsObj("onKitbagInserted",doc.kitbagTitle);
	/* Update associated Org when new Kitbag is added */
	// updateAssocOrgOnAddEdit("onKitbagInserted",userId, doc, fieldNames, modifier);
});
Kitbags.after.remove(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER KITBAGS.REMOVE");
	/* Recalculate when new Kitbag is added */
	updateKitbagCountsObj("onKitbagRemoved",userId, doc, fieldNames, modifier);
});
Kitbags.after.update(function (userId, doc, fieldNames, modifier) {
	console.log("AFTER KITBAGS.UPDATE");
	/* Recalculate when new existing Kitbag changes kitbagStatus - which could well render it outside of the count criteria */
	updateKitbagCountsObj("onKitbagUpdate",userId, doc, fieldNames, modifier);
	/* Update associated Org when new Kitbag is edited */
	// updateAssocOrgOnAddEdit("onKitbagUpdate",userId, doc, fieldNames, modifier);
});