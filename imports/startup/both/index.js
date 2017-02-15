console.log("RUN: /imports/startup/both/index.js");

import './at_config.js';
import './sharedConstants.js';
import './globalFunctions.js';

import './schema-org.js';
import './schema-kitbag.js';
import './schema-user.js';
import './item-schema.js';

Accounts.onLogin(function() {
  console.log('$ ********** Login complete 2! (both)');
});

Accounts.onLogout(function() {
  console.log('$ ********** Logout complete 2! (both)');
});

Meteor.startup(function() {

	console.log("==========================================================");
	console.log("======   BOTH STARTUP at '/startup/both/index.js'   ======");
	console.log("==========================================================");

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