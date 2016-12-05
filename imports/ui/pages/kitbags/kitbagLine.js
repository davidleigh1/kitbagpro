import './kitbagLine.html';

// import { Orgs } from '/imports/api/orgs/orgs.js';

Template.kitbagLine.created = function(){
	// this = Template.currentData();
	// this.data.inheritedValues;
	// this.lt = Template.parentData();
	// console.log("this.lt:",this.lt);
};

// Template.kitbagLine.helpers

Template.kitbagLine.helpers({
	// lookupOrgTitle: function(orgId,reqField) {
	// 	// console.log(">>> lookupOrgTitle("+orgId+","+reqField+")");

	// 		// var veryLocalOrg = Orgs.findOne({orgId: ""+orgId});
	// 		// console.log("returned veryLocalOrg: ",veryLocalOrg);


	// 	var ot = GlobalHelpers.lookupFieldFromOrg(orgId,reqField);
	// 	return ot;
	// },
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
		// console.log("listType",argument,Template.currentData() );
	},
	isOwner: function () {
		return this.owner == Meteor.userId();
	},
	// isSuperAdmin: function () {
		// REPLACED BY glb_userIsSuperAdmin
	// 	// console.log("TODO: Return correct value for SuperAdmin");
	// 	return true;
	// },
	changeKitbagStatus: function () {
		var kbs = (this.kitbagStatus == "Active") ? "Hidden" : "Active";
		var icon = (kbs == "Active") ? "eye" : "eye-slash";
		var html = " Make "+kbs;
		return {'icon':icon, 'html':html};
	}
});


showKbDetails = function (clickObj) {
	// console.log('showKbDetails: ',clickObj,clickObj.bagObj);
};

editKbDetails = function (clickObj) {
	// console.log('editKbDetails: ',clickObj);
	// body...
};

toggleStatus = function (clickObj) {
	// console.log('toggleStatus / currently:'+clickObj.bagObj.kitbagStatus);
	var kbs = (clickObj.bagObj.kitbagStatus == "Active") ? "Hidden" : "Active";
	Meteor.call("setStatus",clickObj.bagObj._id, kbs);
};

trashKb = function (clickObj) {
	// TODO - Make this global!!!
	// console.log('deleteKb: ',clickObj);
	Meteor.call("setStatus",clickObj.bagObj._id, "Trashed");
};

deleteKb = function (clickObj) {
	// console.log('deleteKb: ',clickObj);
	// TODO: Modal confirm - http://stackoverflow.com/questions/8982295/confirm-delete-modal-dialog-with-twitter-bootstrap
	// TODO: Check the original theme/bootstrap to see if modal plugin is already here
	var bagName = (clickObj.bagObj.kitbagTitle != "") ? clickObj.bagObj.kitbagTitle : "<undefined>";
	var c = confirm("Are you sure you want to delete kitbag '"+bagName+"'?\n\nWARNING: This action cannot be undone.");
	if (c == true) {
		Meteor.call("deleteKitbag",clickObj.bagObj._id);
		alert("Kitbag '"+bagName+"' was deleted");
		return true;
	} else {
		alert("Your delete request was cancelled");
		return false;
	}
}


// Template.kitbagLine.events

Template.kitbagLine.events({
	// TODO - We could make this global to handle all dropdowns!
	'click .dropdown-menu a': function(event) {
		// console.log('a click: ',this,$(event.target).data('action'));
		event.preventDefault();
		var clickObj = {
			action: $(event.target).data('action'),
			bagId: $(event.target).data('bag'),
			bagObj: this
		};
		if (typeof clickObj.action == "string" && typeof window[clickObj.action] == "function" ){
			window[$(event.target).data('action')](clickObj);
		} else {
			console.log("Error: 'action' function was not found (code: 0147)");
		};
//		},
//		'click .toggle-checked': function(event) {
//			var checked = event.target.checked;
//			Meteor.call("updateKitbag",this._id,!this.checked);
//		}, //ends 'click .toggle-checked';
//		'click .delete': function(event) {
//			Meteor.call("deleteKitbag",this._id);
//		}, //ends 'click .delete';
//		'click .toggle-private': function(event){
//			Meteor.call("setPrivateKitbag",this._id, !this.private);
	}
});