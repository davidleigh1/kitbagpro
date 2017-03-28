// # fill the DB with example data on startup
console.log("RUN: server.fixtures.js");

import { Meteor } from 'meteor/meteor';

import { kb } from '/imports/startup/both/sharedConstants.js';


Meteor.startup(function() {
	console.log("EVENT: Server Startup at 'server.fixtures.js'");

	/* ORGS */
	var orgCount = kb.collections.Orgs.find().count();
	if ( orgCount === 0 ) {
		var defaultOrg1 = JSON.parse(Assets.getText('fixtures/org_default.json'));
		var defaultOrgs = [defaultOrg1];

		_.each(defaultOrgs, function(defaultOrg) {
			console.log("FIX: Adding defaultOrg to DB");
			kb.collections.Orgs.insert(defaultOrg);
		});
	} else {
		console.log("FIX: ",orgCount," orgs found in DB");
	}

	/* KITBAGS */
	var kitbagCount = kb.collections.Kitbags.find().count();
	if ( kitbagCount === 0 ) {
		var defaultKitbag1 = JSON.parse(Assets.getText('fixtures/kitbag_default.json'));
		var defaultKitbags = [defaultKitbag1];

		_.each(defaultKitbags, function(defaultKitbag) {
			console.log("FIX: Adding defaultKitbag to DB");
			kb.collections.Kitbags.insert(defaultKitbag);
		});
	} else {
		console.log("FIX: ",kitbagCount," kitbags found in DB");
	}

	/* DEFAULT SUPERADMIN USER */
	var userCount = Meteor.users.find().count();
	if ( userCount === 0 ) {
		var defaultUser1 = JSON.parse(Assets.getText('fixtures/user_default.json'));
		var defaultUsers = [defaultUser1];

		_.each(defaultUsers, function(defaultUser) {
			console.log("FIX: Adding defaultUser to DB");
			// kb.collections.Users.insert(defaultUser);
			Accounts.createUser(defaultUser);
		});

		/* CONFIG DEFAULT SUPERADMIN  */
		var defaultAdminId = "1221aaabbbccc123-5530aaabbbccc123"
		console.log("FIX: Configuring defaultUser");
		Meteor.call("forceUserPasswordChangeServer", defaultAdminId, "admin" );
	} else {
		console.log("FIX: ",userCount," users found in DB");
	}


});