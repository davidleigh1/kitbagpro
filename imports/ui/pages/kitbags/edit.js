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
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


/* PARAMETERS*/
	var thisCollectionName = "Kitbags";
	var thisAction = "updated";
	var thisUrlId = "_kitbagId";


/* ONCREATED */
Template.kitbagEdit.onCreated(function() {
	// console.log("TODO: IS THIS SUBSCRIPTION REQUIRED?? Template.kitbagEdit.onCreated");
	// Meteor.subscribe("kitbags", {
	// 	onReady: function () {
	// 		console.log(">>> onReady and the 'kitbags' actually arrive");
	// 	},
	// 	onError: function () {
	// 		console.log(">>> onError");
	// 	}
	// });
});


/* ONRENDERED */
Template.kitbagEdit.onRendered(function(){

	if ( fn_userIsSuperAdmin() ){
		console.log("TODO: Check this function... can it be generic too?");
		$("select[name='assocOrgId']").change(function(){
			var myOrgName = $("select[name='assocOrgId'] option:selected").text().replace("[Hidden] ","").replace("[Trashed] ","").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			var myOrgValue = $("select[name='assocOrgId'] option:selected").val();
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
		return kb.collections[thisCollectionName];
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;	
	},
	autoSaveMode: function () {
		// TODO: Is this used? Can we add autoSave??
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedKitbagDoc: function () {
		return kb.collections[thisCollectionName].findOne( GlobalHelpers.get_urlParam(thisUrlId) );
	},
	// isSelectedKitbag: function () {
	// 	return GlobalHelpers.get_urlParam(thisUrlId);
	// },
	// disableButtons: function () {
	// NO LONGER REQUIRED - WAS USED IN ADDEDIT
	// 	return (FlowRouter.getRouteName() !== "kitbagEdit");
	// }
});


/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

AutoForm.hooks({
	updateKitbagForm: {
		// before: {
		// 	"method-update": function(doc) {
		// 		return doc;
		// 	}
		// },
		onSuccess: function(formType, resultObj) {
			console.log("AutoForm.hooks.updateKitbagForm.onSuccess: ", formType, resultObj);			
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.updateKitbagForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
  }
});



/* EVENTS */

Template.kitbagEdit.events({
	// NOT USED CURRENTLY BUT COULD BE USEFUL??
	// 'click .kitbag-row': function () {
	// 	Session.set("selectedKitbagId", this._id);
	// },
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});