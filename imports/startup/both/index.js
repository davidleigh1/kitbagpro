console.log("RUN: /imports/startup/both/index.js");

import './at_config.js';
import './sharedConstants.js';
import './globalFunctions.js';

import './schema-org.js';
import './schema-kitbag.js';
import './schema-user.js';
import './schema-item.js';

Accounts.onLogin(function() {
	var prefix = "USER: ";
	console.log(prefix + "LOGIN SUCCESS! user: '" + Meteor.userId() + "' has logged IN successfully (Accounts.onLogin)");
	// console.log('$ ********** Login complete 2! (both)');
});

Accounts.onLogout(function() {
	var prefix = "USER: ";
	console.log(prefix + "LOGOUT SUCCESS! user: '" + Meteor.userId() + "' has logged OUT successfully (Accounts.onLogout)");
	// console.log('$ ********** Logout complete 2! (both)');
});

Meteor.startup(function() {

	console.log("==========================================================");
	console.log("======   BOTH STARTUP at '/startup/both/index.js'   ======");
	console.log("==========================================================");

});

serverlog = function(msg){
	if (typeof msg == "object") {
		// msg = JSON.stringify(msg);
		msg = msg.message;
	}
	console.log("LOG: "+msg);
};