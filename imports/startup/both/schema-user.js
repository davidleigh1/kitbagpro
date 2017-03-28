console.log("RUN: 'schema-user.js' at '/imports/startup/both'");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';


/* https://forums.meteor.com/t/config-accounts-createuser-to-have-only-one-email/943/3 */
Meteor.users._transform = function(user) {
	user.getEmail = function(){
		// console.log("this.emails: ",this.emails, typeof this.emails );
		var thisEmail = ( typeof this.emails == "object" ) ? this.emails[0]["address"] : "";
		return thisEmail;
	},
	user.getDisplayName = function(){
		return this.displayName || "";
	},
	user.getUserId = function(){
		return this._id || "";
	},
	user.getType = function(){
		var typeValue = ( typeof this.type == "string" ) ? this.type : "";
		var typeLabel = jQuery.isPlainObject(appSettings.users.allUserTypes2[typeValue]) ? appSettings.users.allUserTypes2[typeValue].label : "";
		var typeObj = { "value": typeValue, "label": typeLabel };
		// console.log("typeObj: ",typeObj);
		return typeObj;
	}
	return user;
};


/* ==================================================================== */
/* 																		*/
/* CLIENT-SIDE HOOKS:                                                   */
/* /imports/ui/pages/users/userEdit.js									*/
/* 																		*/
/* SERVER-SIDE HOOKS:                                                   */
/* /imports/api/users/server/publications.js							*/
/* 																		*/
/* OBJECT CREATION:  													*/
/* /imports/api/users/methods.js 										*/
/* 																		*/
/* ==================================================================== */

	// console.log("DEF: 'Users' Collection");
	// export const UserList = new Mongo.Collection("userlist");
	// Schema = {};

console.log("NEW: Extended Users Collection at '/imports/startup/both/schema-user.js'");

// const UserList = new Mongo.Collection("userlist");

// https://atmospherejs.com/aldeed/simple-schema

kb.schemas.UserSchema = new SimpleSchema({
	"_id": {		// Formerly: 'userId'
		type: String,
		optional: false,
		max: 50,
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			} else {
				return GlobalHelpers.idGenerator(uniqueIds.userPrefix);
			}
		},
		label: "User DBID"
	},
	"displayName": {
		type: String,
		optional: true,
		label: "Display Name"
	},	
    "username": {
        type: String,
		// For accounts-password, either emails or username is required,
		// but not both. It is OK to make this optional here because the
		// accounts-password package does its own validation.
		// Third-party login packages may not require either. 
		// Adjust this schema as necessary for your usage.
        optional: false,
        label: "Username/Login"
    },
    "emails": {
        type: Array,
		// For accounts-password, either emails or username is required,
		// but not both. It is OK to make this optional here because the
		// accounts-password package does its own validation.
		// Third-party login packages may not require either. 
		// Adjust this schema as necessary for your usage.
        optional: true,
        label: "Email"
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email"
    },
    "emails.$.verified": {
        type: Boolean,
		autoform: {
			leftLabel: true
		},
        label: "Email Verified"
    },
	"createdAt": { // DUPLICATE?????
		type: Date,
		optional: true,
		label: "Created on"
	},
	// "profile": {
	// 	type: Schema.UserProfile,
	// 	optional: true
	// },
	"services": {
		type: Object,
		optional: true,
		blackbox: true
	},
	// });
	
	
	// let UserListSchema = new SimpleSchema({

	// Schema.UserProfile = new SimpleSchema({

    // See: https://github.com/aldeed/meteor-autoform/issues/111
	// "adminResetPassword": {
	// 	type: String,
	// 	min: 8,
	// 	max: 25,
	// 	autoform: {
	// 		// type: "password"
	// 	},
	// 	label: "Password (8-25 in length)",
	// },

	// "displayName": {
	// 	type: String,
	// 	optional: true,
	// 	label: "Display Name"
	// },
	"callsign": {
		type: String,
		optional: true,
		label: "Call Sign"
	},
	"status": {
		type: String,
		optional: true,
		allowedValues: appSettings.users.statuses,
		defaultValue: "Active",
		autoform: {
			options: function () {
				return appSettings.users.statuses.map(function (element) { return {"value":element,"label":element}; });
			}
		},
		label: "User Status"
	},
	"type": {
		type: String,
		optional: true,
		defaultValue: "User",
		type: "select-radio-inline",
		// allowedValues: (function () {
		// 	appSettings.users.allUserTypes.map(function (element) { return element.value; });
		// }()),
		autoform: {
			options: function () {
				return appSettings.users.allUserTypes;
			}
		},
		label: "User Role"
	},
	"assocOrgId": {				
		/* NOTE: assocOrgId is also set for SuperAdmin Users */
		type: String,
		optional: true,
		autoform: {
			options: function () {
				return GlobalHelpers.getOrgSelectList();
			}
		},
		label: "Associated Organisation ID"
	},
	// "assocOrg.$": {
	// 	type: String
	// },
	"division": {		/* None or One */
		type: String,
		optional: true,
		allowedValues: appSettings.orgs.divisions,
		autoform: {
			options: function () {
				return appSettings.orgs.divisions.map(function (element) { return {"value":element,"label":element}; });
			}
		},
		// allowedValues: function () {
		// 	return GlobalHelpers.getListDivisions();
		// }
		label: "Division"
	},
	"team": {			/* None or More */
		type: String,
		optional: true,
		allowedValues: appSettings.orgs.teams,
		autoform: {
			options: function () {
				return appSettings.orgs.teams.map(function (element) { return {"value":element,"label":element}; });
			}
		},
		label: "Teams"
	},
	"defaultStore": {
		type: String,
		optional: true,
		label: "Local Storeroom"
	},
	"phoneNumber": {
		type: String,
		optional: true,
		label: "Phone number"
	},
	"profilePicture": {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		optional: true,
		label: "Profile Photo or Avatar"
	},
	"desc": {
		type: String,
		optional: true,
		label: "Notes"
	},

	/* ASSOCIATED KITBAGS */

	"assocKitbagCount": {
		type: Number,
		optional: true,
		defaultValue: 0,
		label: "Kitbags count"
		/*
		This should be equal to length of 
		'active' kitbags in assocKitbagIds array 
		*/
	},
	"assocKitbagIds": {			/* None or More */
		type: Array,
		optional: true,
		// autoform: {
		// 	options: function () {
		// 		return GlobalHelpers.getFilteredListKitbags();
		// 	}
		// },
		label: "List of Assigned kitbags"
	},
	"assocKitbagIds.$": {
		type: String
	},


	/* DATA ADMIN + LOGGING */

	"createdVia": {
		type: String,
		optional: true,
		allowedValues: appSettings.global.createdVia,
		defaultValue: "ManualFormEntry",
		label: "Created via"
	},
	// "createdAt": {
	// 	type: Date,
	// 	optional: true,
	// 	label: "Created Date"
	// },
	"createdBy": {
		type: String,
		optional: true,
		autoform: {
			// hidden: true,
			// label: false
		},
		label: "Created by"
	},
	"updatedAt": {
		type: Date,
		optional: true,
		label: "Updated on"
	},
	"updatedBy": {
		type: String,
		optional: true,
		autoform: {
			// hidden: true,
			// label: false
		},
		label: "Updated by"
	},

	/* THIS OBJECT */

	"collection": {
		type: String,
		optional: false,
		allowedValues: appSettings.global.validObjects,
		defaultValue: "Users",
		label: "Collection"
	}
});


// UserList.attachSchema(User);
Meteor.users.attachSchema(kb.schemas.UserSchema);

// Assign to Global namespace
kb.collections.Users = Meteor.users;