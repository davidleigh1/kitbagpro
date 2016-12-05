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



/*

const LIST_ID_ONLY = new SimpleSchema({
	listId: { type: String },
}).validator();

export const insert = new ValidatedMethod({
	name: 'lists.insert',
	validate: new SimpleSchema({}).validator(),
	run() {
		return Lists.insert({});
	},
});

export const makePrivate = new ValidatedMethod({
	name: 'lists.makePrivate',
	validate: LIST_ID_ONLY,
	run({ listId }) {
		if (!this.userId) {
			throw new Meteor.Error('lists.makePrivate.notLoggedIn',
				'Must be logged in to make private lists.');
		}

		const list = Lists.findOne(listId);

		if (list.isLastPublicList()) {
			throw new Meteor.Error('lists.makePrivate.lastPublicList',
				'Cannot make the last public list private.');
		}

		Lists.update(listId, {
			$set: { userId: this.userId },
		});
	},
});

export const makePublic = new ValidatedMethod({
	name: 'lists.makePublic',
	validate: LIST_ID_ONLY,
	run({ listId }) {
		if (!this.userId) {
			throw new Meteor.Error('lists.makePublic.notLoggedIn',
				'Must be logged in.');
		}

		const list = Lists.findOne(listId);

		if (!list.editableBy(this.userId)) {
			throw new Meteor.Error('lists.makePublic.accessDenied',
				'You don\'t have permission to edit this list.');
		}

		// XXX the security check above is not atomic, so in theory a race condition could
		// result in exposing private data
		Lists.update(listId, {
			$unset: { userId: true },
		});
	},
});

export const updateName = new ValidatedMethod({
	name: 'lists.updateName',
	validate: new SimpleSchema({
		listId: { type: String },
		newName: { type: String },
	}).validator(),
	run({ listId, newName }) {
		const list = Lists.findOne(listId);

		if (!list.editableBy(this.userId)) {
			throw new Meteor.Error('lists.updateName.accessDenied',
				'You don\'t have permission to edit this list.');
		}

		// XXX the security check above is not atomic, so in theory a race condition could
		// result in exposing private data

		Lists.update(listId, {
			$set: { name: newName },
		});
	},
});

export const remove = new ValidatedMethod({
	name: 'lists.remove',
	validate: LIST_ID_ONLY,
	run({ listId }) {
		const list = Lists.findOne(listId);

		if (!list.editableBy(this.userId)) {
			throw new Meteor.Error('lists.remove.accessDenied',
				'You don\'t have permission to remove this list.');
		}

		// XXX the security check above is not atomic, so in theory a race condition could
		// result in exposing private data

		if (list.isLastPublicList()) {
			throw new Meteor.Error('lists.remove.lastPublicList',
				'Cannot delete the last public list.');
		}

		Lists.remove(listId);
	},
});

// Get list of all method names on Lists
const LISTS_METHODS = _.pluck([
	insert,
	makePublic,
	makePrivate,
	updateName,
	remove,
], 'name');

if (Meteor.isServer) {
	// Only allow 5 list operations per connection per second
	DDPRateLimiter.addRule({
		name(name) {
			return _.contains(LISTS_METHODS, name);
		},

		// Rate limit per connection ID
		connectionId() { return true; },
	}, 5, 1000);
}
*/