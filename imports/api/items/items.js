// # definition of this collection

console.log(">>>>> Empty 'items.js' at imports/api/items/items.js");

/*
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
console.log(">>>>> 'Items' is AGAIN defined here!");
export const Items = new Mongo.Collection("items");
*/





// import { Factory } from 'meteor/factory';
// import faker from 'faker';

// import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';
// matb33:collection-hooks

// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '../items/items.js';

// import { appSettings } from '/imports/startup/both/sharedConstants.js';


// console.log(">>>>> 'MyCollections.Items' is defined here!");

// MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};

// export const MyCollections.Items    = new Mongo.Collection("items");
// MyCollections.listItemStatuses    = ["Active","Hidden","Deleted"];

// Items = new Mongo.Collection("items");


// console.log("RUNNING ItemSchema from ITEMS.JS");

// import { Items } from '/imports/api/items/items.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { appSettings } from '/imports/startup/both/sharedConstants.js';


// https://atmospherejs.com/aldeed/simple-schema

/*
[X] Associated Kitbags	array of Kitbag IDs
[ ] Associated Pack	array of Pack IDs
[X] ID (internal ID)	integer
[X] Name	string
[X] Description	string
[X] SKU (external ID)	string
[ ] Photo	URL/File
[X] Min Required	integer
[X] Max Required	integer
[X] Is mandatory (for duty)	boolean
[ ] Is container (for a kit)	ID
[ ] Is component of an item	ID
[ ] Alternative Items	array of Item IDs
[ ] Associates Items	array of Item IDs
[X] Created date	date
[X] Last edited date	date
[X] Expiry date????
*/



// console.log(ItemSchema);
// Items.attachSchema(ItemSchema);

// export const Items;



// export const listItemStatuses                      = ["Active","Hidden","Trashed"];
// export const listItemStatusesIncludedInAllCount    = ["Active","Hidden"];
// export const listItemStatusesIncludedInActiveCount = ["Active"];

// export const config = ( typeof config != "undefined" && typeof config == "object" ) ? config : {};

// console.log(">>> ITEMS.JS - config:",typeof config,config);

// console.log(">>> ITEMS.JS - config:",config);

// export const config;

// if (Meteor.isDevelopment) {
//   Collections = require('./lib/collections').default
// }


// items.helpers({
// 	delete: function (doc) {
// 		console.log("ITEMS.DELETE() ",doc)
// 		var areYouSure = "Item Helper! Are you sure you want to permanently delete item '"+doc.itemTitle+"'?\n\n>> There is no way back! <<\n\nSuggestion: Click 'Cancel' and then 'Trash' it instead...\n"
// 		if ( confirm(areYouSure) ) {
// 			Meteor.call("deleteItem",doc._id);
// 		} else {
// 			return false;
// 		}
// 	}
// });







// /* Server Only */

// Items.after.update(function (userId, doc, fieldNames, modifier) {
// 	if (doc.itemTitle !== this.previous.itemTitle) {
// 		console.log("\n\n=====================\nUpdating 'Kitbags' records where\n'kitbagAssocItem' value of '"+doc.itemId+"'\nnew 'kitbagAssocItemTitle' is '"+doc.itemTitle+"' replacing '"+this.previous.itemTitle+"'\n=====================\n\n");
// 		// Kitbags.update({kitbagAssocItem: doc.itemId}, {kitbagAssocItemTitle: doc.itemTitle}, {multi: true});
// 	}else{
// 		console.log("\n\n=====================\nitemTitle not updated!\n=====================\n\n");
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