/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './orgEdit.html';
import './orgEdit.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

import { Orgs } from '/imports/startup/both/org-schema.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';
// import { Items } from '/imports/api/items/items.js';
// import { Items } from '/imports/startup/both/item-schema.js';
// import { appSettings } from '/imports/startup/both/sharedConstants.js';


/* ONCREATED */

Template.orgEdit.onCreated(function() {

	Meteor.subscribe("orgs", {
		onReady: function () {
			console.log(">>> onReady and the 'orgs' actually arrive");
		},
		onError: function () {
			console.log(">>> onError");
		}
	});

});




/* ONRENDERED */

Template.orgEdit.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am orgAdd - rendered!");


	// if ( fn_userIsSuperAdmin() ){
	// 	$("select[name='itemAssocOrg']").change(function(){
	// 		var myOrgName = $("select[name='itemAssocOrg'] option:selected").text().replace("[Hidden] ","").replace("[Trashed] ","").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	// 		var myOrgValue = $("select[name='itemAssocOrg'] option:selected").val();
	// 		var select = 'select[name="assocKitbags"]';
	// 		$(select).find('option').each(function() {
	// 			console.log( $(this).val(), myOrgName, !$(this).text().match(myOrgName), $(this).text());
	// 			$(this).removeAttr('hidden');
	// 			if ( !$(this).text().match(myOrgName) && myOrgValue != "" ){
	// 				// $(this).remove();
	// 				$(this).attr('hidden','hidden');
	// 			}
	// 		});
	// 	});
	// }


});



/* HELPERS */

// Template.itemEdit.helpers({
// });
Template.orgEdit.helpers({
	Orgs: function () {
		return Orgs;
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedOrgDoc: function () {
		return Orgs.findOne({orgId:GlobalHelpers.get_urlParam("_orgId")});
	},
	isSelectedOrg: function () {
		return GlobalHelpers.get_urlParam("_orgId");
	},
	// formType: function () {
	// 	if ( FlowRouter.getRouteName() == "itemEdit" ) {
	// 		return "update";
	// 	} else {
	// 		return "disabled";
	// 	}
	// },
	disableButtons: function () {
		return (FlowRouter.getRouteName() !== "orgEdit");
	}
});



AutoForm.hooks({
	updateOrgForm: {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			console.log("SUCCESS! YEY! ", formType, result);
			FlowRouter.go("/orgs/"+result.orgId+"/view");
		},
		// Called when any submit operation fails
		onError: function(formType, error, arg3, arg4) {
			console.log("ERROR! BOOO! ", formType, error, arg3, arg4)
		}
  }
});



/* EVENTS */

Template.orgEdit.events({
	// 'click .item-row': function () {
	// 	Session.set("selectedOrgId", this._id);
	// },
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});