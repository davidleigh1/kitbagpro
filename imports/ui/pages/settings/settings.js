
import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './settings.html';
import './settings.css';
// import './components/pageHeader.js';
import '../../../ui/components/pageHeader.js';

// import { Admin } from '/imports/api/admin/admin.js';
// import { Orgs } from '/imports/api/orgs/orgs.js';
// import { Kitbags } from '/imports/api/kitbags/kitbags.js';

// import { appSettings } from '/imports/startup/both/sharedConstants.js';


// /imports/ui/components/pageHeader.js
// /imports/ui/pages/settings/settings.js

Template.settings.helpers({
	pageTitle: function (attr) {
		return "I am  a page title";
		// "User/Account Details"
	},
	pageSubtitle: function (attr) {
		return "I am  a subtitle";
	},
	faIcon: function (attr) {
		return "fa-user-md";
	},
	thisUser: function (attr) {
		if (!Meteor.user()){
			var retString = 'guestUser ('+attr+')';
			return retString;
		}
		try {
			var notFound = "No value for '"+attr+"'";
			switch(attr) {
				case 'userExternalId':
					return (Meteor.user().externalId)?Meteor.user().externalId:notFound;
					break;
				case 'userInternalId':
					return (Meteor.userId())?Meteor.userId():notFound;
					break;
				case 'displayName':
					// console.log(Meteor.user());
					return (Meteor.user().displayName)?Meteor.user().displayName:notFound;
					break;
				case 'userName':
					return (Meteor.user().username)?Meteor.user().username:notFound;
					break;
				case 'firstName':
					return (Meteor.user().first_name)?Meteor.user().first_name:notFound;
					break;
				default:
					return "'"+attr+"' not found";
			}
		} catch(e) {
			return 'Error ('+e+')';
		}
	}
});