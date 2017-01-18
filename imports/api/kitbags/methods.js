// # methods related to this collection
console.log("RUN: kitbags > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* METHODS */

var thisObj = "Kitbags";

Meteor.methods({

	/* -- KITBAG METHODS -- */
	addKitbag: function(kitbagObj){
		console.log('fn Meteor.methods.addKitbag()',kitbagObj);
		if(typeof kitbagObj != "object" || kitbagObj == false){
			console.log('ERROR: No kitbagObj received in request. DB insert action cancelled. [error code: 322]');
			return "false";
		}
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(kitbagObj.id,"Kitbags") ){
			throw new Meteor.Error("Duplicate found for Kitbag: "+kitbagObj.id+". Aborting new org creation.");
			return false;
		}		

		// We return the method in order to be able to passback and reuse the _id generated when the doc is created in the database
		// http://stackoverflow.com/questions/16439055
    	// var dbNewKB = MyCollections["Kitbags"].insert(kitbagObj);
		var dbNewKB = kb.collections[thisObj].insert(kitbagObj);
		console.log('added Kitbag: ', kitbagObj);
		// console.log(dbNewKB);
		return dbNewKB;
	},
	updateKitbagField: function(dbId,field,newValue){
		console.log(">>> fn updateKitbagField()",dbId,field,newValue);
		kb.collections[thisObj].update( dbId , { $set: { field : newValue } });
	},
	updateKitbag: function(updatedObj,documentId){
		console.log(">>> fn updateKitbag()",updatedObj,documentId);
		console.log("TODO - CREATE GENERIC updateObj PROTOTYPE!!!");

		var editId,dbObj;
		if( updatedObj._id ){
			editId = updatedObj._id;
		}else{
			dbObj = kb.collections[thisObj].findOne( updatedObj.id );
		}

/* TODO - FIX THIS !!!!! */

		kb.collections[thisObj].update( documentId, updatedObj );

		var orgId = kb.collections[thisObj].findOne({_id:documentId},{ orgId:1 })["orgId"];

		return { "orgId": orgId, "updatedObj": updatedObj, "documentId": documentId };

	},
	// Meteor.call("assignKBtoOrg", newKB.kitbagAssocOrg, newKB._id);
	assignKBtoOrg: function(bagId,orgId){
		console.log("assignKBtoOrg adding bag: '"+bagId+"' to org: '"+orgId+"'");
		// badInCode - MyCollections["Orgs"].update(orgId, { $push: { "orgAssocKitbagids": bagId }});
		// GoodInDBConsole - db.orgs.update({orgId:"org_be44df86cb2f"}, { $push: { orgAssocKitbagids: "kb_ccaa81f04fc6" }});

		// Use the full names (rather than thisObj variable) when referencing
		// multiple collections in the same function
		var myOrgId = kb.collections.Kitbags.findOne( {_id: bagId} ).kitbagAssocOrg;

		kb.collections.Orgs.update(
			{ _id: myOrgId },
			{ $push: { assocKitbagIds: ""+bagId }},
			function( error, result) {
    			if ( error ) console.log ( error ); //info about what went wrong
    			if ( result ) {
    				console.log ( "Successful update to Org records: ", result ); //the _id of new object if successful
    				var bagCount = kb.collections.Orgs.findOne( myOrgId ).assocKitbagIds.length;
					kb.collections.Orgs.update(
						{ _id: myOrgId },
						{ $set: { assocKitbagCount: bagCount }}
					);
    			}
  			}
		);
	},
	trashKitbag: function(id){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = kb.collections[thisObj].findOne(id);
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
      // MyCollections["Kitbags"].remove(id);
			kb.collections[thisObj].remove(id);
		}
	},
	setPrivateKitbag: function(id,private){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = kb.collections[thisObj].findOne(id);
		console.log("setPrivateKitbag("+id,private+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {private: private}});
			kb.collections[thisObj].update(id, { $set: {private: private}});
      // console.log("Kitbag privacy set: ",MyCollections["Kitbags"].findOne(id));
			console.log("Kitbag privacy set: ",kb.collections[thisObj].findOne(id));
		}
	},
	setStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = kb.collections[thisObj].findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.6]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			kb.collections[thisObj].update(id, { $set: {kitbagStatus: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("kitbagStatus set: ",kb.collections[thisObj].findOne(id));
		}
	}
});
