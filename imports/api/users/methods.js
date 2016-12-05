// # methods related to this collection
console.log("RUNNING users > methods.js");

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { _ } from 'meteor/underscore';

// import { Users } from '/imports/startup/both/item-schema.js';
// import { Items } from './items.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { UserList } from '/imports/startup/both/user-schema.js';

import { check } from 'meteor/check';

Meteor.methods({
	// TODO: Should be createUser/createItem etc NOT addUser/addItem as there maybe a legit scenario (in the future) to add a user to a group
	// (or something else) which would be a legitimate 'add' but not a 'create'

	addUser: function(userObj) {
		console.log('fn Meteor.methods.createUser()',userObj);
		if(typeof userObj != "object" || userObj == false){
			console.log('ERROR: No userObj received in request. DB insert action cancelled. [error code: 910]');
			return false;
		};


		/* Set Displayname (if not set by user) to be equal to username or email if available */
		userObj.profile.displayName = userObj.profile.displayName || userObj.username || userObj["emails"][0]["address"];

		// 'userObj' will contains the field that are in the 'Schema.User'
		check(userObj, Schema.User);

		/* The following 'Accounts.createUser' will trigger the 'beforeUserInsert' hook   */
		var newUser = Accounts.createUser(userObj);

		// Meteor.users.update(newUser, /* set the extra information, like status */);
		var newEmailAddress = userObj.emails[0].address;

		/* The following 'Accounts.addEmail' will trigger the 'beforeUserUpdate' hook   */
		var addEmailStatus = Accounts.addEmail(newUser, newEmailAddress);

		return { "userId": userObj.profile.userId, "dbId": newUser, "userObj": userObj, "addEmailStatus": addEmailStatus };
	},
	updateUserMethod: function(updatedObj,documentId){
		console.log(">>> fn updateUser()",updatedObj, documentId);

		var editId,dbObj;
		if( updatedObj._id ){
			editId = updatedObj._id;
		}else{
			dbObj = Meteor.users.findOne({itemId:updatedObj.itemId});
		}

		/* Dynamic Field - Count Kitbags */
		// updatedObj.$set["profile.userKitbagCount"] = (typeof updatedObj.$set["profile.userKitbags"] == "object") ? updatedObj.$set["profile.userKitbags"].length : 0;

		var updateSuccess = Meteor.users.update( documentId, updatedObj );

		// var updatedUserId = Meteor.users.findOne({_id:documentId},{ getUserId:1 })["getUserId"];

		var updatedUserId = updatedObj.$set["profile.userId"];

		return { updatedUserId };
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
		if (!loggedInUser || !(loggedInUser.profile.userType.toLowerCase()  == 'superadmin' )) {
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



// closeAllUserSessions: function(userId) {

//     var sessions = _.filter(Meteor.default_server.sessions, function (session) {
//         return session.userId == userId;
//     });

//     _.each(sessions, function (session) {
//         session.connectionHandle.close();
//     });
// },


/* http://stackoverflow.com/questions/17923290/picking-up-meteor-js-user-logout */
// Meteor.methods({
    checkUserIsLoggedIn:function(userId){
        console.log("________ checkUserIsLoggedIn",userId,typeof userId);

        try {

        	check(userId, String);

	        var user = Meteor.users.findOne(userId);

			if (typeof user == "object"){
				console.log("________ "+userId+" is connected!");
				return "userFound";
			} else if (typeof user == "undefined"){
				console.log("________ "+userId+" was not found in Meteor.users");
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
		Meteor.users.update(id, { $set: {"profile.userStatus": newStatus}});
		console.log("userStatus set: ",Meteor.users.findOne(id));
		// }
	}


});