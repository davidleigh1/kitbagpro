/* IMPORT METEOR PACKAGES */
	// import { Meteor } from 'meteor/meteor'
	// import { Session } from 'meteor/session'
	// import { Template } from 'meteor/templating';
	// import { ReactiveVar } from 'meteor/reactive-var';


/* IMPORT PAGE COMPONENTS */
	import './line.html';
	import './line.css';
	import './changeStatus.html';

/* IMPORT SHARED TEMPLATES + COMPONENTS */
	// import '/imports/ui/pages/kitbags/kitbagLine.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";

/* PARAMETERS */
	var thisObj = "Kitbags";


/* ONCREATED */
Template.kitbagLine.created = function(){
	// console.log("---------------- kitbagLine.created --------------------");
};


/* UTIL FUNCTIONS */
trashKitbag = function (clickObj) {
	// Required - Called from Action Menu
	globalTrash("TrashedByUser", "Kitbags", clickObj.kitbagObj, Meteor.userId(), "#");
};


/* HELPERS */
Template.kitbagLine.helpers({
	isOrgView: function () {
		/*
		NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
		All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
		*/
		return "orgView"==Template.parentData().listType;
	},
	isItemView: function () {
		/*
		NOTE - We need to use parentData() in this helper because the {{#with thisKitbag}} used in the template has the effect of setting the Template.currentData() equal to the datacontext returned by thisKitbag() helper -- so... we need to go up a level (to the parent) to get the listType value that we passed in the original {{>kitbagLine}} declaration.
		All this, just to find out in what context (kitbagList or OrgView Minilist) we are showing our template
		*/
		return "itemView"==Template.parentData().listType;
	},
	thisKitbag: function () {
		//return Template.parentData();
		return Template.currentData().thisKitbag;
		console.log("-- thisKitbag",arguments,Template.currentData() );
	},
	changeKitbagStatus: function () {
		var kbs = (this.status == "Active") ? "Hidden" : "Active";
		var icon = (kbs == "Active") ? "eye" : "eye-slash";
		var html = " Make "+kbs;
		return {'icon':icon, 'html':html};
	}
});

Template.kitbagLine.events({
	'click .showDetail': function(event) {
		// et = event.target;
		// console.log(et);
		// $( et.parentElement.parentElement ).children( '.kitbagDetails' ).toggle();
		var o = $(event.target).data("kitbag");
		FlowRouter.go("/kitbags/"+o+"/view");
		// $(".objView-"+o).toggle();
	},
	'click .edit': function(event) {
		// TODO: Don't set in global scope!
		// et = event.target;
		// console.log(et);
		// TODO: Replace this show/hide/toggle bit with a global view controller!
		// $('.screen-wrapper').hide();
		// $('.kitbagAddEdit').toggle();
		// var findOne = {kitbagId:event.target.dataset.kitbag};
		// var formId = "add-edit-kitbag";
		FlowRouter.go("/kitbags/"+event.target.dataset.kitbag+"/edit");
		// editKitbag(findOne,formId);
	},
	'click .toggle-checked': function(event) {
		var checked = event.target.checked;
		Meteor.call("updateKitbag",this._id,!this.checked);
	},
	'click .delete': function(event) {
		event.preventDefault();
		globalDelete("DeletedByUser", "Kitbags", this, Meteor.userId(), "/kitbags/list");
	},
	'click .toggle-private': function(event){
		Meteor.call("setPrivateKitbag",this._id, !this.private);
	},
	'click .dropdown-menu a': function(event) {
		event.preventDefault();
		// console.log('a click: ',this,$(event.target).data('action'));
		var clickObj = {
			action: $(event.target).data('action'),
			kitbagId: $(event.target).data('kitbag'),
			kitbagObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.target).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
	}
});

// OTHER CONTENT AVAILABLE IN kitbagLine.js in OLD folder
