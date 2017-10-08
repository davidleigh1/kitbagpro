/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	import './view.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/items/line.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';
	import '/imports/ui/components/urlImagePreviewRollover.html';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from "/imports/startup/both/sharedConstants.js";


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
		minilistFilter_kitbag_users: function () {
			// kb.collections.Users.find({assocKitbagIds:"1221b9ebbb451487-2470bcecc16a9211"}).fetch()
			return {"assocKitbagIds": FlowRouter.getParam(thisUrlId) };
		},		
		minilistFilter_items: function () {
			// tttt = this;
			// console.log("\n\n\n\n",tttt,"\n\n\n\n");
			// var newArray = [];
			// if (typeof this.assocKitbagsArray != "object" || this.assocKitbagsArray.length <= 0) {
			// 	return false;
			// } else {
				// $.each( this.assocKitbagsArray , function( key, assignedBag ) {
				// 	newArray.push( assignedBag );
				// });
			// }
			// return { "kitbagId": { $in: newArray } }
			// return { "_id": { $in: newArray } }

			return { "assocKitbagsArray" : this._id }
		}
	});


/* EVENTS */
	Template.kitbagView.events({
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