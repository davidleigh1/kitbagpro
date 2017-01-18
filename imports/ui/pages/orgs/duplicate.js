/* IMPORT METEOR PACKAGES */
import { Meteor } from 'meteor/meteor'
// import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';




/* IMPORT PAGE COMPONENTS */
import './duplicate.html';
import './duplicate.css';




/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/kitbags/kitbagLine.js';




/* IMPORT PROJECT OBJECTS */
import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";



/* PARAMETERS */
var thisObj = "Orgs";
var alertMsgPrefix = "<i class='fa fa-building fa-lg'></i>&nbsp;&nbsp;";


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
	/* DUPLICATATION FORM SO ADDING SOME UPDATES */
	var oldId = $("input[name='orgId']").val();
	var oldTitle = $("input[name='title']").val();
	var oldDesc = $("input[name='desc']").val();
	/* New ID - the old ID is still visible in the URL */
	$("input[name='orgId']").val( GlobalHelpers.idGenerator(uniqueIds.orgPrefix) );
	/* Prepend to title */
	$("input[name='title']").val( appSettings.global.duplicatedPrefix + oldTitle );
	/* Prepend leading whitespace if there is an existing value */
	var leadingSpace = (oldDesc.length > 0) ? "\n " : "";
	$("input[name='desc']").val( oldDesc + leadingSpace + "[Duplicated from "+oldTitle+" (ID: "+oldId+")]" );
	/* Auto-select createdvia dropdown field as manual duplicate */
	$("select[name='createdVia']").find('option').each(function() {
		if ( $(this).val().match("ManualDuplicate") ){
			$(this).attr('selected','true');
		}
	});
});






/* HELPERS */

Template.orgDuplicate.helpers({
	Orgs: function () {
		/* 
		Reference - autoform requires collection in windows scope
		But most isolated solution is to make collection available
		via the template helper in the relevant template
		See: https://github.com/aldeed/meteor-autoform/issues/1449
		*/
		return kb.collections[thisObj];
	},
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedOrgDoc: function () {
		return kb.collections[thisObj].findOne(GlobalHelpers.get_urlParam("_orgId"));
	},
	isSelectedOrg: function () {
		return GlobalHelpers.get_urlParam("_orgId");
	},
	disableButtons: function () {
		return (FlowRouter.getRouteName() !== "orgEdit");
	}
});





/* HOOKS */

AutoForm.hooks({
	duplicateOrgForm: {
		onSuccess: function(formType, result) {
			console.log("SUCCESS! YEY! ", formType, result);
			var title = result.orgObj.title;
			sAlert.success(alertMsgPrefix + "<strong>SUCCESS: </strong> Org: '<i>"+title+"</i>' was successfully created.", {
				html: true,
				onRouteClose: false
			});
			FlowRouter.go("/orgs/"+result._id+"/view");
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
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});