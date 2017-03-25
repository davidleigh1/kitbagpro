// # methods related to this collection
console.log("RUN: items > methods.js");

	import { Meteor } from 'meteor/meteor';
	// import { ValidatedMethod } from 'meteor/mdg:validated-method';
	import { SimpleSchema } from 'meteor/aldeed:simple-schema';
	// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
	// import { _ } from 'meteor/underscore';

	import { kb } from "/imports/startup/both/sharedConstants.js";

/* METHODS */
	var thisCollectionName = "Items";

Meteor.methods({
	/* -- ITEM METHODS -- */
	addItem: function(itemObj){
		console.log('FN: Meteor.methods.addItem()(>>'+thisCollectionName+'<<)',itemObj);
		if(typeof itemObj != "object" || itemObj == false){
			console.log('ERROR: No itemObj received in request. DB insert action cancelled. Hint: Check getObjFromForm(); Missing itemTitle;  [error code: 909]');
			// TODO: Was there a reason this was originally returning "false" and "true" (as strings);
			return false;
		}
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(itemObj.id, thisCollectionName) ){
			throw new Meteor.Error("Duplicate found for Item: "+itemObj.id+". Aborting new item creation.");
			return false;
		}

		var dbNewItemId = kb.collections[thisCollectionName].insert(itemObj);
		/*
		returnObj{} will be passed to AutoForm.hooks.<formName>.onSuccess
		and then to globalSuccess() as resultObj{}
		*/
		var returnObj = {
			"id": dbNewItemId,
			"obj": itemObj,
			"thisAction": "insert",
			"thisCollectionName": thisCollectionName,
			"title": itemObj.title
		};		
		console.log('OK!: addItem() added Item: ',itemObj.title,itemObj._id,"\n",returnObj);
		return returnObj;

		// console.log('added Item: ',itemObj);
		// return { "itemId": itemObj.itemId, "itemObj": itemObj, "dbNewItem": dbNewItem };
	},
	updateItemField: function(dbId,field,newValue){
		console.log(">>> fn updateItemField()",dbId,field,newValue);
		kb.collections[thisCollectionName].update( dbId , { $set: { field : newValue } });
	},
	updateItem: function(updatedObj,documentId){
		console.log(">>> fn updateItem()",updatedObj,documentId);

		var editId,dbObj;
		if( updatedObj._id ){
			editId = updatedObj._id;
		}else{
			dbObj = kb.collections[thisCollectionName].findOne({itemId:updatedObj.itemId});
		}

		kb.collections[thisCollectionName].update( documentId, updatedObj );

		var itemId = kb.collections[thisCollectionName].findOne({_id:documentId},{ itemId:1 })["itemId"];

		// return { "itemId": itemId, "updatedObj": updatedObj, "id": documentId };
		/*
		returnObj{} will be passed to AutoForm.hooks.<formName>.onSuccess
		and then to globalSuccess() as resultObj{}
		*/
		var returnObj = {
			"id": documentId,
			"obj": updatedObj,
			"thisAction": "update",
			"thisCollectionName": thisCollectionName,
			"title": updatedObj.title || updatedObj.$set["title"]
		};		
		console.log('OK!: updateItem() updated Item: ',updatedObj.title,updatedObj._id,"\n",returnObj);
		return returnObj;
	},
	deleteItem: function(item_id){
		// var res = MyCollections["Items"].findOne(item_id);
		var res = kb.collections[thisCollectionName].findOne(item_id);

		if (res.owner !== Meteor.userId()){
			// throw new Meteor.Error('You are not authorized to trash items owned by other users (error code: 34.6)');
			console.log('ERROR: You are not authorized to trash items owned by other users [error code: 34.6]');
			return false;
		}else{
			// MyCollections["Items"].remove(item_id);
			kb.collections[thisCollectionName].remove(item_id);
		}
	},
	setPrivateItem: function(item_id, private){
		// var res = MyCollections["Items"].findOne(item_id);
		var res = kb.collections[thisCollectionName].findOne(item_id);

		if (res.owner !== Meteor.userId()){
			throw new Meteor.Error('ERROR: You are not authorized to change privacy for items owned by other users [error code: 34.5]');
		}else{
			kb.collections[thisCollectionName].update(item_id, { $set: {private: private}});
		}
	},
	setItemStatus: function(item_id,newStatus){
    // var res = MyCollections["Kitbags"].findOne(item_id);
		var res = kb.collections[thisCollectionName].findOne(item_id);
		console.log("setStatus("+item_id,newStatus+")");
		console.log("res: ",res);

		// TODO - Restrict delete/change state to only SuperAdmins/OrgAdmins and OrgManagers associated to assocated orgs

		kb.collections[thisCollectionName].update(item_id, { $set: {itemStatus: newStatus}});
		console.log("itemStatus set: ",kb.collections[thisCollectionName].findOne(item_id));
	}
});