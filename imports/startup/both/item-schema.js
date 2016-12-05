console.log(" >>>> LOADING 'item-schema.js' (FROM /IMPORTS/STARTUP/BOTH) <<<< ");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { appSettings } from '/imports/startup/both/sharedConstants.js';



console.log(">>>>> 'Items' collection is defined here!");
export const Items = new Mongo.Collection("items");

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

let ItemSchema = new SimpleSchema({

	"itemId": {
		type: String,
		optional: false,
		max: 20,
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			} else {
				return GlobalHelpers.idGenerator(uniqueIds.itemPrefix);
			}
		},
		label: "External Item ID"
	},
	"itemTitle": {
		type: String,
		optional: true,
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			}
		},
		label: "Item Name"
	},
	"itemDetail": {
		type: String,
		optional: true,
		label: "Item Name 2"
	},
	"itemSize": {
		type: String,
		optional: true,
		allowedValues: appSettings.items.standardSizes,
		defaultValue: "One Size",
		label: "Item Size"
	},
	"patientAgeGroup": {
		type: String,
		optional: true,
		allowedValues: appSettings.items.patientAgeGroups,
		defaultValue: "One Size",
		label: "Patient Age Group"
	},
	"itemStatus": {
		type: String,
		allowedValues: appSettings.items.statuses,
		optional: true,
		defaultValue: "Active",
		label: "Item Status"
	},
	"itemDesc": {
		type: String,
		optional: true,
		max: 400,
		label: "Item Description"
	},

	/* SUPPLIER DETAILS */


	"itemManufacturer": {
		type: String,
		optional: true,
		label: "Item Brand/ Manufacturer/ Supplier"
	},
	"itemModel": {
		type: String,
		optional: true,
		label: "Item Model/ Version"
	},
	"itemPartNumber": {
		type: String,
		optional: true,
		label: "Manufacturer's Part ID/ Reference"
	},
	"itemEanUpc": {
		type: Number,
		optional: true,
		label: "EAN/UPC"
	},
	"itemSku": {
		type: String,
		optional: true,
		label: "Item SKU/ CustomID"
	},
	"itemUrl": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		label: "Item URL"
	},

	/* INVENTORY MANAGEMENT */

	"itemQMin": {
		type: Number,
		optional: true,
		defaultValue: 1,
		label: "Minimum Quantity (Qmin) of Item Required for Service"
	},
	"itemQRecommended": {
		type: Number,
		optional: true,
		defaultValue: 1,
		label: "Recommended Quantity (Qrec)"
	},
	"itemQMax": {
		type: Number,
		optional: true,
		defaultValue: 10,
		label: "Maximum Quantity (Qmax)"
	},
	"itemIsMandatory": {
		type: Boolean,
		optional: true,
		defaultValue: true,
		autoform: {
			leftLabel: true
		},
		label: "Qmin of this item is required for service"
	},

	/* BRANDING + RESOURCES */

	"itemImgLarge": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		defaultValue: "https://placeholdit.imgix.net/~text?txtsize=63&txt=Large%20Profile%20Photo&w=300&h=300",
		label: "Large Profile Photo"
	},
	"itemImgSmall": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		defaultValue: "https://placeholdit.imgix.net/~text?txtsize=20&txt=Small%20Item%20Photo%20or%20Icon&w=150&h=150",
		label: "Small Profile Photo or Icon"
	},

	/* DATA ADMIN + LOGGING */

	"createdVia": {
		type: String,
		optional: true,
		allowedValues: appSettings.global.createdVia,
		defaultValue: appSettings.global.createdViaDefault,
		label: "Creation Method"
	},
	"createdAt": {
		type: Date,
		optional: true,
		label: "Created Date"
	},
	"createdBy": {
		type: String,
		optional: true,
		defaultValue: "Unknown",
		label: "Created By User"
	},
	"updatedAt": {
		type: Date,
		optional: true,
		label: "Last Updated Date"
	},
	"updatedBy": {
		type: String,
		optional: true,
		defaultValue: "Unknown",
		label: "Last Updated By User"
	},
	// "owner": {
	// 	type: String,
	// 	optional: true, // TODO - Disabled for testing only!  Owner should be required for new record.
	// 	label: "Owner"
	// },

	/* ASSOCIATED ORG + KITBAGS */

	// "itemAssocOrg": {
	// 	type: String,
	// 	optional: true,
	// 	label: "Associated Org ID + Name" /* ONE ONLY - Format: orgId_orgTitle e.g. "12210deb6402efb6_New Test Org 23" */
	// },

	"itemAssocOrg": {
		type: String,
		optional: false,
		autoform: {
			options: function () {
				return GlobalHelpers.getOrgSelectList();
			}
		},
		label: "Organisation"
	},
	"itemAssocOrg.$": {
		type: String
	},

	"itemAssocKitbagCount": {
		type: Number,
		optional: true,
		defaultValue: 0,
		label: "Number of active kitbags containing this item" /* This should be equal to length of 'active' kitbags in assocKitbags array */
	},

	"assocKitbags": {
		type: Array,
		// type: select-checkbox,
		minCount: 1,
		// maxCount: 5,
		autoform: {
			options: function () {
				return GlobalHelpers.getFilteredListKitbags();
			}
		},
		label: "List of kitbags containing this item" /* Array contains list in format <_id>_<itemId>_<itemTitle>  */
	},
	"assocKitbags.$": {
		type: String
	}


	// "assocKitbags": {
	// 	// type: [String],
	// 	// optional: true,
	// 	// allowedValues: GlobalHelpers.getFilteredListKitbags(this)
	// 	// allowedValues: function () {
	// 	// 	return GlobalHelpers.getFilteredListKitbags(this);
	// 	// },
	// 	// autoform: {
	// 	// 	// afQuickField: {
	// 	// 		options: function () {
	// 	// 			return GlobalHelpers.getFilteredListKitbags();
	// 	// 		}
	// 	// 	// }
	// 	// },
	// 		// function () {
	// 		// 	return GlobalHelpers.getFilteredListKitbags();
	// 		// }
	// 	type: Array,
	// 	minCount: 1,
	// 	maxCount: 5,
	// 	label: "List of assigned kitbags",
	// 	autoform: {
	// 		options: [
	// 			{
	// 				label: "Red",
	// 				value: "red"
	// 			},
	// 			{
	// 				label: "Orange",
	// 				value: "orange"
	// 			},
	// 			{
	// 				label: "Yellow",
	// 				value: "yellow"
	// 			},
	// 			{
	// 				label: "Green",
	// 				value: "green"
	// 			},
	// 			{
	// 				label: "Blue",
	// 				value: "blue"
	// 			},
	// 			{
	// 				label: "Purple",
	// 				value: "purple"
	// 			}
	// 		]
	// 	}
	// },
	// "assocKitbags.$": {
	// 	type: String
	// }
});



// console.log(ItemSchema);
Items.attachSchema(ItemSchema);

