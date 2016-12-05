// # methods related to this collection
console.log("RUNNING items > methods.js");

import { Meteor } from 'meteor/meteor';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { Items } from '/imports/startup/both/item-schema.js';
// import { Items } from './items.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';


Meteor.methods({

	/* -- ORGANISATION METHODS -- */
	addItem: function(itemObj){
		console.log('fn Meteor.methods.addItem()',itemObj);
		if(typeof itemObj != "object" || itemObj == false){
			console.log('ERROR: No itemObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing itemTitle;  [error code: 909]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
		var dbNewItem = Items.insert(itemObj);
		console.log('added Item: ',itemObj);
		return { "itemId": itemObj.itemId, "itemObj": itemObj, "dbNewItem": dbNewItem };
	},
	updateItemField: function(dbId,field,newValue){
		console.log(">>> fn updateItemField()",dbId,field,newValue);
		Items.update( dbId , { $set: { field : newValue } });
	},
	updateItem: function(updatedObj,documentId){
		console.log(">>> fn updateItem()",updatedObj,documentId);

		var editId,dbObj;
		if( updatedObj._id ){
			editId = updatedObj._id;
		}else{
			dbObj = Items.findOne({itemId:updatedObj.itemId});
		}

		Items.update( documentId, updatedObj );

		var itemId = Items.findOne({_id:documentId},{ itemId:1 })["itemId"];

		return { "itemId": itemId, "updatedObj": updatedObj, "documentId": documentId };
	},
	deleteItem: function(id){
		// var res = MyCollections["Items"].findOne(id);
		var res = Items.findOne(id);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
			// MyCollections["Items"].remove(id);
			Items.remove(id);
		}
	},
	setPrivateItem: function(id,private){
		// var res = MyCollections["Items"].findOne(id);
		var res = Items.findOne(id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			// Kitbags.update(id, { $set: {private: private}});
			Items.update(id, { $set: {private: private}});
		}
	},
	setItemStatus: function(id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(id);
		var res = Items.findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		// TODO - Restrict delete/change state to only SuperAdmins/OrgAdmins and OrgManagers associated to assocated orgs


		// if (res.owner !== Meteor.userId()){
		// 	throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.7]');
		// }else{
      // MyCollections["Kitbags"].update(id, { $set: {kitbagStatus: newStatus}});
			Items.update(id, { $set: {itemStatus: newStatus}});
      // console.log("kitbagStatus set: ",MyCollections["Kitbags"].findOne(id));
			console.log("itemStatus set: ",Items.findOne(id));
		// }
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