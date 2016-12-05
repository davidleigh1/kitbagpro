
import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Lists } from '../../api/lists/lists.js';
// import { Template } from 'meteor/templating';
// import { ActiveRoute } from 'meteor/zimme:active-route';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { TAPi18n } from 'meteor/tap:i18n';


import './about.html';
import './about.css';
// import './components/pageHeader.js';
import '../../../ui/components/pageHeader.js';


// /imports/ui/components/pageHeader.js
// /imports/ui/pages/settings/settings.js

// Template.settings.helpers({
// 	pageTitle: function (attr) {
// 		return "I am  a page title";
// 		// "User/Account Details"
// 	},
// 	pageSubtitle: function (attr) {
// 		return "I am  a subtitle";
// 	},
// 	faIcon: function (attr) {
// 		return "fa-user-md";
// 	},
// 	thisUser: function (attr) {
// 		if (!Meteor.user()){
// 			var retString = 'guestUser ('+attr+')';
// 			return retString;
// 		}
// 		try {
// 			switch(attr) {
// 				case 'userId':
// 					return Meteor.userId();
// 					break;
// 				case 'profileName':
// 					// console.log(Meteor.user());
// 					return Meteor.user().profile.name;
// 					break;
// 				case 'userName':
// 					return Meteor.user().username;
// 					break;
// 				case 'firstName':
// 					return Meteor.user().profile.first_name;
// 					break;
// 				default:
// 					return 'noRequestedParam';
// 			}
// 		} catch(e) {
// 			return 'Error ('+e+')';
// 		}
// 	}
// });