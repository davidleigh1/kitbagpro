// # methods related to this collection
console.log("RUNNING orgs > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

// import { Orgs } from './orgs.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';

/* METHODS */

Meteor.methods({

	/* -- ORGANISATION METHODS -- */
	addOrg: function(orgObj){
		console.log('fn Meteor.methods.addOrg()',orgObj);
		if(typeof orgObj != "object" || orgObj == false){
			console.log('ERROR: No orgObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing orgTitle;  [error code: 912]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(orgObj.orgId,"Orgs") ){
			throw new Meteor.Error("Duplicate found for orgId: "+orgObj.orgId+". Aborting new org creation.");
			return false;
		}

		var dbNewORG = Orgs.insert(orgObj);
		console.log('added Org: ',orgObj);
		// return dbNewORG;
		return { "orgId": orgObj.orgId, "orgObj": orgObj, "dbNewItem": dbNewORG };
	},
	updateOrgField: function(dbId,field,newValue){
		console.log(">>> fn updateOrgField()",dbId,field,newValue);
		Orgs.update( dbId , { $set: { field : newValue } });
	},
	updateOrg: function(updatedObj,documentId){
		console.log(">>> fn updateOrg()",updatedObj,documentId);

		var editId,dbObj;
		if( updatedObj._id ){
			editId = updatedObj._id;
		}else{
			dbObj = Orgs.findOne({orgId:updatedObj.orgId});
		}

		Orgs.update( documentId, updatedObj );

		var orgId = Orgs.findOne({_id:documentId},{ orgId:1 })["orgId"];

		return { "orgId": orgId, "updatedObj": updatedObj, "documentId": documentId };
	},

	// EX_updateOrg: function(updatedObj,checked){
	// 	console.log(">>> fn updateOrg()",updatedObj);
	// 	// var res = MyCollections["Orgs"].findOne(id);
	// 	// var dbOrg = MyCollections["Orgs"].findOne({orgId:updatedObj.orgId});
	// 	var dbOrg = Orgs.findOne({orgId:updatedObj.orgId});
	// 	var editId = dbOrg._id;
	// 	// console.log("OrgId to be updated: ",editId);
	// 	// console.log("updatedObj: ",updatedObj);

	// 	if (updatedObj._id) {
	// 		// http://stackoverflow.com/questions/24103966/
	// 		console.log("deleting: ",updatedObj._id);
	// 		delete updatedObj._id;
	// 	}

	// 	// MyCollections["Orgs"].update(editId, { $set: updatedObj});
	// 	Orgs.update(editId, { $set: updatedObj});

	// 	// TODO: Add "LastUpdatedAt" and "LastUpdatedBy" fields - will be used for debugging and sorting

	// 	//		TODO: Restore protection to avoid non-associated users from updating objects
	// 	//		if (res.owner !== Meteor.userId()){
	// 	//			//throw new Meteor.Error('You are not authorized to update items owned by other users (error code: 34.7)');
	// 	//			console.log('ERROR: You are not authorized to update items owned by other users [error code: 347]');
	// 	//			return false;
	// 	//		}else{
	// 	// //      MyCollections["Orgs"].update(id, { $set: {checked: checked}});
	// 	//			MyCollections["Orgs"].update(id, { $set: {checked: checked}});
	// 	//		}
	// },
	deleteOrg: function(orgId, userId){
		// var res = MyCollections["Orgs"].findOne(id);
		var res = Orgs.findOne(orgId);

		serverlog({
			actor: userId,
			subject: orgId,
			object: (function(){ return "Org"; })(),
			message: "User '"+userId+"' requested to delete org: '"+orgId+"'"
		});

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');

			var msg = 'ERROR: You are not authorized to trash items owned by other users [error code: 34.6]';
			console.log(msg);
			serverlog({
				actor: userId,
				subject: orgId,
				object: "Org",
				message: msg
			});
			return false;
		} else {
			// MyCollections["Orgs"].remove(id);
			Orgs.remove(orgId);
			serverlog({
				actor: userId,
				subject: orgId,
				object: "Org",
				message: "User '"+userId+"' successfully deleted org: '"+orgId+"'"
			});
			return true;
		}
	},
	setPrivateOrg: function(id,private){
		// var res = MyCollections["Orgs"].findOne(id);
		var res = Orgs.findOne(id);

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			// Kitbags.update(id, { $set: {private: private}});
			Orgs.update(id, { $set: {private: private}});
		}
	},
	setOrgStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Orgs.findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		if ( !fn_userIsSuperAdmin && res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.7]');
		}else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			Orgs.update(id, { $set: {orgStatus: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("orgStatus set: ",Orgs.findOne(id));
		}
	}
});