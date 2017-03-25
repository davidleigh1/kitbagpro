console.log("RUN: 'schema-item.js' at '/imports/startup/both'");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';


/* ==================================================================== */
/* 																		*/
/* CLIENT-SIDE HOOKS:                                                   */
/* /imports/ui/pages/items/add.js										*/
/* /imports/ui/pages/items/edit.js										*/
/* /imports/ui/pages/items/duplicate.js									*/
/* 																		*/
/* SERVER-SIDE HOOKS:                                                   */
/* /imports/api/items/server/publications.js							*/
/* 																		*/
/* OBJECT CREATION:  													*/
/* /imports/api/items/methods.js 										*/
/* 																		*/
/* ==================================================================== */

// console.log("NEW: 'Items' Collection");
console.log("NEW:"+"%ckb.collections.Items"+"%c Collection at '/imports/startup/both/schema-items.js'",appSettings.consoleCSS.code,'');

// export const Items = new Mongo.Collection("items");
const Items = new Mongo.Collection("items");

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

	/* BASIC DETAILS */

		"_id": {
			type: String,
			optional: false,
			max: 33,
			defaultValue: function () {
				if (this.isSet == true && this.value != ""){
					return this.value;
				} else {
					return GlobalHelpers.idGenerator(uniqueIds.itemPrefix);
				}
			},
			label: "Item ID"
		},
		"title": {
			type: String,
			optional: false,
			defaultValue: function () {
				if (this.isSet == true){
					return this.value;
				}
			},
			label: "Item Name"
		},
		"status": {
			type: String,
			allowedValues: appSettings.items.statuses,
			optional: true,
			defaultValue: "Active",
			label: "Item Status"
		},
		"desc": {
			type: String,
			optional: true,
			max: 600,
			label: "Item Description"
		},
		"detail": {
			type: String,
			optional: true,
			label: "Item Name 2"
		},

	/* ASSOCIATED ORG + KITBAGS */

		"assocOrgId": {		// Formerly "itemAssocOrg"
			type: String,
			optional: false,
			defaultValue: function () {
				if (this.isSet == true){
					return this.value;
				} else {
					return (FlowRouter.getParam('_kitbagId') || FlowRouter.getParam('_itemId')).split('-')[0] || "Not found [code: 1441]";
				}
			},	
			label: "Associated Organisation ID"
		},
		"assocKitbagsArray": {		// Was "assocKitbags"
			type: Array,
			minCount: 1,
			// maxCount: 5,
			defaultValue: function () {
				if (this.isSet == true){
					return this.value;
				} else {
					return FlowRouter.getParam('_kitbagId') || "Not found [code: 1440]";
				}
			},			
			autoform: {
				options: function (arg1, arg2) {
						var thisPageId = FlowRouter.getParam('_kitbagId') || FlowRouter.getParam('_itemId');
						var thisOrgId = (thisPageId) ? thisPageId.split('-')[0] : undefined;
						return GlobalHelpers.getFilteredListKitbags(thisOrgId);
				}
			},
			label: "Array of kitbags containing this item"
		},
		"assocKitbagsArray.$": {		// Was "assocKitbags"
			type: String
		},
		"assocKitbagCount": {
			type: Number,
			optional: true,
			defaultValue: 0,
			label: "Number of ACTIVE kitbags containing this item"
			/* Equal to count of 'active' kitbags in assocKitbags array */
		},

	/* DETAILED SPECIFICATIONS */

		"size": {
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

	/* SUPPLIER DETAILS */

		"manufacturer": {
			type: String,
			optional: true,
			label: "Item Brand/ Manufacturer/ Supplier"
		},
		"model": {
			type: String,
			optional: true,
			label: "Item Model/ Version"
		},
		"partNumber": {
			type: String,
			optional: true,
			label: "Manufacturer's Part ID/ Reference"
		},
		"eanUpc": {
			type: Number,
			optional: true,
			label: "EAN/UPC"
		},
		"sku": {
			type: String,
			optional: true,
			label: "Item SKU/ CustomID"
		},
		"url": {
			type: String,
			regEx: SimpleSchema.RegEx.Url,
			optional: true,
			label: "Item URL"
		},

	/* INVENTORY MANAGEMENT */

		"qMin": {
			type: Number,
			optional: true,
			defaultValue: 1,
			label: "Minimum Quantity (qMin) of Item Required for Service"
		},
		"qRecommended": {
			type: Number,
			optional: true,
			defaultValue: 1,
			label: "Recommended Quantity (qRec)"
		},
		"qMax": {
			type: Number,
			optional: true,
			defaultValue: 10,
			label: "Maximum Quantity (qMax)"
		},
		"isMandatory": {
			type: Boolean,
			optional: true,
			defaultValue: true,
			autoform: {
				leftLabel: true
			},
			label: "qMin of this item is required for service"
		},

	/* BRANDING + RESOURCES */

		"imgLarge": {
			type: String,
			optional: true,
			regEx: SimpleSchema.RegEx.Url,
			// defaultValue: "https://placeholdit.imgix.net/~text?txtsize=63&txt=Large%20Profile%20Photo&w=300&h=300",
			label: "Large Item Photo"
		},
		"imgSmall": {
			type: String,
			optional: true,
			regEx: SimpleSchema.RegEx.Url,
			// defaultValue: "https://placeholdit.imgix.net/~text?txtsize=20&txt=Small%20Item%20Photo%20or%20Icon&w=150&h=150",
			label: "Small Item Photo or Icon"
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

	/* THIS COLLECTION */

		"collection": {
			type: String,
			optional: false,
			allowedValues: appSettings.global.validObjects,
			defaultValue: "Items",
			label: "Collection"
		}

});

// console.log(ItemSchema);
Items.attachSchema(ItemSchema);

// Assign to Global namespace
kb.collections.Items = Items;
