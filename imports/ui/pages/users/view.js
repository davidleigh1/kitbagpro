/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	// import './userView.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/kitbags/line.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';
	import '/imports/ui/components/urlImagePreviewRollover.html';


/* IMPORT PROJECT OBJECTS */
	import { kb } from '/imports/startup/both/sharedConstants.js';


/* PARAMETERS */
	var thisCollectionName = "Users";
	var thisAction = "view";
	var thisUrlId = "_userId";


/* ONCREATED */
	Template.userView.onCreated(function() {
		// EMPTY
	});


/* ONRENDERED */
	Template.userView.onRendered(function(){
		// EMPTY
	});

/* HELPERS */
Template.userView.helpers({
	thisUser: function (docId) {
		// var myUser = Meteor.users.findOne({"userId": FlowRouter.getParam('_userId') });
		// return myUser;
		return kb.collections[thisCollectionName].findOne( FlowRouter.getParam(thisUrlId) || docId );
	},
	assocKitbags: function () {
		/* Tidies up the assocKitbagIds array */
		/* TODO - Remove this if no longer required */
		var arr = this.assocKitbagIds;
		var prefix = "<code>";
		var joiner = "</code>, <code>";
		var suffix = "</code>";
		if (typeof arr != "object" || arr.length <= 0) {
			return false;
		} else {
			return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
		}
	},
	noFilter: function () {
		// There is no user filter in minilists - so we just return a null value for objectsFiltered()
		return;
	},
	// thisKitbag: function (kitbagId) {
	// 	var myKitbag = kb.collections.Kitbags.findOne({kitbagId: ""+kitbagId});
	// 	return myKitbag;
	// },
	minilistFilter_assignedBags: function () {
		var newArray = [];
		if (typeof this.assocKitbagIds != "object" || this.assocKitbagIds.length <= 0) {
			return false;
		} else {
			$.each( this.assocKitbagIds , function( key, assignedBag ) {
				newArray.push( assignedBag );
			});
		}
		// return { "kitbagId": { $in: newArray } }
		return { "_id": { $in: newArray } }
	}
	// userEmail: function () {
	// 	//console.log("userEmail",this.emails);
	// 	return this.emails[0]["address"];
	// }
});


// Template.myTemplateName.events
Template.userView.events({
	'click a.btn.forcePasswordChange': function(event) {
		event.preventDefault();
		console.log("forcePasswordChange() ",event);
		/* Note - forceUserPasswordChange requires the _id rather than the userId */
		forceUserPasswordChange(this._id);
	},
	'click button.cancel': function(event) {
		event.preventDefault();
		alert('cancel button!');
	},
	'click li.setUserStatus': function(event,a,b) {
		event.preventDefault();
		// var newStatus = event.target.categ.dataset.getAttribute('data-id')
		var field = "userStatus";
		// newEvent = event;
		var parent = event.target.parentElement;
		var newValue = event.target.parentElement.getAttribute("data-status");
		//console.log("EVENT updateUserField",this._id,field,newValue,parent);
		// Meteor.call("updateItemField",this._id,field,newValue);
	},
	'click .btn.trash': function(event) {
		event.preventDefault();
		var areYouSure = "Are you sure you want to trash user '"+this.username+"'?\n(UserId: "+this.userId+")";
		if ( confirm(areYouSure) ) {
			Meteor.call("setUserStatus",this._id, "Trashed");
		} else {
			return false;
		}
	},
	'click .btn.delete': function(event,a,b) {
		event.preventDefault();
		globalDelete("DeletedByUser", thisCollectionName, this, Meteor.userId(), "/"+ thisCollectionName.toLowerCase() +"/list");
	},
	// 'click .phoneLinkConfirm': function(event) {
	// 	event.preventDefault();
	// 	confirmOpenPhone(event);
	// },
	// 'click .smsLinkConfirm': function(event) {
	// 	event.preventDefault();
	// 	confirmOpenSMS(event);
	// }
});