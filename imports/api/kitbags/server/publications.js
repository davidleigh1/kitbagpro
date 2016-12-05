// # definition of this collection

import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';



import { appSettings } from '/imports/startup/both/sharedConstants.js';

// Meteor.publish("kitbags",function() {

// 		updateKitbagCountsObj("onKitbagsPublished");
// 		return Kitbags.find({
//  		/* TODO - Do we want to allow Server to publish all fields of the Org record? */
// 			/* TODO - Publish only kitbags associated with the current user's Org / Orgs */
// 		});
// });

	/* TODO - Do we want to allow Server to publish all fields of the Org record? */
	/* TODO - Publish only kitbags associated with the current user's Org / Orgs */


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



/* Methods */

Meteor.methods({

	/* -- KITBAG METHODS -- */
	addKitbag: function(kitbagObj){
		if(typeof kitbagObj != "object" || kitbagObj == false){
			return "false";
		}

		// We return the method in order to be able to passback and reuse the _id generated when the doc is created in the database
		// http://stackoverflow.com/questions/16439055
    // var dbNewKB = MyCollections["Kitbags"].insert(kitbagObj);
		var dbNewKB = Kitbags.insert(kitbagObj);
		// console.log(dbNewKB);
		return dbNewKB;
	},
	updateKitbag: function(id,checked){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);

		if (res.owner !== Meteor.userId()){
			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
			return false;
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {checked: checked}});
			Kitbags.update(id, { $set: {checked: checked}});
		}
	},
	// Meteor.call("assignKBtoOrg", newKB.kitbagAssocOrg, newKB._id);
	assignKBtoOrg: function(bagId,orgId){
		console.log("assignKBtoOrg adding bag: '"+bagId+"' to org: '"+orgId+"'");
		// badInCode - MyCollections["Orgs"].update(orgId, { $push: { "orgAssocKitbagids": bagId }});
		// GoodInDBConsole - db.orgs.update({orgId:"org_be44df86cb2f"}, { $push: { orgAssocKitbagids: "kb_ccaa81f04fc6" }});

		var myOrgId = Kitbags.findOne( {kitbagId: bagId} ).kitbagAssocOrg;

		Orgs.update(
			{ orgId: myOrgId },
			{ $push: { orgAssocKitbagIds: ""+bagId }},
			function( error, result) {
    			if ( error ) console.log ( error ); //info about what went wrong
    			if ( result ) {
    				console.log ( "Successful update to Org records: ", result ); //the _id of new object if successful
    				var bagCount = Orgs.findOne( {orgId: myOrgId} ).orgAssocKitbagIds.length;
					Orgs.update(
						{ orgId: myOrgId },
						{ $set: { orgAssocKitbagCount: bagCount }}
					);
    			}
  			}
		);
		// TODO - Add a callback so only +1 when update is confirmed successful
		// var bagCount = Orgs.find(
		// 	{ orgId: ""+orgId },
		// 	{ { orgAssocKitbagIds: ""+bagId }}
		// );
		// var bagCount = Orgs.findOne( {orgId: orgId} ).orgAssocKitbagIds.length;

		// Orgs.update(
		// 	{ orgId: ""+orgId },
		// 	{ $push: { orgAssocKitbagIds: ""+bagId }}
		// );

	},
	trashKitbag: function(id){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
      // MyCollections["Kitbags"].remove(id);
			Kitbags.remove(id);
		}
	},
	setPrivateKitbag: function(id,private){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("setPrivateKitbag("+id,private+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {private: private}});
			Kitbags.update(id, { $set: {private: private}});
      // console.log("Kitbag privacy set: ",MyCollections["Kitbags"].findOne(id));
			console.log("Kitbag privacy set: ",Kitbags.findOne(id));
		}
	},
	setStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Kitbags.findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.6]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			Kitbags.update(id, { $set: {kitbagStatus: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("kitbagStatus set: ",Kitbags.findOne(id));
		}
	}
});