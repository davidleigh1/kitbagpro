console.log(" >>>> LOADING 'user-schema.js' (FROM /IMPORTS/STARTUP/BOTH) <<<< ");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { appSettings } from '/imports/startup/both/sharedConstants.js';


/* https://forums.meteor.com/t/config-accounts-createuser-to-have-only-one-email/943/3 */
Meteor.users._transform = function(user) {
	user.getEmail = function(){
		// console.log("this.emails: ",this.emails, typeof this.emails );
		var thisEmail = ( typeof this.emails == "object" ) ? this.emails[0]["address"] : "";
		return thisEmail;
	},
	user.getDisplayName = function(){
		// return this.profile.displayName;
		return ( typeof this.profile == "object" ) ? this.profile.displayName : "";
	},
	user.getUserId = function(){
		// return this.profile.userId;
		return ( typeof this.profile == "object" ) ? this.profile.userId : "";
	},
	user.getType = function(){
		var typeValue = ( typeof this.profile == "object" ) ? this.profile.userType : "";
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
/* USER CREATION:  														*/
/* /imports/api/users/methods.js 										*/
/* 																		*/
/* ==================================================================== */

console.log(">>>>> 'Users' schema is defined here!");
export const UserList = new Mongo.Collection("userlist");

Schema = {};

Schema.UserProfile = new SimpleSchema({

 //    // See: https://github.com/aldeed/meteor-autoform/issues/111
	// "adminResetPassword": {
	// 	type: String,
	// 	min: 8,
	// 	max: 25,
	// 	autoform: {
	// 		// type: "password"
	// 	},
	// 	label: "Password (8-25 in length)",
	// },
	"userId": {
		type: String,
		optional: true,
		max: 20,
		label: "External User ID",
		defaultValue: function () {
			if (this.isSet == true && this.value != ""){
				return this.value;
			} else {
				return GlobalHelpers.idGenerator(uniqueIds.userPrefix);
			}
		}
	},
	"displayName": {
		type: String,
		optional: true,
		label: "Display Name"
	},
	"userCallsign": {
		type: String,
		optional: true,
		label: "Call Sign"
	},
	"userStatus": {
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
	"userType": {
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
	"userAssocOrg": {				/* Associated Org is also set for SuperAdmin Users */
		type: String,
		optional: false,
		autoform: {
			options: function () {
				return GlobalHelpers.getOrgSelectList();
			}
		},
		label: "Organisation"
	},
	"userAssocOrg.$": {
		type: String
	},
	"userDivision": {		/* None or One */
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
	"userTeam": {			/* None or More */
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
	"userNotes": {
		type: String,
		optional: true,
		label: "Notes"
	},

	/* KITBAGS */

	"userKitbags": {			/* None or More */
		type: Array,
		// type: select-checkbox,
		// minCount: 1,
		// maxCount: 5,
		optional: true,
		autoform: {
			options: function () {
				return GlobalHelpers.getFilteredListKitbags();
			}
		},
		label: "Assigned kitbags"
	},
	"userKitbags.$": {
		type: String
	},
	"userKitbagCount": {
		type: Number,
		optional: true,
		label: "Kitbags count" /* This should be equal to length of 'active' kitbags in userKitbags array */
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
		// autoValue: function(){ return Meteor.user().profile.userId },
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
		// autoValue: function(){ return Meteor.user().profile.userId },
		autoform: {
			// hidden: true,
			// label: false
		},
		label: "Updated by"
	}
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: false,
        label: "Username/Login"
    },
  //   password: {
  //   	type: String,
  //       optional: true,
		// defaultValue: function () {
		// 	if (this.isSet == true && this.value != ""){
		// 		return this.value;
		// 	} else {
		// 		return generatePassword(12);
		// 	}
		// }
  //   },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
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
	"profile": {
		type: Schema.UserProfile,
		optional: true
	},
	"services": {
		type: Object,
		optional: true,
		blackbox: true
	}
});

// UserList.attachSchema(User);
Meteor.users.attachSchema(Schema.User);



// console.log(UserSchema);
// Items.attachSchema(ItemSchema);

