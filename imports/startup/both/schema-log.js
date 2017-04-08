console.log("RUN: 'schema-log.js' at '/imports/startup/both'");

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';

// Assign to Global namespace
kb.schemas.distributionToKitbagsSchema = new SimpleSchema({

	"qInitialAssign": {
		type: Number,
		optional: true,
		autoValue: function() {
			if (this.isInsert) {
				return "99";
			} else if (this.isUpsert) {
				return { $setOnInsert: "555555" };
			} else {
				this.unset();  // Prevent user from supplying their own value
			}
		},
		label: "Initial Q issued with Kitbag"
	}

});