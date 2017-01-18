/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './add.html';
// import './add.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

import { kb } from "/imports/startup/both/sharedConstants.js";

// import { Orgs } 		from '/imports/startup/both/schema-org.js';
// import { Kitbags } 		from '/imports/startup/both/kitbag-schema.js';
// import { Items } 		from '/imports/startup/both/item-schema.js';
// import { UserList } 	from '/imports/startup/both/schema-user.js';
// import { appSettings } 	from '/imports/startup/both/sharedConstants.js';



/* ONCREATED */

Template.kitbagAdd.onCreated(function() {
	// console.log("Hello, I am kitbagAdd - created!");
	// AutoForm.debug();

	Meteor.subscribe("kitbags", {
		onReady: function () {
			console.log(">>> onReady and the 'kitbags' actually arrive");
		},
		onError: function () {
			console.log(">>> onError");
		}
	});

});




/* ONRENDERED */

Template.kitbagAdd.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am kitbagAdd - rendered!");
});



/* HELPERS */

Template.kitbagAdd.helpers({
	Kitbags: function () {
		return kb.collections.Kitbags;
	}
});

AutoForm.hooks({
	insertKitbagForm: {
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
			FlowRouter.go("/kitbags/"+result.kitbagId+"/view");
		},

		onError: function(formType, error, arg3, arg4) {
			// Called when any submit operation fails
			// alert("ERROR! BOOO!");
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
	}
});



/* EVENTS */

Template.kitbagAdd.events({
	'click button.submit': function(event) {
		event.preventDefault();
		alert('submit button!');
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	}
});