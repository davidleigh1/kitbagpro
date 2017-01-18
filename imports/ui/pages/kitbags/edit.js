/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './edit.html';
import './edit.css';




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
Template.kitbagEdit.onCreated(function() {

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
Template.kitbagEdit.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am kitbagAdd - rendered!");


	if ( fn_userIsSuperAdmin() ){
		$("select[name='kitbagAssocOrg']").change(function(){
			var myOrgName = $("select[name='kitbagAssocOrg'] option:selected").text().replace("[Hidden] ","").replace("[Trashed] ","").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			var myOrgValue = $("select[name='kitbagAssocOrg'] option:selected").val();
			var select = 'select[name="assocKitbags"]';
			$(select).find('option').each(function() {
				console.log( $(this).val(), myOrgName, !$(this).text().match(myOrgName), $(this).text());
				$(this).removeAttr('hidden');
				if ( !$(this).text().match(myOrgName) && myOrgValue != "" ){
					// $(this).remove();
					$(this).attr('hidden','hidden');
				}
			});
		});
	}


});



/* HELPERS */
Template.kitbagEdit.helpers({
	Kitbags: function () {
		return kb.collections.Kitbags;
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedKitbagDoc: function () {
		return kb.collections.Kitbags.findOne( GlobalHelpers.get_urlParam("_kitbagId") );
		// return kb.collections.Kitbags.findOne(Session.get("selectedKitbagId"));
	},
	isSelectedKitbag: function () {
		return GlobalHelpers.get_urlParam("_kitbagId");
		// return Session.equals("selectedKitbagId", this._id);
	},
	disableButtons: function () {
		return (FlowRouter.getRouteName() !== "kitbagEdit");
	}
});



AutoForm.hooks({
	updateKitbagForm: {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			console.log("SUCCESS! YEY! ", formType, result);
			FlowRouter.go("/kitbags/"+result.kitbagId+"/view");
		},
		// Called when any submit operation fails
		onError: function(formType, error, arg3, arg4) {
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
  }
});



/* EVENTS */

Template.kitbagEdit.events({
	'click .kitbag-row': function () {
		Session.set("selectedKitbagId", this._id);
	},
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});