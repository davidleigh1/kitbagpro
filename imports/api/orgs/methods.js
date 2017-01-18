// # methods related to this collection
console.log("RUN: orgs > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { kb } from "/imports/startup/both/sharedConstants.js";

/* METHODS */

var thisObj = "Orgs";

Meteor.methods({

	/* -- ORGANISATION METHODS -- */
	addOrg: function(orgObj){
		console.log('FN: addOrg(>>'+thisObj+'<<)',orgObj);
		if(typeof orgObj != "object" || orgObj == false){
			console.log('ERROR: No orgObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing title;  [error code: 912]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(orgObj._id, thisObj) ){
			throw new Meteor.Error("Duplicate found for this Org ID (_id): "+orgObj._id+". Aborting new org creation.");
			return false;
		}
		// TODO - Add callback to catch any error on insert?
		var dbNewORG = kb.collections[thisObj].insert(orgObj);
		console.log('addOrg() added Org: ',orgObj.title,orgObj._id);
		return { "orgObj": orgObj };
	},
	updateOrgField: function(dbId,field,newValue){
		console.log(">>> fn updateOrgField()",dbId,field,newValue);
		kb.collections[thisObj].update( dbId , { $set: { field : newValue } });
	},
	updateOrg: function(updatedObj, org_id){
		console.log(">>> fn updateOrg()",updatedObj, org_id);
		console.log("TODO - CREATE GENERIC updateObj PROTOTYPE!!!");

		// TODO: There should be a callback here to check that update succeeds!
		var success = kb.collections[thisObj].update( org_id, updatedObj );

		var updatedDbObj = kb.collections[thisObj].findOne( org_id );

		return { "org_id": org_id, "orgObj": updatedDbObj, "success": success };
	},
	deleteOrg: function(org_id, userId){
		// var res = MyCollections["Orgs"].findOne(id);
		var res = kb.collections[thisObj].findOne(org_id);

		serverlog({
			actor: userId,
			subject: org_id,
			object: (function(){ return "Org"; })(),
			message: "User '"+userId+"' requested to delete org: '"+org_id+"'"
		});

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');

			var msg = 'ERROR: You are not authorized to trash items owned by other users [error code: 34.6]';
			console.log(msg);
			serverlog({
				actor: userId,
				subject: org_id,
				object: "Org",
				message: msg
			});
			return false;
		} else {
			// MyCollections["Orgs"].remove(id);
			kb.collections[thisObj].remove(org_id);
			serverlog({
				actor: userId,
				subject: org_id,
				object: "Org",
				message: "User '"+userId+"' successfully deleted org: '"+org_id+"'"
			});
			return true;
		}
	},
	setPrivateOrg: function(id,private){
		// var res = MyCollections["Orgs"].findOne(id);
		var res = kb.collections[thisObj].findOne(id);

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			kb.collections[thisObj].update(id, { $set: {private: private}});
		}
	},
	setOrgStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = kb.collections[thisObj].findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.7]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			kb.collections[thisObj].update(id, { $set: {status: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("status set: ",kb.collections[thisObj].findOne(id));
		}
	}
});