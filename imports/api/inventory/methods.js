// # methods related to this collection
console.log("RUN: inventory > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* METHODS */
var thisCollectionName = "Inventory";

Meteor.methods({
	// addKitbag: function(kitbagObj){
	// 	console.log('FN: Meteor.methods.addKitbag()(>>'+thisCollectionName+'<<)');
	// 	if(typeof kitbagObj != "object" || kitbagObj == false){
	// 		throw new Meteor.Error('ERROR: No kitbagObj received in request. DB insert action cancelled. [error code: 322]');
	// 		return false;
	// 	}
	// 	/* Check for duplicate and abort if non-unique */
	// 	if ( !globalIsThisObjectUnique(kitbagObj.id, thisCollectionName) ){
	// 		throw new Meteor.Error("Duplicate found for Kitbag: "+kitbagObj.id+". Aborting new kitbag creation.");
	// 		return false;
	// 	}		

	// 	var dbNewKB = kb.collections[thisCollectionName].insert(kitbagObj);

	// 	var returnObj = {
	// 		"id": dbNewKB,
	// 		"obj": kitbagObj,
	// 		"thisAction": "insert",
	// 		"thisCollectionName": thisCollectionName,
	// 		"title": kitbagObj.title
	// 	};		
	// 	console.log('addKitbag() added Kitbag: "'+kitbagObj.title+'" ('+kitbagObj._id+') \n', returnObj);
	// 	return returnObj;
	// },
	// updateKitbagField: function(dbId,field,newValue){
	// 	console.log(">>> fn updateKitbagField()",dbId,field,newValue);
	// 	kb.collections[thisCollectionName].update( dbId , { $set: { field : newValue } });
	// },
	// assignKBtoOrg: function(kitbagDoc){
	// 	console.log("RUN: assignKBtoOrg() assigning bag: '"+kitbagDoc._id+"' to org: '"+kitbagDoc.assocOrgId+"'");
	// 	kb.collections.Orgs.direct.update(
	// 		{ _id: kitbagDoc.assocOrgId },
	// 		{ $push: { assocKitbagIds: kitbagDoc._id }},
	// 		function( error, result) {
 //    			if ( error ) console.log ( error ); //info about what went wrong
 //    			if ( result ) {
 //    				var thisOrgObj = kb.collections.Orgs.findOne( kitbagDoc.assocOrgId );
 //    				var bagCount = thisOrgObj.assocKitbagIds.length;
	// 				kb.collections.Orgs.direct.update(
	// 					{ _id: kitbagDoc.assocOrgId },
	// 					{ $set: { assocKitbagCount: bagCount }}
	// 				);
 //    				console.log ( "OK!: Successfully updated 'assocKitbagCount' (new value: " + bagCount + ") for Org: " + kitbagDoc.assocOrgId  ); //the _id of new object if successful
 //    			}
 //  			}
	// 	);
	// },
	// trashKitbag: function(item_id){
	// 	var res = kb.collections[thisCollectionName].findOne(item_id);
	// 	console.log("res: ",res);

	// 	if (res.owner !== Meteor.userId()){
	// 		console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
	// 		return false;
	// 	}else{
	// 		kb.collections[thisCollectionName].remove(item_id);
	// 	}
	// },
	// setPrivateKitbag: function(item_id,private){
	// 	var res = kb.collections[thisCollectionName].findOne(item_id);
	// 	console.log("setPrivateKitbag("+item_id,private+")");
	// 	console.log("res: ",res);

	// 	if (res.owner !== Meteor.userId()){
	// 		throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
	// 	}else{
	// 		kb.collections[thisCollectionName].update(item_id, { $set: {private: private}});
	// 		console.log("Kitbag privacy set: ",kb.collections[thisCollectionName].findOne(item_id));
	// 	}
	// }
});
