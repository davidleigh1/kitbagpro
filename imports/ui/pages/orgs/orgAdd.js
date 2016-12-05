/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './orgAdd.html';
// import './itemAdd.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
import { Orgs } from '/imports/startup/both/org-schema.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/imports/startup/both/item-schema.js';
// import '/imports/api/items/items.js';
// import { appSettings } from '/imports/startup/both/sharedConstants.js';


// Books = new Mongo.Collection("books");
// Books.attachSchema(new SimpleSchema({

//   "itemId": {
//     type: String,
//     optional: false,
//     max: 20,
//     label: "Item ID"
//   }

// }));




/* ONCREATED */

Template.orgAdd.onCreated(function() {
	// console.log("Hello, I am itemAdd - created!");
	// AutoForm.debug();

	Meteor.subscribe("orgs", {
		onReady: function () {
			console.log(">>> onReady and the 'orgs' actually arrive");
			// window.myItems = Items.find().fetch();
		},
		onError: function () {
			console.log(">>> onError");
		}
	});

});




/* ONRENDERED */

Template.orgAdd.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am itemAdd - rendered!");
});



/* HELPERS */

Template.orgAdd.helpers({
	Orgs: function () {
		return Orgs;
	}
});


// AutoForm.addHooks(['postInsert', 'postUpdate'], {
//   onSuccess: function(operation, result, template) {
//     FlashMessages.sendSuccess('Success!');
//     FlowRouter.go("/items/list");
//     // FlowRouter.go("/items/"+"5f2e8c6205e01c75"+"/view", { _id: itemId });
//   }
// });

var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";

AutoForm.hooks({
	insertOrgForm: {
		after: {
			// Replace `formType` with the form `type` attribute to which this hook applies
			method: function(error, result, arg3, arg4) {
				// alert("AFTER!");
				console.log("AFTER! ", error, result, arg3, arg4);
			}
		},
		onSuccess: function(formType, result) {
			console.log("SUCCESS! YEY! ", formType, result);
			var orgTitle = result.orgObj.orgTitle;
			sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong> Org: '<i>"+orgTitle+"</i>' was successfully created.", {
				html: true,
				onRouteClose: false
			});
			FlowRouter.go("/orgs/"+result.orgId+"/view");
		},
		onError: function(formType, error, arg3, arg4) {
			var msg = alertMsgPrefix + "<strong>Error: </strong><code>"+error.message+"</code>";
			sAlert.error(msg, {
				html: true,
				timeout: appSettings.sAlert.longTimeout
			});
		}

	}
});



/* EVENTS */

Template.orgAdd.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});