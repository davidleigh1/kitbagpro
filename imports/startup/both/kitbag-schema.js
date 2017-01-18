console.log("RUN: 'kitbag-schema.js' at '/imports/startup/both'");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';


console.log("DEF: 'kb.Kitbags' Collection");
const Kitbags = new Mongo.Collection("kitbags");

// https://atmospherejs.com/aldeed/simple-schema

let KitbagSchema = new SimpleSchema({
	"_id": {
		type: String,
		optional: false,
		max: 20,
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			} else {
				return GlobalHelpers.idGenerator(uniqueIds.kbPrefix);
			}
		},		
		label: "Kitbag ID"
	},
	"title": {
		type: String,
		optional: false,
		defaultValue: function () {
			if (this.isSet == true){
				return this.value;
			}
		},		
		label: "Kitbag Name"
	},
	"status": {
		type: String,
		allowedValues: appSettings.kitbags.statuses,
		optional: true,
		defaultValue: "Active",
		label: "Kitbag Status"
	},
	"desc": {
		type: String,
		optional: true,
		max: 600,
		label: "Kitbag Description"
	},

	/* ASSOCIATED ORG */ /* Note that the Associated Org Title might change without the Org ID changing */

	"assocOrgId": {
		type: String,
		optional: true,
		label: "Associated Organisation ID"
	},
	"assocOrgTitle": {
		type: String,
		optional: true,
		label: "Associated Organisation Title",
	},
	"sku": {
		type: String,
		optional: true,
		label: "Org's SKU / Custom Kitbag ID"
	},

	/* BRANDING + RESOURCES */

	"imgLarge": {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url,		
		label: "Kitbag Photo"
	},
	"imgSmall": {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url,		
		label: "Kitbag Icon"
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
	}

	/* SHOULD WE INCLUDE assocItemIds[] HERE OR SHOULD WE LIST KITBAGS IN THE ITEM RECORDS? */


});

// console.log(KitbagSchema);
Kitbags.attachSchema( KitbagSchema );

// Assign to Global namespace
kb.collections.Kitbags = Kitbags;