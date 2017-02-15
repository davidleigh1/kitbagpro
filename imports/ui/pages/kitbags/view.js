/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	import './view.css';
	import '/imports/ui/components/urlImagePreviewRollover.html';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/items/itemLine.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';


/* IMPORT PROJECT OBJECTS */
	import { kb } from "/imports/startup/both/sharedConstants.js";
	import { Items } from '/imports/startup/both/item-schema.js';
	import { listItemStatuses } from '/imports/api/items/items.js';


/* PARAMETERS */
	var thisCollectionName = "Kitbags";
	var thisAction = "view";
	var thisUrlId = "_kitbagId";


/* ONCREATED */
Template.kitbagView.onCreated(function() {
	// EMPTY
});


/* ONRENDERED */
Template.kitbagView.onRendered(function(){
	//	EMPTY
});


/* TEMPLATE HELPERS */
Template.kitbagView.helpers({
	thisKitbag: function (docId) {
		// console.log('\n\nLocal thisKitbag\n\n',thisCollectionName,thisUrlId);
		return kb.collections[thisCollectionName].findOne( FlowRouter.getParam(thisUrlId) || docId );
	},
	assocKitbags: function () {
		/* Tidies up the assocKitbags array */
		/* TODO - Remove this if no longer required */
		var arr = this.assocKitbags;
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
	minilistFilter: function () {
		var newArray = [];
		if (typeof this.assocKitbags != "object" || this.assocKitbags.length <= 0) {
			return false;
		} else {
			$.each( this.assocKitbags , function( key, assignedBag ) {
				newArray.push( assignedBag );
			});
		}
		// return { "kitbagId": { $in: newArray } }
		return { "_id": { $in: newArray } }
	}
});


// Template.myTemplateName.events
Template.kitbagView.events({
	// 'click button.submit': function(event) {
	// 	event.preventDefault();
	// 	alert('submit button!');
	// },
	// 'click button.cancel': function(event) {
	// 	event.preventDefault();
	// 	alert('cancel button!');
	// },
	'click li.setKitbagStatus': function(event,a,b) {
		event.preventDefault();
		// var newStatus = event.target.categ.dataset.getAttribute('data-id')
		var field = "status";
		// newEvent = event;
		var parent = event.target.parentElement;
		var newValue = event.target.parentElement.getAttribute("data-status");
		console.log("EVENT updateKitbagField",this._id,field,newValue,parent);
		// Meteor.call("updateKitbagField",this._id,field,newValue);
	},
	'click .btn.trash': function(event) {
		event.preventDefault();
		globalTrash("TrashedByUser", "Kitbags", this, Meteor.userId(), "#");
	},
	'click .btn.delete': function(event,a,b) {
		event.preventDefault();
		globalDelete("DeletedByUser", "Kitbags", this, Meteor.userId(), "/kitbags/list");
	}
});