console.log(" >>>> LOADING 'org-schema.js' (FROM /IMPORTS/STARTUP/BOTH) <<<< ");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { appSettings } from '/imports/startup/both/sharedConstants.js';



console.log(">>>>> 'Orgs' collection is defined here!");
export const Orgs = new Mongo.Collection("orgs");

// https://atmospherejs.com/aldeed/simple-schema

let OrgSchema = new SimpleSchema({
	"orgId": {
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
	"orgTitle": {
		type: String,
		optional: false,
		defaultValue: function () {
			if (this.isSet == true){
				return this.value;
			}
		},
		label: "Organisation Name"
	},
	"orgStatus": {
		type: String,
		allowedValues: appSettings.orgs.statuses,
		optional: true,
		defaultValue: "Active",
		label: "Organisation Status"
	},
	"orgDesc": {
		type: String,
		optional: true,
		max: 600,
		label: "Organisation Description"
	},

	/* CONTACT DETAILS */

	"orgIsOfficial": {
		type: Boolean,
		optional: true,
		autoform: {
			leftLabel: true
		},
		label: "Is Official Account"
	},
	"orgContactPerson": {
		type: String,
		optional: true,
		label: "Contact Person"
	},
	"orgContactPhone": {
		type: String,
		optional: true,
		label: "Contact Phone Number"
	},
	"orgContactEmail": {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		optional: true,
		label: "Contact Email Address"
	},
	"orgUrl": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		label: "Organisation Website"
	},

	/* BRANDING + RESOURCES */

	"orgImgLarge": {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url,
		label: "Profile Photo"
	},
	"orgImgSmall": {
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

	"orgAssocKitbagCount": {
		type: Number,
		optional: true,
		defaultValue: 0,
		label: "Number of Org kitbags"
	},
	"orgAssocKitbagIds": {
		type: Array,
		optional: true,
		label: "List of Org kitbags"
	},
	"orgAssocKitbagIds.$": {
		type: String
	}
});

// console.log(OrgSchema);
Orgs.attachSchema( OrgSchema );