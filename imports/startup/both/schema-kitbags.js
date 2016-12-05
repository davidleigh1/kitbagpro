console.log("RUNNING KitbagSchema");

import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { listKitbagStatuses } from '/imports/api/kitbags/kitbags.js';
import { appSettings } from '/imports/startup/both/sharedConstants.js';



/*
MyCollections = ( typeof MyCollections != "undefined" && typeof MyCollections == "object" ) ? MyCollections : {};
MyCollections.Kitbags = new Mongo.Collection("kitbags");

MyCollections.listKitbagStatuses = ["Active","Hidden","Trashed"];

*/

/*
Orgs2.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Orgs2.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});
*/

// https://atmospherejs.com/aldeed/simple-schema

let KitbagSchema = new SimpleSchema({
	"kitbagId": {
		type: String,
		optional: false,
		max: 20,
		label: "Kitbag ID"
	},
	"kitbagStatus": {
		type: String,
		// allowedValues: listKitbagStatuses,
		allowedValues: appSettings.kitbags.statuses,
		optional: true,
		/*defaultValue: "Active",*/
		autoValue: function () {
			if (this.isSet == true){
				return this.value;
			} else {
				return "Active"; /* This replaces the need for the defaultValue setting*/
			}
		},
		label: "Kitbag Status"
	},
	"kitbagTitle": {
		type: String,
		optional: false,
		label: "Kitbag Name"
	},
	"kitbagDesc": {
		type: String,
		optional: true,
		max: 400,
		label: "Kitbag Description"
	},
	"kitbagSku": {
		type: String,
		optional: true,
		label: "Kitbag SKU/CustomID"
	},
	"kitbagAssocOrg": {
		type: String,
		optional: true,
		label: "Associated Organisation ID"
	},
	"kitbagAssocOrgTitle": {
		type: String,
		label: "Associated Organisation Title",
		// autoValue: function () {
		// 	return GlobalHelpers.lookupFieldFromOrg(this.kitbagAssocOrg , 'orgTitle' )
		// },
/*		autoValue: function() {
			var orgId = this.field("kitbagAssocOrg");
			if (orgId.isSet) {
				return orgId.value;
			} else {
				this.unset();
			}
		}*/
	},
//	"kitbagContactPerson": {
//		type: String,
//		optional: true,
//		label: "Contact Person"
//	},
//	"kitbagContactPhone": {
//		type: String,
//		optional: true,
//		label: "Contact Phone Number"
//	},
//	"kitbagContactEmail": {
//		type: String,
//		optional: true,
//		label: "Contact Email Address"
//	},
	"kitbagImgLarge": {
		type: String,
		optional: true,
		label: "Profile Photo"
	},
	"kitbagImgSmall": {
		type: String,
		optional: true,
		label: "Profile Icon"
	},
	"createdVia": {
		type: String,
		optional: true,
		allowedValues: appSettings.global.createdVia,
		label: "Creation Method"
	},
	"createdAt": {
		type: Date,
		optional: false,
		label: "Created Date"
	},
	"createdBy": {
		type: String,
		optional: true,
		label: "Created By User"
	},
	"updatedAt": {
		type: Date,
		optional: false,
		label: "Last Updated Date"
	},
	"updatedBy": {
		type: String,
		optional: true,
		label: "Last Updated By User"
	}
	// "owner": {
	// 	type: String,
	// 	optional: false,
	// 	label: "Owner"
	// },
});

// console.log(KitbagSchema);
Kitbags.attachSchema( KitbagSchema );