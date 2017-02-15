// # fill the DB with example data on startup
console.log("RUN: server.fixtures.js");

import { Meteor } from 'meteor/meteor';

import { kb } from '/imports/startup/both/sharedConstants.js';


Meteor.startup(function() {
	console.log("EVENT: Server Startup at 'server.fixtures.js'");

	/* ORGS */
	if (kb.collections.Orgs.find().count() === 0) {
		var defaultOrg1 = JSON.parse(Assets.getText('fixtures/org_default.json'));
		var defaultOrgs = [defaultOrg1];

		_.each(defaultOrgs, function(defaultOrg) {
			// replace this with something like Companions.insert(companion);
			console.log("Adding defaultOrg");
			kb.collections.Orgs.insert(defaultOrg);
		});
	}

	/* KITBAGS */
	if (kb.collections.Kitbags.find().count() === 0) {
		var defaultKitbag1 = JSON.parse(Assets.getText('fixtures/kitbag_default.json'));
		var defaultKitbags = [defaultKitbag1];

		_.each(defaultKitbags, function(defaultKitbag) {
			// replace this with something like Companions.insert(companion);
			console.log("Adding defaultKitbag");
			kb.collections.Kitbags.insert(defaultKitbag);
		});
	}


});