/* IMPORT METEOR PACKAGES */

import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';



/* IMPORT PAGE COMPONENTS */

import './orgDuplicate.html';
import './orgDuplicate.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */

// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */

import { Orgs } from '/imports/startup/both/org-schema.js';
// import { Kitbags } 	from '/imports/api/kitbags/kitbags.js';
// import { Items } 	from '/imports/startup/both/item-schema.js';
// import { UserList } 	from '/imports/startup/both/user-schema.js';
import { appSettings } 	from '/imports/startup/both/sharedConstants.js';


/* ONCREATED */

Template.orgDuplicate.onCreated(function() {

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

Template.orgDuplicate.onRendered(function(){
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

	/* DUPLICATATION FORM SO ADDING SOME UPDATES */
	var oldId = $("input[name='orgId']").val();
	var oldTitle = $("input[name='orgTitle']").val();
	var oldDesc = $("input[name='orgDesc']").val();
	/* New ID - the old ID is still visible in the URL */
	$("input[name='orgId']").val( GlobalHelpers.idGenerator(uniqueIds.orgPrefix) );
	/* Prepend to title */
	$("input[name='orgTitle']").val( "Duplicate of " + oldTitle );
	/* Prepend leading whitespace if there is an existing value */
	var leadingSpace = (oldDesc.length > 0) ? "\n " : "";
	$("input[name='orgDesc']").val( oldDesc + leadingSpace + "[Duplicated from "+oldTitle+" (ID: "+oldId+")]" );
	/* Auto-select createdvia dropdown field as manual duplicate */
	$("select[name='createdVia']").find('option').each(function() {
		if ( $(this).val().match("ManualDuplicate") ){
			$(this).attr('selected','true');
		}
	});

});



/* HELPERS */

// Template.itemEdit.helpers({
// });
Template.orgDuplicate.helpers({
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


var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";

AutoForm.hooks({
	duplicateOrgForm: {
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

Template.orgDuplicate.events({
	// 'click .item-row': function () {
	// 	Session.set("selectedOrgId", this._id);
	// },
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});