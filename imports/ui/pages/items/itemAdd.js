/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './itemAdd.html';
// import './itemAdd.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
import { Items } from '/imports/startup/both/item-schema.js';
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

Template.itemAdd.onCreated(function() {
	// console.log("Hello, I am itemAdd - created!");
	// AutoForm.debug();

	Meteor.subscribe("items", {
		onReady: function () {
			console.log(">>> onReady and the 'items' actually arrive");
			// window.myItems = Items.find().fetch();
		},
		onError: function () {
			console.log(">>> onError");
		}
	});

});




/* ONRENDERED */

Template.itemAdd.onRendered(function(){
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

Template.itemAdd.helpers({
	Items: function () {
		return Items;
	}
});


// AutoForm.addHooks(['postInsert', 'postUpdate'], {
//   onSuccess: function(operation, result, template) {
//     FlashMessages.sendSuccess('Success!');
//     FlowRouter.go("/items/list");
//     // FlowRouter.go("/items/"+"5f2e8c6205e01c75"+"/view", { _id: itemId });
//   }
// });

AutoForm.hooks({
	insertItemForm: {
		after: {
			// Replace `formType` with the form `type` attribute to which this hook applies
			method: function(error, result, arg3, arg4) {
				// alert("AFTER!");
				console.log("AFTER! ", error, result, arg3, arg4);
			}
		},
			// onSubmit: function (insertDoc, updateDoc, currentDoc) {
			//   if (someHandler(insertDoc)) {
			//     this.done();
			//     Articles.clean(doc); / you can do more logic here, cleaning the form.
			//     Router.go('thePath');
			//   } else {
			//     this.done(new Error("Submission failed"));
			//   }
			//   return false;
			// }

		onSuccess: function(formType, result) {
			// Called when any submit operation succeeds
			// alert("SUCCESS! YEY!");
			console.log("SUCCESS! YEY! ", result);
			FlowRouter.go("/items/"+result.itemId+"/view");
		},

		onError: function(formType, error, arg3, arg4) {
			// Called when any submit operation fails
			// alert("ERROR! BOOO!");
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
	}
});



/* EVENTS */

Template.itemAdd.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});