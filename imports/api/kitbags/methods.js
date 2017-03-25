// # methods related to this collection
console.log("RUN: kitbags > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* METHODS */
var thisCollectionName = "Kitbags";

Meteor.methods({
	/* -- KITBAG METHODS -- */
	// TODO: Should be createUser/createItem etc NOT addUser/addItem as there maybe a legit scenario (in the future) to add a user to a group
	// (or something else) which would be a legitimate 'add' but not a 'create'	
	addKitbag: function(kitbagObj){
		// console.log('FN: Meteor.methods.addKitbag()(>>'+thisCollectionName+'<<)',kitbagObj);
		console.log('FN: Meteor.methods.addKitbag()(>>'+thisCollectionName+'<<)');
		if(typeof kitbagObj != "object" || kitbagObj == false){
			throw new Meteor.Error('ERROR: No kitbagObj received in request. DB insert action cancelled. [error code: 322]');
			return false;
		}
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(kitbagObj.id, thisCollectionName) ){
			throw new Meteor.Error("Duplicate found for Kitbag: "+kitbagObj.id+". Aborting new kitbag creation.");
			return false;
		}		

		// We return the method in order to be able to passback and reuse the _id generated when the doc is created in the database
		// http://stackoverflow.com/questions/16439055
    	// var dbNewKB = MyCollections["Kitbags"].insert(kitbagObj);
		var dbNewKB = kb.collections[thisCollectionName].insert(kitbagObj);

		/* REMOVING THIS AS WE ONLY WANT SEPARATE COLLECTIONS SO WILL ASSOCIATE THE ID - NOT EMBED THE KITBAG OBJECT */
			// var dbNewKbObj = kb.collections["Kitbags"].find( {_id: dbNewKB} );
			// console.log("dbNewKbObj",dbNewKbObj);
			// console.log("kitbagObj._id",kitbagObj._id);
			// Add cursor (copy of) kitbag object to Org document
			// kb.collections["Orgs"].assocKitbagObjs.push( kb.collections["Kitbags"].findOne( {_id: dbNewKB} ) );
			// var pushed = kb.collections["Orgs"].update(
			// 	{ _id: kitbagObj.assocOrgId },
			// 	{ $push: { assocKitbagObjs: dbNewKbObj } }
			// );
			// var updatedOrgObj = kb.collections["Orgs"].findOne( { _id: kitbagObj.assocOrgId } );
			// console.log("\n\n\n\n\n\n",kitbagObj.assocOrgId," / pushed:\n",pushed,"\n\n",updatedOrgObj,"\n\n\n\n\n\n");

		// db.orgs.update({ _id: "ByA4SG4ceRakkGPkN" },{ $push: { assocKitbagIds: "newbag3" } })		
		/*
		returnObj{} will be passed to AutoForm.hooks.<formName>.onSuccess
		and then to globalSuccess() as resultObj{}
		*/
		var returnObj = {
			"id": dbNewKB,
			"obj": kitbagObj,
			"thisAction": "insert",
			"thisCollectionName": thisCollectionName,
			"title": kitbagObj.title
		};		
		console.log('addKitbag() added Kitbag: "'+kitbagObj.title+'" ('+kitbagObj._id+') \n', returnObj);
		return returnObj;
	},
	updateKitbagField: function(dbId,field,newValue){
		console.log(">>> fn updateKitbagField()",dbId,field,newValue);
		kb.collections[thisCollectionName].update( dbId , { $set: { field : newValue } });
	},
	// OLD_DELETE_assignKBtoOrg: function(kitbag_id,org_id){
	// 	/* UTIL FUNCTION ONLY - RUN BY ADMIN TO REASSIGN ALL KITBAGS */
	// 	console.log("RUN: assignKBtoOrg() assigning bag: '"+kitbag_id+"' to org: '"+org_id+"'");
	// 	// badInCode - MyCollections["Orgs"].update(org_id, { $push: { "orgAssocKitbagids": kitbag_id }});
	// 	// GoodInDBConsole - db.orgs.update({org_id:"org_be44df86cb2f"}, { $push: { orgAssocKitbagids: "kb_ccaa81f04fc6" }});

	// 	// Use the full names (rather than thisCollectionName variable) when referencing
	// 	// multiple collections in the same function
	// 	var myOrgId = kb.collections.Kitbags.findOne( {_id: kitbag_id} ).assocOrgId;

	// 	kb.collections.Orgs.update(
	// 		{ _id: myOrgId },
	// 		{ $push: { assocKitbagIds: ""+kitbag_id }},
	// 		function( error, result) {
 //    			if ( error ) console.log ( error ); //info about what went wrong
 //    			if ( result ) {
 //    				console.log ( "Successful update to Org records: ", result ); //the _id of new object if successful
 //    				var bagCount = kb.collections.Orgs.findOne( myOrgId ).assocKitbagIds.length;
	// 				kb.collections.Orgs.update(
	// 					{ _id: myOrgId },
	// 					{ $set: { assocKitbagCount: bagCount }}
	// 				);
 //    			}
 //  			}
	// 	);
	// },
	assignKBtoOrg: function(kitbagDoc){
		/* UTIL FUNCTION ONLY - RUN BY ADMIN TO REASSIGN ALL KITBAGS */
		console.log("RUN: assignKBtoOrg() assigning bag: '"+kitbagDoc._id+"' to org: '"+kitbagDoc.assocOrgId+"'");
		// badInCode - MyCollections["Orgs"].update(org_id, { $push: { "orgAssocKitbagids": kitbag_id }});
		// GoodInDBConsole - db.orgs.update({org_id:"org_be44df86cb2f"}, { $push: { orgAssocKitbagids: "kb_ccaa81f04fc6" }});

		// Use the full names (rather than thisCollectionName variable) when referencing
		// multiple collections in the same function
		// var myOrgId = kb.collections.Kitbags.findOne( {_id: kitbag_id} ).assocOrgId;

		kb.collections.Orgs.direct.update(
			{ _id: kitbagDoc.assocOrgId },
			{ $push: { assocKitbagIds: kitbagDoc._id }},
			function( error, result) {
    			if ( error ) console.log ( error ); //info about what went wrong
    			if ( result ) {
    				var thisOrgObj = kb.collections.Orgs.findOne( kitbagDoc.assocOrgId );
    				var bagCount = thisOrgObj.assocKitbagIds.length;
					kb.collections.Orgs.direct.update(
						{ _id: kitbagDoc.assocOrgId },
						{ $set: { assocKitbagCount: bagCount }}
					);
    				console.log ( "OK!: Successfully updated 'assocKitbagCount' (new value: " + bagCount + ") for Org: " + kitbagDoc.assocOrgId  ); //the _id of new object if successful
    			}
  			}
		);
	},
	trashKitbag: function(item_id){
		var res = kb.collections[thisCollectionName].findOne(item_id);
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
			kb.collections[thisCollectionName].remove(item_id);
		}
	},
	setPrivateKitbag: function(item_id,private){
		var res = kb.collections[thisCollectionName].findOne(item_id);
		console.log("setPrivateKitbag("+item_id,private+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			kb.collections[thisCollectionName].update(item_id, { $set: {private: private}});
			console.log("Kitbag privacy set: ",kb.collections[thisCollectionName].findOne(item_id));
		}
	// },
	// setStatus: function(item_id,newStatus){
	// 	var res = kb.collections[thisCollectionName].findOne(item_id);
	// 	console.log("setStatus("+item_id,newStatus+")");
	// 	console.log("res: ",res);

	// 	if (res.owner !== Meteor.userId()){
	// 		throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.6]');
	// 	}else{
	// 		kb.collections[thisCollectionName].update(item_id, { $set: {status: newStatus}});
	// 		console.log("status set: ",kb.collections[thisCollectionName].findOne(item_id));
	// 	}
	}
});
