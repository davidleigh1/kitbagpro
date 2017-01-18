console.log("RUN: 'schema-org.js' at '/imports/startup/both'");

import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


console.log("DEF: 'Orgs' Collection");
const Orgs = new Mongo.Collection("orgs");

// https://atmospherejs.com/aldeed/simple-schema

let OrgSchema = new SimpleSchema({
	"_id": {
		type: String,
		optional: false,
		max: 20,
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			} else {
				return GlobalHelpers.idGenerator(uniqueIds.orgPrefix);
			}
		},
		label: "Organisation ID"
	},
	"title": {
		type: String,
		optional: false,
		defaultValue: function () {
			if (this.isSet == true){
				return this.value;
			}
		},
		label: "Organisation Name"
	},
	"status": {
		type: String,
		allowedValues: appSettings.orgs.statuses,
		optional: true,
		defaultValue: "Active",
		label: "Organisation Status"
	},
	"desc": {
		type: String,
		optional: true,
		max: 600,
		label: "Organisation Description"
	},

	/* CONTACT DETAILS */

	"isOfficial": {
		type: Boolean,
		optional: true,
		autoform: {
			leftLabel: true
		},
		label: "Is Official Account"
	},
	"contactPerson": {
		type: String,
		optional: true,
		label: "Contact Person"
	},
	"contactPhone": {
		type: String,
		optional: true,
		label: "Contact Phone Number"
	},
	"contactEmail": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		label: "Contact Email Address"
	},
	"url": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		label: "Organisation Website"
	},

	/* BRANDING + RESOURCES */

	"imgLarge": {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url,
		label: "Profile Photo"
	},
	"imgSmall": {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url,
		label: "Profile Icon"
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

	/* ASSOCIATED KITBAGS */

	"assocKitbagCount": {
		type: Number,
		optional: true,
		defaultValue: 0,
		label: "Number of Org kitbags"
	},
	"assocKitbagIds": {
		type: Array,
		optional: true,
		label: "List of Org kitbags"
	},
	"assocKitbagIds.$": {
		type: String
	}
});

// console.log(OrgSchema);
Orgs.attachSchema( OrgSchema );

// Assign to Global namespace
kb.collections.Orgs = Orgs;
