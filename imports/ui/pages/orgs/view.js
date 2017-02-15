/* IMPORT METEOR PACKAGES */
	// import { Session } from 'meteor/session'


/* IMPORT PAGE COMPONENTS */
	import './view.html';
	import './view.css';


/* IMPORT SHARED TEMPLATES + COMPONENTS */
	import '/imports/ui/pages/kitbags/line.js';
	import '/imports/ui/pages/notFound/noListObjectsFound.js';


/* IMPORT PROJECT OBJECTS */
	import { kb, appSettings } from '/imports/startup/both/sharedConstants.js';
	import { Kitbags } from '/imports/api/kitbags/kitbags.js';


/* PARAMETERS */
	var thisCollectionName = "Orgs";
	var thisAction = "view";
	var thisUrlId = "_orgId";


/* ONCREATED */
Template.orgView.onCreated(function() {
	// EMPTY 
});

/* ONRENDERED */
Template.orgView.onRendered(function(){
	// EMPTY
});


/* UTIL FUNCTIONS */
displayName = function (user) {
	console.log("TODO: Is displayName() required?");
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};


/* HELPERS */
Template.orgView.helpers({
	thisOrg: function (thisOrgId) {
		// return myOrg = kb.collections[thisCollectionName].findOne( FlowRouter.getParam(thisUrlId) );
		return kb.collections[thisCollectionName].findOne( FlowRouter.getParam(thisUrlId) );
	},
	createdBy: function() {
		try{
			var creator = Meteor.users.findOne(this.createdBy);

			if (!creator) {
				return "Unknown User ("+this.createdBy+")";
			}

			if (creator._id === Meteor.userId()){
				return "me";
			}else{
				return displayName(creator);
			}
		} catch (e) {
			console.log("Error on 'orgView.createdBy()' ",e);
		}
	},
	noFilter: function () {
		// There is no user filter in minilists - so we just return a null value for objectsFiltered()
		return;
	},
	minilistFilter_bags: function () {
		return {"assocOrgId": FlowRouter.getParam(thisUrlId) };
	},
	minilistFilter_users: function () {
		return {"profile.userAssocOrg": FlowRouter.getParam(thisUrlId) };
	},
	assocKitbagIds: function () {
		/* Tidies up the assocKitbagIds array */
		var arr = this.assocKitbagIds;
		var prefix = "<code>";
		var joiner = "</code><br><code>";
		var suffix = "</code>";
		if (typeof arr != "object" || arr.length <= 0) {
			return false;
		} else {
			return Spacebars.SafeString( prefix + arr.join(joiner) + suffix );
		}
	},
	// getOrgStatusTag: function () {
	// 	var labelClass, labelText;

	// 	switch(this.status.toLowerCase()) {
	// 		case "active":
	// 			labelClass = "label-success";
	// 			labelText = "Active";
	// 			break;
	// 		case "hidden":
	// 			labelClass = "label-warning";
	// 			labelText = "Hidden";
	// 			break;
	// 		case "deleted":
	// 		case "trashed":
	// 			labelClass = "label-default";
	// 			labelText = "Trashed";
	// 			break;
	// 		default:
	// 			labelClass = "label-danger";
	// 			labelText = "Unknown";
	// 		break;
	// 	}
	// 	//var tag = '<span class="label '+labelClass+'">'+labelText+'</span>';
	// 	return { 'labelClass': labelClass, 'labelText': labelText };
	// // },
	// // userNameLookup: function (userId, paramRequired) {
	// // 	var myUser = Meteor.users.findOne({_id: userId });

	// // 	var data = {};
	// // 	data.uname = (myUser && myUser.profile.displayName)?myUser.profile.displayName:"Profile Name not found";
	// // 	data.dbId  = userId;
	// // 	data.apiId = (myUser && myUser.profile.userId)?myUser.profile.userId:"API-ID not found";
	// // 	data.url   = "/users/"+userId+"/view";
	// // 	data.html  = "<a href='"+data.url+"'>"+data.uname+"</a>";

	// // 	return Spacebars.SafeString( data[paramRequired] );
	// }
});


/* EVENTS */
Template.orgView.events({
	// 'click button.submit': function(event) {
	// 	event.preventDefault();
	// 	alert('submit button!');
	// },
	// 'click button.cancel': function(event) {
	// 	event.preventDefault();
	// 	alert('cancel button!');
	// },
	'click li.setOrgStatus': function(event,a,b) {
		event.preventDefault();
		// var newStatus = event.target.categ.dataset.getAttribute('data-id')
		var field = "status";
		// newEvent = event;
		var parent = event.target.parentElement;
		var newValue = event.target.parentElement.getAttribute("data-status");
		console.log("EVENT updateOrgField",this._id,field,newValue,parent);
		// Meteor.call("updateOrgField",this._id,field,newValue);
	},
	'click .btn.trash': function(event) {
		event.preventDefault();
		globalTrash("TrashedByUser", "Orgs", this, Meteor.userId(), "#");
	},
	'click .btn.delete': function(event,a,b) {
		event.preventDefault();
		globalDelete("DeletedByUser", "Orgs", this, Meteor.userId(), "/orgs/list");
	}
});