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
	var thisCollectionName = "Items";
	var thisAction = "updated";
	var thisUrlId = "_itemId";


/* ONCREATED */
	Template.itemEdit.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
Template.itemEdit.onRendered(function(){
	/*
		console.log("--- onRendered ------------------------------------------");
		console.log("FlowRouter: ",FlowRouter);
		console.log("getRouteName: " + FlowRouter.getRouteName());
		console.log("getParam: " + FlowRouter.getParam('_orgId'));
		console.log("getQueryParam: " + FlowRouter.getQueryParam());
		console.log("---------------------------------------------------------");
	*/
	// console.log("Hello, I am itemAdd - rendered!");
	if ( fn_userIsSuperAdmin() ){
		$("select[name='itemAssocOrg']").change(function(){
			var myOrgName = $("select[name='itemAssocOrg'] option:selected").text().replace("[Hidden] ","").replace("[Trashed] ","").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			var myOrgValue = $("select[name='itemAssocOrg'] option:selected").val();
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
Template.itemEdit.helpers({
	Items: function () {
		return kb.collections[thisCollectionName];
	},
	getOmitFields: function() {
		return appSettings[thisCollectionName.toLowerCase()].omitFields;	
	},	
	autoSaveMode: function () {
		return Session.get("autoSaveMode") ? true : false;
	},
	selectedItemDoc: function () {
		return kb.collections[thisCollectionName].findOne( GlobalHelpers.get_urlParam(thisUrlId) );
	}
});


/*************************************************************************/
/* ALDEED AUTOFORM HOOKS using https://github.com/aldeed/meteor-autoform */
/*************************************************************************/

AutoForm.hooks({
	updateItemForm: {
		onSuccess: function(formType, resultObj) {
			console.log("AutoForm.hooks.updateItemForm.onSuccess: ", formType, resultObj);			
			globalOnSuccess(thisCollectionName, thisAction, resultObj);
		},
		onError: function(formType, error, arg3, arg4) {
			console.log("AutoForm.hooks.updateItemForm.onError: ", formType, error, arg3, arg4);
			globalOnError(thisCollectionName, thisAction, error, arg3, arg4);
		}
  }
});



/* EVENTS */
Template.itemEdit.events({
	'click .item-row': function () {
		Session.set("selectedItemId", this._id);
	},
	'change .autosave-toggle': function () {
		Session.set("autoSaveMode", !Session.get("autoSaveMode"));
	}
});