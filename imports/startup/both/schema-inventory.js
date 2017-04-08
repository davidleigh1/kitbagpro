console.log("RUN: 'schema-inventory.js' at '/imports/startup/both'");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';


/* ==================================================================== */
/* 																		*/
/* CLIENT-SIDE HOOKS:                                                   */
/* /imports/ui/pages/inventory/add.js									*/
/* /imports/ui/pages/inventory/edit.js									*/
/* /imports/ui/pages/inventory/duplicate.js								*/
/* 																		*/
/* SERVER-SIDE HOOKS:                                                   */
/* /imports/api/inventory/server/publications.js						*/
/* 																		*/
/* OBJECT CREATION:  													*/
/* /imports/api/inventory/methods.js 									*/
/* 																		*/
/* ==================================================================== */

console.log("NEW: 'inventory' Collection");

// export const Items = new Mongo.Collection("items");
const inventory = new Mongo.Collection("inventory");

// https://atmospherejs.com/aldeed/simple-schema

let inventorySchema = new SimpleSchema({

	/* BASIC DETAILS */

		"something": {
			type: String,
			optional: false,
			label: "Something or Other"
		}
});

// console.log(ItemSchema);
inventory.attachSchema(inventorySchema);

// Assign to Global namespace
kb.collections.inventory = inventory;
