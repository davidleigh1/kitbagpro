console.log("RUNNING /imports/startup/both/index.js");

import './at_config.js';
import './item-schema.js';
import './user-schema.js';
import './sharedConstants.js';

Accounts.onLogin(function() {
  console.log('$ ********** Login complete 2! (both)');
});

Accounts.onLogout(function() {
  console.log('$ ********** Logout complete 2! (both)');
});

Meteor.startup(function() {
	console.log("$ ######### Meteor.startup at /startup/both/index.js");
});

fn_userIsSuperAdmin = function(userObject){
	/* Shuld be moved to globalFunctions.js */
	var thisUser = jQuery.isPlainObject(userObject) ? userObject : Meteor.user();
	if ( !jQuery.isPlainObject(thisUser) ) { return false }
	// console.log("glb_userIsSuperAdmin() ", thisUser );
	if ( thisUser && jQuery.isPlainObject(thisUser.profile) && typeof thisUser.profile.userType == "string" && thisUser.profile.userType.toLowerCase() == "superadmin" ){
		// console.log("glb_userIsSuperAdmin() --- USER IS A SUPERADMIN!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		return true;
	}
	return false;
};

serverlog = function(msg){
	if (typeof msg == "object") {
		// msg = JSON.stringify(msg);
		msg = msg.message;
	}
	console.log("LOG: "+msg);
};