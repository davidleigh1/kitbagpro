// # methods related to this collection
console.log("RUN: users > methods.js");

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

import { kb } from "/imports/startup/both/sharedConstants.js";

import { check } from 'meteor/check';

/* METHODS */
var thisCollectionName = "Users";

/* Will trigger on Accounts.createUser() - required to add custom fields */
/* https://guide.meteor.com/accounts.html#adding-fields-on-registration */
Accounts.onCreateUser(function(options, user) {
	console.log("\n\n\n","-".repeat(24),"FN: Accounts.onCreateUser()",arguments,"-".repeat(24),"\n\n\n");
	/* Copy all custom fields into default object */
	// jQuery.extend(user,options);
	Object.assign(user,options);
	/* Custom field values */
	user._id = options.assocOrgId + "-" + user._id;
	user.displayName = options.displayName || user.username || user["emails"][0]["address"];
	return user;
});


Meteor.methods({
	// TODO: Should be createUser/createItem etc NOT addUser/addItem as there maybe a legit scenario (in the future) to add a user to a group
	// (or something else) which would be a legitimate 'add' but not a 'create'

	addUser: function(userObj) {
		console.log('FN: Meteor.methods.addUser()', userObj);
		if(typeof userObj != "object" || userObj == false){
			console.log('ERROR: No userObj received in request. DB insert action cancelled. [error code: 910]');
			return false;
		};
		/* Check for duplicate and abort if non-unique */
		if ( !globalIsThisObjectUnique(userObj._id, thisCollectionName) ){
			throw new Meteor.Error("Duplicate found for User ID (_id): "+userObj._id+". Aborting new user creation.");
			return false;
		}

		/* Set Displayname (if not set by user) to be equal to username or email if available */
		// userObj.displayName = userObj.displayName || userObj.username || userObj["emails"][0]["address"];

		/* CHECK() */
		// console.log("\n\n", "check(userObj, kb_reference_only.schemas.UserSchema);", "\n\n\n");
		// 'userObj' will contains the field that are in the 'Schema.User'
		// var checkResult = check(userObj, kb.schemas.UserSchema);
		// console.log("\n\n", checkResult, userObj, "\n\n\n");

		/* IMPORTANT! */
		/* 
		The following create user functionality triggers TWO hooks:
			1. HOOK: BEFORE METEOR.USERS.INSERT
			before Accounts.createUser();
			2. HOOK: BEFORE METEOR.USERS.UPDATE
			before Accounts.addEmail();
		*/

		console.log("\n\n","----> userObj: ",userObj,"----|\n\n\n");

		/* The following 'Accounts.createUser' will trigger the 'beforeUserInsert' hook   */
		var newUser = Accounts.createUser(userObj);
		// var newUser = kb.collections[thisCollectionName].insert(userObj);

		console.log("\n\n","----> newUser: ",newUser,"----|\n\n\n");

		// Meteor.users.update(newUser, /* set the extra information, like status */);
		var newEmailAddress = userObj.emails[0].address;

		/* The following 'Accounts.addEmail' will trigger the 'beforeUserUpdate' hook   */
		var addEmailStatus = Accounts.addEmail(newUser, newEmailAddress);
		/*
		returnObj{} will be passed to AutoForm.hooks.<formName>.onSuccess
		and then to globalSuccess() as resultObj{}
		*/
		var returnObj = {
			"id": newUser,
			"obj": userObj,
			"thisAction": "insert",
			"thisCollectionName": thisCollectionName,
			"title": userObj.displayName
		};		
		console.log('OK!: addUser() added User: ', userObj.displayName, userObj._id, "\n", returnObj);
		return returnObj;

		// return {
		// 	"userId": userObj.userId,
		// 	"dbId": newUser,
		// 	"userObj": userObj,
		// 	"addEmailStatus": addEmailStatus
		// };
	},
	deleteUser: function(userDocId){
		console.log("FN deleteUser() *** DEPRECATED - USE globalDelete() INSTEAD ***");
		/* DEPRECATED - USE globalDelete() INSTEAD */
			// var selectedDoc = kb.collections[thisCollectionName].findOne(userDocId);
			// if (selectedDoc) {
			// 	kb.collections[thisCollectionName].remove(userDocId);
			// }
	},
	updateUserMethod: function(updatedObj, documentId){
		console.log("FN updateUser() *** DEPRECATED - USE updateDoc() INSTEAD ***");
		/* DEPRECATED - USE updateDoc() INSTEAD */

			/* Dynamic Field - Count Kitbags */
			// updatedObj.$set["assocKitbagCount"] = (typeof updatedObj.$set["assocKitbagIds"] == "object") ? updatedObj.$set["assocKitbagIds"].length : 0;

			// var updateSuccess = Meteor.users.update( documentId, updatedObj );

			// var updatedUserId = updatedObj.$set["userId"];
			// return { updatedUserId };

			/*
			returnObj{} will be passed to AutoForm.hooks.<formName>.onSuccess
			and then to globalSuccess() as resultObj{}
			*/
			// var returnObj = {
			// 	"id": documentId,
			// 	"obj": updatedObj,
			// 	"thisAction": "update",
			// 	"thisCollectionName": thisCollectionName,
			// 	"title": updatedObj.title || updatedObj.$set["title"]
			// };		
			// console.log('OK!: updateUserMethod() updated User '+returnObj.title+' with this returnObj{}\n', returnObj);
			// return returnObj;
	},
	forceUserPasswordChangeServer: function(dbUserId, password, forceLogout) {
		// http://stackoverflow.com/questions/36368457
		// updateUserPassword: function(userId, password) {
		console.log("forceUserPasswordChangeServer", dbUserId, password);
		var forceLogout = (typeof forceLogout == "boolean") ? forceLogout : true;
		// var forceLogout = true;
		var loggedInUser = Meteor.user();

		// if (!loggedInUser ||
		// 	!(Roles.userIsInRole(loggedInUser, ['admin'], 'default_group')) || (loggedInUser._id == dbUserId) ) {
		if (!loggedInUser || !(loggedInUser.type.toLowerCase()  == 'superadmin' )) {
			throw new Meteor.Error(403, "Access denied. Insuffient permissions.");
			return false;
		}
		var pwchange = Accounts.setPassword(dbUserId, password, {logout: forceLogout});
		console.log("pwchange",pwchange);

		if (forceLogout == true) {
			console.log("-------- LOGGING OUT USER '"+dbUserId+"' --------");
		// 	// closeAllUserSessions(dbUserId);
		// 	// https://forums.meteor.com/t/how-can-i-disconnect-a-user-from-server-side-code/12606/8
		// 	// if (this.userId) {
		// 	// 	Accounts._server.method_handlers.logout ();
		// 	// 	Accounts._server.method_handlers.logoutOtherClients ();
		// 	// }
			Meteor.users.direct.update({"_id" : dbUserId},{ $unset: {'services.resume.loginTokens.0': 1} });
			Meteor.users.direct.update({"_id" : dbUserId},{ $pull: {'services.resume.loginTokens': null} });





		} else {
			console.log("-------- DID NOT LOGOUT USER '"+dbUserId+"' --------");
		}


		return pwchange;
	},
	// https://forums.meteor.com/t/how-can-i-disconnect-a-user-from-server-side-code/12606/8
	// forceLogout: function () {
	// 	if (this.userId) {
	// 		Accounts._server.method_handlers.logout ();
	// 		Accounts._server.method_handlers.logoutOtherClients ();
	// 		}
	// },
	/* http://stackoverflow.com/questions/17923290/picking-up-meteor-js-user-logout */
    checkUserIsLoggedIn:function(userId){
		var prefix = "USER: ";
        console.log(prefix + "checkUserIsLoggedIn()", userId, typeof userId);

        try {

        	check(userId, String);

	        var user = Meteor.users.findOne(userId);

			if (typeof user == "object"){
				console.log(prefix + "CONNECTED! user: '"+userId+"' is connected! (checkUserIsLoggedIn)");
				return "userFound";
			} else if (typeof user == "undefined"){
				console.log(prefix + "WARNING! user: '"+userId+"' was not found in Meteor.users (checkUserIsLoggedIn)");
				return "userNotFound";
			} else {
       			return "noResponse";
			}

       	} catch (err) {
       		return "Error: "+err;
       	}
    },
	setUserStatus: function(id,newStatus){
		var res = Meteor.user.findOne(id);
		console.log("setStatus("+id,newStatus+")");
		console.log("res: ",res);

		// if (res.owner !== Meteor.userId()){
		// 	throw new Meteor.Error('ERROR: You are not authorized to change status for items owned by other users [error code: 34.7]');
		// }else{
		Meteor.users.update(id, { $set: {"status": newStatus}});
		console.log("userStatus set: ", Meteor.users.findOne(id));
		// }
	}
});