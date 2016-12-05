console.log("RUNNING dashboard.js");

import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';

// import '../components/loading/loading.js';

import { Admin } from '/imports/api/admin/admin.js';
/* TODO - Remove ORG + Kitbag imports. Only need the following imports for the find.all count for debugging */
// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
import { Kitbags } from '/imports/api/kitbags/kitbags.js';

import './dashboard.html';
import './dashboard.css';

/* TODO - Remove the following from Production version */

import "./charts.html";
import "./tables.html";
import "./forms.html";
import "./bootstrapElements.html";
import "./bootstrapGrid.html";
import "./blankPage.html";
import "./indexRTL.html";

Template.dashboard.helpers({
	// orgCount_old: function () {
	// 	var orgData = Admin.findOne({relatesTo: "Orgs"});
	// 	console.log(orgData);
	// 	return orgData.count;
	// 	/*return Admin.find({}, {sort: {postedAt: -1}}).fetch();*/
	// },
	// orgCount: function () {
	// 	var orgData = Admin.findOne( {'id':'counts'} );
	// 	// Admin.update( {'id':'counts'}, { '$set':{ 'counts.allOrgs': Orgs.find().count() } }, { upsert: true } );
	// 	try {
	// 		console.log(orgData.counts);
	// 		return orgData.counts.allOrgs;
	// 	} catch(err) {
	// 		console.log("Error retrieving 'orgData': "+err);
	// 		var htmlString = '<span class="noDataReturned"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>';
	// 		return Spacebars.SafeString(htmlString);
	// 	}
	// },
	selectAllCount: function (obj) {
		switch (obj) {
			case "Orgs":
			case "orgs":
				return Orgs.find().count();
			case "Kitbags":
			case "kitbags":
				return Kitbags.find().count();
			case "Items":
			case "items":
				return Items.find().count();
			default:
				return "??";
		}
	},
	getCount: function (countParam) {
		var orgData = Admin.findOne( {'id':'counts'} );
		try {
			// console.log(orgData.counts);
			if (orgData.counts[countParam] == 0){
				return false;
			}
			return orgData.counts[countParam];
		} catch(err) {
			console.log("Error retrieving '"+countParam+"': "+err);
			var htmlString = '<span class="noDataReturned"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>';
			return Spacebars.SafeString(htmlString);
		}
	},
	kitbagCount: function () {
		var kitbagData = Admin.findOne( {'id':'counts'} );
		try {
			//console.log(kitbagData.counts);
			return kitbagData.counts.allKitbags;
		} catch(err) {
			console.log("Error retrieving 'kitbagData': "+err);
			var htmlString = '<span class="noDataReturned"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>';
			return Spacebars.SafeString(htmlString);
		}
	},
	userCount: function () {
		var userData = Admin.findOne({relatesTo: "Users"});
		try {
			//console.log(userData);
			return userData.count;
		} catch(err) {
			// console.log("Error retrieving 'userData': "+err);
			var htmlString = '<span class="noDataReturned"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>';
			return Spacebars.SafeString(htmlString);
		}
	}
});





Template.dashboard.events({
	'click #updateCounts': function(event) {
		event.preventDefault();
		//console.log("Update Counts Now!");
		Meteor.call("updateCounts","onDemand");
	},
	'click #reassignBagsToOrgs': function(event) {
		event.preventDefault();
		//console.log("Reassign Bags to Orgs Now!");
		// Meteor.call("updateCounts","onDemand");
		Meteor.call("assignAllKBs","onDemand");
	}
});
