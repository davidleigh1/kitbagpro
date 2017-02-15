console.log("RUN: orgs > methods.js");

/* IMPORT METEOR PACKAGES */
	import { Meteor } from 'meteor/meteor';
	// import { ValidatedMethod } from 'meteor/mdg:validated-method';
	import { SimpleSchema } from 'meteor/aldeed:simple-schema';
	// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
	// import { _ } from 'meteor/underscore';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS */
	var thisObj = "Orgs";


/* -- ORGANISATION METHODS -- */
Meteor.methods({
	addOrg: function(orgObj){
		console.log('FN: Meteor.methods.addOrg()(>>'+thisObj+'<<)',orgObj);
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
		var returnObj = {
			"thisAction": "insert",
			"thisObj": thisObj,
			"obj": orgObj,
			"title": orgObj.title,
			"id": dbNewORG
		};
		console.log('addOrg() added Org: ', orgObj.title, orgObj._id, "\n", returnObj);
		return returnObj;
	},
	updateOrgField: function(org_id, field, newValue){
		// console.log("FN: Meteor.methods.updateOrgField()", org_id, field, newValue);
		// kb.collections[thisObj].update( org_id , { $set: { field : newValue } });	
		setDocField(thisObj, org_id, field, newValue);
	},
	// deleteOrg: function(org_id, userId){
	// 	// var res = MyCollections["Orgs"].findOne(id);
	// 	var res = kb.collections[thisObj].findOne(org_id);

	// 	serverlog({
	// 		actor: userId,
	// 		subject: org_id,
	// 		object: (function(){ return "Org"; })(),
	// 		message: "User '"+userId+"' requested to delete org: '"+org_id+"'"
	// 	});

	// 	if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
	// 		// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');

	// 		var msg = 'ERROR: You are not authorized to trash items owned by other users [error code: 34.6]';
	// 		console.log(msg);
	// 		serverlog({
	// 			actor: userId,
	// 			subject: org_id,
	// 			object: "Org",
	// 			message: msg
	// 		});
	// 		return false;
	// 	} else {
	// 		// MyCollections["Orgs"].remove(id);
	// 		kb.collections[thisObj].remove(org_id);
	// 		serverlog({
	// 			actor: userId,
	// 			subject: org_id,
	// 			object: "Org",
	// 			message: "User '"+userId+"' successfully deleted org: '"+org_id+"'"
	// 		});
	// 		return true;
	// 	}
	// },
	// setPrivateOrg: function(org_id,private){
	// 	var res = kb.collections[thisObj].findOne(org_id);

	// 	if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
	// 		throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
	// 	}else{
	// 		kb.collections[thisObj].update(org_id, { $set: {private: private}});
	// 	}
	// },
	// setOrgStatus: function(org_id,newStatus){
 //    // var res = MyCollections["Kitbags"].findOne(id);
	// 	var res = kb.collections[thisObj].findOne(org_id);
	// 	console.log("setStatus("+org_id,newStatus+")");
	// 	console.log("res: ",res);

	// 	if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
	// 		throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.7]');
	// 	}else{
	// 		kb.collections[thisObj].update(org_id, { $set: {status: newStatus}});
	// 		console.log("status set: ",kb.collections[thisObj].findOne(org_id));
	// 	}
	// }
});