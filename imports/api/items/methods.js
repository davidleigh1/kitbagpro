// # methods related to this collection
console.log("RUN: items > methods.js");

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
	deleteItem: function(item_id){
		// var res = MyCollections["Items"].findOne(item_id);
		var res = Items.findOne(item_id);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
			// MyCollections["Items"].remove(item_id);
			Items.remove(item_id);
		}
	},
	setPrivateItem: function(item_id, private){
		// var res = MyCollections["Items"].findOne(item_id);
		var res = Items.findOne(item_id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			Items.update(item_id, { $set: {private: private}});
		}
	},
	setItemStatus: function(item_id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(item_id);
		var res = Items.findOne(item_id);
		console.log("setStatus("+item_id,newStatus+")");
		console.log("res: ",res);

		// TODO - Restrict delete/change state to only SuperAdmins/OrgAdmins and OrgManagers associated to assocated orgs

		Items.update(item_id, { $set: {itemStatus: newStatus}});
		console.log("itemStatus set: ",Items.findOne(item_id));
	}
});