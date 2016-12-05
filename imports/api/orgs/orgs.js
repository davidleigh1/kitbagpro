// # definition of this collection

console.log(">>>>> Empty 'orgs.js' at imports/api/orgs/orgs.js");

// import { Mongo } from 'meteor/mongo';
// import { Factory } from 'meteor/factory';
// import faker from 'faker';

// import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// matb33:collection-hooks

// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Orgs } from '../orgs/orgs.js';

// import { appSettings } from '/imports/startup/both/sharedConstants.js';


// console.log(">>>>> 'MyCollections.Orgs' is defined here!");
// console.log(">>>>> 'Orgs' is defined here!");

// MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};

// export const MyCollections.Orgs    = new Mongo.Collection("orgs");
// MyCollections.listOrgStatuses    = ["Active","Hidden","Deleted"];

// export const Orgs                                 = new Mongo.Collection("orgs");
// export const listOrgStatuses                      = ["Active","Hidden","Trashed"];
// export const listOrgStatusesIncludedInAllCount    = ["Active","Hidden"];
// export const listOrgStatusesIncludedInActiveCount = ["Active"];

// export const config = ( typeof config != "undefined" && typeof config == "object" ) ? config : {};

// console.log(">>> ORGS.JS - config:",typeof config,config);

// console.log(">>> ORGS.JS - config:",config);

// export const config;

// if (Meteor.isDevelopment) {
//   Collections = require('./lib/collections').default
// }


// orgs.helpers({
// 	delete: function (doc) {
// 		console.log("ORGS.DELETE() ",doc)
// 		var areYouSure = "Org Helper! Are you sure you want to permanently delete org '"+doc.orgTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
// 		if ( confirm(areYouSure) ) {
// 			Meteor.call("deleteOrg",doc._id);
// 		} else {
// 			return false;
// 		}
// 	}
// });







// /* Server Only */

// Orgs.after.update(function (userId, doc, fieldNames, modifier) {
// 	if (doc.orgTitle !== this.previous.orgTitle) {
// 		console.log("\n\n=====================\nUpdating 'Kitbags' records where\n'kitbagAssocOrg' value of '"+doc.orgId+"'\nnew 'kitbagAssocOrgTitle' is '"+doc.orgTitle+"' replacing '"+this.previous.orgTitle+"'\n=====================\n\n");
// 		// Kitbags.update({kitbagAssocOrg: doc.orgId}, {kitbagAssocOrgTitle: doc.orgTitle}, {multi: true});
// 	}else{
// 		console.log("\n\n=====================\norgTitle not updated!\n=====================\n\n");
// 	}
// });




/*
class TodosCollection extends Mongo.Collection {
	insert(doc, callback) {
		const ourDoc = doc;
		ourDoc.createdAt = ourDoc.createdAt || new Date();
		const result = super.insert(ourDoc, callback);
		incompleteCountDenormalizer.afterInsertTodo(ourDoc);
		return result;
	}
	update(selector, modifier) {
		const result = super.update(selector, modifier);
		incompleteCountDenormalizer.afterUpdateTodo(selector, modifier);
		return result;
	}
	remove(selector) {
		const todos = this.find(selector).fetch();
		const result = super.remove(selector);
		incompleteCountDenormalizer.afterRemoveTodos(todos);
		return result;
	}
}

export const Todos = new TodosCollection('Todos');

// Deny all client-side updates since we will be using methods to manage this collection
Todos.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});

Todos.schema = new SimpleSchema({
	_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
	},
	listId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		denyUpdate: true,
	},
	text: {
		type: String,
		max: 100,
	},
	createdAt: {
		type: Date,
		denyUpdate: true,
	},
	checked: {
		type: Boolean,
		defaultValue: false,
	},
});

Todos.attachSchema(Todos.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Todos.publicFields = {
	listId: 1,
	text: 1,
	createdAt: 1,
	checked: 1,
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'todo', 'emptyTodo', 'checkedTodo'
Factory.define('todo', Todos, {
	listId: () => Factory.get('list'),
	text: () => faker.lorem.sentence(),
	createdAt: () => new Date(),
});

Todos.helpers({
	list() {
		return Lists.findOne(this.listId);
	},
	editableBy(userId) {
		return this.list().editableBy(userId);
	},
});
*/